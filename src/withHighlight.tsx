import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useLayoutEffect, useRef } from "react";
import { View } from "react-native";
import Animated, { measure, runOnJS, runOnUI, useAnimatedRef } from "react-native-reanimated";
import { useHighlight } from "./HighlightProvider";
import ScrollEmitter from "./InternalScrollEmitter";
import { getStorageSettings, setStorageSettings } from "./storage";
import { WithHighlightProps } from "./types";
import { getHighlightShownState, setHighlightShownState } from "./utils";

const withHighlight = (highlightProps: WithHighlightProps) => {
  const {
    Component,
    componentRef,
    componentWrapperStyle,
    id,
    TooltipComponent,
    onHighlightPress,
    highlightSettings,
    topOffset,
    leftOffset,
    showDelay,
    showNextAfterComplete,
  } = highlightProps;
  return props => {
    const { showHighlight } = useHighlight();
    const aRef = useAnimatedRef<View>();
    const isScrolling = useRef(false);
    const isInFocus = useRef(false);
    const timeout = useRef<NodeJS.Timeout | null>(null);

    const checkAndShowHighlight = ({
      scrollFullSize,
      scrollVisibleSize,
      contentOffset,
    }: {
      scrollFullSize?: { height: number; width: number };
      scrollVisibleSize?: { height: number; width: number };
      contentOffset?: { x: number; y: number };
    }) => {
      requestAnimationFrame(() => {
        timeout.current = setTimeout(() => {
          if (getHighlightShownState(id) || isScrolling.current || !isInFocus.current) {
            return;
          }
          const settings = getStorageSettings(id);
          const overridenSettings = { ...settings, ...highlightSettings };
          setStorageSettings(id, overridenSettings);

          runOnUI(() => {
            "worklet";

            try {
              const measures = measure(aRef);
              if (measures === null) {
                return;
              }

              runOnJS(showHighlight)({
                id,
                position: {
                  height: measures.height,
                  width: measures.width,
                  x: measures.pageX,
                  y: measures.pageY,
                  topOffset,
                  leftOffset,
                  contentOffset,
                  scrollFullSize,
                  scrollVisibleSize,
                },
                TooltipComponent,
                onHighlightPress,
                showNextAfterComplete,
              });
            } catch (err) {
              // runOnJS(log)(err, "MEASURE ERROR");
            }
          })();
        }, showDelay ?? 1000);
      });
    };

    useLayoutEffect(() => {
      setHighlightShownState(id, false);
      const subscription = ScrollEmitter.addScrollListener(
        ({ scrollFullSize, scrollVisibleSize, contentOffset, isEnded }) => {
          isScrolling.current = true;
          if (isEnded) {
            isScrolling.current = false;
            checkAndShowHighlight({ scrollFullSize, scrollVisibleSize, contentOffset });
          }
        },
      );
      checkAndShowHighlight({});
      return () => {
        if (timeout.current !== null) {
          clearTimeout(timeout.current);
          timeout.current = null;
        }
        subscription.remove();
      };
    }, []);

    useFocusEffect(
      useCallback(() => {
        isInFocus.current = true;
        checkAndShowHighlight({});

        return () => {
          isInFocus.current = false;
        };
      }, []),
    );

    return (
      <Animated.View ref={aRef} collapsable={false} pointerEvents="box-none" style={[componentWrapperStyle]}>
        <Component {...props} ref={componentRef} />
      </Animated.View>
    );
  };
};

export default withHighlight;
