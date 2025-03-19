import React from "react";
import { ImageStyle, StyleProp, TextStyle, ViewStyle } from "react-native";

export type BasicStyleProp = StyleProp<ViewStyle | TextStyle | ImageStyle>;

export type HiglightComponentPositionType = {
  x: number;
  y: number;
  width: number;
  height: number;

  /**
   * Scroll views offset from top of the screen.
   *
   * @type {number}
   */
  topOffset?: number;

  /**
   * Scroll views offset from left of the screen.
   *
   * @type {number}
   */
  leftOffset?: number;
  contentOffset?: { x: number; y: number };
  scrollFullSize?: { height: number; width: number };
  scrollVisibleSize?: { height: number; width: number };
};

export type HighlightedComponentStateType = {
  /**
   * Unique id for each component.
   *
   * @type {string}
   */
  id: string;

  position: HiglightComponentPositionType;

  /**
   *  Component to display for tooltip. Can be plain text or component.
   *
   * @type {(React.FC<any> | string)}
   */
  TooltipComponent?: React.FC<any> | string;

  /**
   * Style for view wrapping tooltip component.
   *
   * @type {BasicStyleProp}
   */
  tooltipComponentWrapperStyle?: BasicStyleProp;

  /**
   * Action to do on pressing highlighted area.
   *
   */
  onHighlightPress?: () => void;

  /**
   * Indicating if you should highlight next component after
   * highlighted action was completed. This works only if the highlight action doesn't interfere with the component focus
   * (for example navigating to a different screen).
   * Default value is false.
   *
   * @type {boolean}
   */
  showNextAfterComplete?: boolean;
};

export type HighlightComponentSettings = {
  /**
   * Display highlight until user clicks on it, not the overlay.
   * The default value is true.
   *
   * @type {boolean}
   */
  displayUntilComplete: boolean;

  /**
   * Period in days in which to display highlight. Value of 0 means show only once.
   * The default value is 0.
   *
   * @type {number}
   */
  displayPeriod: number;

  /**
   * Display higlight on x amount of renders. Value of 0 means show only once.
   * The default value is 0.
   *
   * @type {number}
   */
  displayCountPeriod: number;

  /**
   * Representing if the component was highlighted at least once.
   *
   * @type {boolean}
   */
  isShown: boolean;

  /**
   * How many times the component was rendered.
   *
   * @type {number}
   */
  shownCount: number;

  /**
   * Indicating if the highlight was closed by pressing on the highlighted part.
   * If the overlay was pressed this field remains unchanged.
   *
   * @type {boolean}
   */
  isCompleted: boolean;

  /**
   * When was the last time the component was highlighted.
   * Value is represented in timestamp.
   *
   * @type {number}
   */
  lastShownDate: number; // timestamp
};

export type HiglightContextType = {
  highlightedComponent: HighlightedComponentStateType;
  showHighlight: (props: HighlightedComponentStateType) => void;
  hideHighlight: (displayNext?: boolean) => void;
  getNext: () => string | null;
  showNext: () => void;
  getCurrentHighlightId: () => string | null;
};

export type WithHighlightProps = Omit<HighlightedComponentStateType, "position"> &
  Pick<HighlightedComponentStateType["position"], "topOffset" | "leftOffset"> & {
    /**
     * Component to highlight.
     *
     * @type {React.FC<any>}
     */
    Component: React.FC<any>;

    /**
     * If provided component is wrapped with forwardRef,
     * you must pass the ref as a prop instead of assigning it to the ref.
     *
     * @type {React.RefObject<any>}
     */
    componentRef?: React.RefObject<any>;

    /**
     * Style for the component wrapper view.
     *
     * @type {BasicStyleProp}
     */
    componentWrapperStyle?: BasicStyleProp;

    /**
     * Highlight settings for component.
     * Customize options when to higlight component.
     * Unique for each component.
     *
     * @type {HighlightComponentSettings}
     */
    highlightSettings?: HighlightComponentSettings;

    /**
     * Delay interval after which to highlight the component.
     *
     * @type {number}
     */
    showDelay?: number;
  };

export interface CallOptions {
  leading?: boolean;
  trailing?: boolean;
}
export interface Options extends CallOptions {
  maxWait?: number;
}
export interface ControlFunctions {
  cancel: () => void;
  flush: () => void;
  isPending: () => boolean;
}

export interface DebouncedState<T extends (...args: any[]) => ReturnType<T>> extends ControlFunctions {
  (...args: Parameters<T>): ReturnType<T>;
}

export type ScrollWrapperProps = {
  children: React.ReactNode;
  style?: BasicStyleProp;
  contentContainerStyle?: BasicStyleProp;
};
