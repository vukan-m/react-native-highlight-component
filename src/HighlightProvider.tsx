/* eslint-disable react/jsx-no-constructed-context-values */
import { fullHeight, fullWidth } from "@nature-digital/styles";
import React, { createContext, createRef, useContext, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { getStorageSettings, setStorageSettings } from "./storage";
import { HighlightedComponentStateType, HiglightComponentPositionType, HiglightContextType } from "./types";
import useDebounce from "./useDebounce";
import { setHighlightShownState, shouldDisplayHighlight } from "./utils";
import ScrollEmitter from "./InternalScrollEmitter";

const HighlightContext = createContext<HiglightContextType>(null as any);
export const scrollRef = createRef<ScrollView>();

const queueOrder = new Set<string>();
const queueItem = new Map<string, HighlightedComponentStateType>();
let highlightedComponentId: string | null = null;

const getAdjustedPositions = (
  position: HiglightComponentPositionType,
  isVisibleOnY: boolean,
  isVisibleOnX: boolean,
) => {
  const adjustedPosition: {
    position: HiglightComponentPositionType;
    scroll: { y: number | undefined; x: number | undefined };
  } = { position: { ...position }, scroll: { y: undefined, x: undefined } };
  if (isVisibleOnY) {
    if (position.contentOffset?.y !== undefined && position.contentOffset?.y !== 0) {
      adjustedPosition.position.y = position?.topOffset ?? 0;
      adjustedPosition.scroll.y = position.y + position.contentOffset.y - (position.topOffset ?? 0);
    } else {
      adjustedPosition.position.y = position.y;
      adjustedPosition.scroll.y = undefined;
    }
  }
  if (!isVisibleOnY) {
    if (position.contentOffset?.y !== undefined && position.contentOffset.y !== 0) {
      adjustedPosition.position.y = position.topOffset ?? 0;
      adjustedPosition.scroll.y = position.y + position.contentOffset.y - (position.topOffset ?? 0);
    } else {
      adjustedPosition.position.y = position.topOffset ?? 0;
      adjustedPosition.scroll.y = position.y - (position.topOffset ?? 0);
    }
  }
  if (isVisibleOnX) {
    if (position.contentOffset?.x !== undefined && position.contentOffset?.x !== 0) {
      adjustedPosition.position.x = position?.leftOffset ?? 0;
      adjustedPosition.scroll.x = position.x + position.contentOffset.x - (position.leftOffset ?? 0);
    } else {
      adjustedPosition.position.x = position.x;
      adjustedPosition.scroll.x = undefined;
    }
  }
  if (!isVisibleOnX) {
    if (position.contentOffset?.x !== undefined && position.contentOffset.x !== 0) {
      adjustedPosition.position.x = position.leftOffset ?? 0;
      adjustedPosition.scroll.x = position.x + position.contentOffset.x - (position.leftOffset ?? 0);
    } else {
      adjustedPosition.position.x = position.leftOffset ?? 0;
      adjustedPosition.scroll.x = position.x - (position.leftOffset ?? 0);
    }
  }
  // Fake scroll in order to obtain scroll size
  if (position.scrollFullSize === undefined || position.scrollVisibleSize === undefined) {
    scrollRef.current?.scrollTo({ y: 0.3 });
    position.scrollFullSize = ScrollEmitter.getScrollFullSize();
    position.scrollVisibleSize = ScrollEmitter.getScrollVisibleSize();
  }
  const isScrollToTopYPossible =
    adjustedPosition.scroll.y === undefined ||
    (position.scrollFullSize?.height ?? 0) - (position.scrollVisibleSize?.height ?? 0) > adjustedPosition.scroll.y;
  const isScrollToTopXPossible =
    adjustedPosition.scroll.x === undefined ||
    (position.scrollFullSize?.width ?? 0) - (position.scrollVisibleSize?.width ?? 0) > adjustedPosition.scroll.x;

  if (!isScrollToTopYPossible) {
    adjustedPosition.position.y = position.y - (position.scrollFullSize.height - position.scrollVisibleSize.height);
  }
  if (!isScrollToTopXPossible) {
    adjustedPosition.position.x = position.x - (position.scrollFullSize.width - position.scrollVisibleSize.width);
  }

  return adjustedPosition;
};

export const getHighlightId = () => {
  return highlightedComponentId;
};
export const HighlightProvider = ({ children }) => {
  const [highlightedComponent, setHighlightedComponent] = useState<HighlightedComponentStateType | null>(null);

  const privateShowHighlight = () => {
    const highlightToShow = queueOrder?.values?.()?.next?.()?.value;
    if (!highlightToShow) {
      return;
    }
    const highlight = queueItem.get(highlightToShow);
    if (!highlight) {
      return;
    }
    queueOrder.delete(highlightToShow);
    queueItem.delete(highlightToShow);
    const [height, width] = [fullHeight(), fullWidth()];
    const { position } = highlight;

    const visibleOnX = position.x >= 0 && position.x + position.width <= width;
    const visibleOnY = position.y >= 0 && position.y + position.height <= height;

    const settings = getStorageSettings(highlight.id);
    settings.shownCount++;
    settings.isShown = true;
    setStorageSettings(highlight.id, settings);
    const shouldDisplay = shouldDisplayHighlight(settings);
    if (!shouldDisplay) {
      return;
    }
    setHighlightShownState(highlight.id, true);
    const adjustedPositions = getAdjustedPositions(position, visibleOnY, visibleOnX);

    scrollRef?.current?.scrollTo?.({
      y: adjustedPositions.scroll.y,
      x: adjustedPositions.scroll.x,
      animated: true,
    });

    highlightedComponentId = highlight.id;
    setHighlightedComponent({
      ...highlight,
      position: adjustedPositions.position,
    });
  };

  const getNext: HiglightContextType["getNext"] = () => {
    if (queueOrder.size < 1) {
      return null;
    }
    const nextInLine = queueOrder.values().next().value;
    if (!nextInLine) {
      return null;
    }
    return nextInLine;
  };

  const showNext: HiglightContextType["showNext"] = () => {
    if (getNext() === null) {
      return;
    }
    privateShowHighlight();
  };

  const debouncedShow = useDebounce(
    () => {
      const sortedOrder = Array.from(queueOrder)
        .sort((q1, q2) => {
          const item1 = queueItem.get(q1) ?? { position: { y: 0, x: 0 } };
          const item2 = queueItem.get(q2) ?? { position: { y: 0, x: 0 } };
          if (item1.position.y !== item2.position.y) {
            return item1.position.y > item2.position.y ? 1 : -1;
          }
          return item1.position.x > item2.position.x ? 1 : -1;
        })
        .filter(i => {
          const shouldDisplay = shouldDisplayHighlight(getStorageSettings(i));
          if (!shouldDisplay) {
            queueItem.delete(i);
          }
          return shouldDisplay;
        });
      queueOrder.clear();
      sortedOrder.forEach(i => queueOrder.add(i));
      if (getHighlightId() === null) {
        showNext();
      }
    },
    300,
    { trailing: true },
  );

  const showHighlight: HiglightContextType["showHighlight"] = props => {
    queueOrder.add(props.id);
    queueItem.set(props.id, props);
    debouncedShow();
  };

  const getCurrentHighlightId: HiglightContextType["getCurrentHighlightId"] = () => {
    return highlightedComponentId;
  };

  const hideHighlight: HiglightContextType["hideHighlight"] = displayNext => {
    highlightedComponentId = null;
    setHighlightedComponent(null);
    if (displayNext) {
      getNext() !== null && showNext();
    } else {
      queueOrder.clear();
      queueItem.clear();
    }
  };

  return (
    <HighlightContext.Provider
      value={{
        highlightedComponent: highlightedComponent as any,
        showHighlight,
        hideHighlight,
        getNext,
        showNext,
        getCurrentHighlightId,
      }}
    >
      {children}
    </HighlightContext.Provider>
  );
};

export const useHighlight = () => useContext(HighlightContext);
