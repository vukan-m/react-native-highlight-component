import React from "react";
import { Text, View } from "react-native";
import Animated, {
  measure,
  runOnJS,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import Svg, { Mask, Rect } from "react-native-svg";
import { useHighlight } from "./HighlightProvider";
import { setStorageSettings } from "./storage";
import { HighlightComponentSettings } from "./types";
import { absolute, absoluteZero, borderRadiusHalf, fullHeight, fullWidth, singlePadding, smText, whiteBackground } from "./styles";

const HighlightOverlay = () => {
  const { highlightedComponent, hideHighlight } = useHighlight();

  if (!highlightedComponent) return null;

  const {
    position: { x, y, width, height },
    TooltipComponent,
    tooltipComponentWrapperStyle,
    onHighlightPress,
  } = highlightedComponent;
  const aRef = useAnimatedRef();
  const opacity = useSharedValue(0);
  const top = useSharedValue(0);
  const left = useSharedValue(0);

  const dismissHighlight = (isCompleted = false) => {
    const newSettings: Partial<HighlightComponentSettings> = {};
    newSettings.isCompleted = isCompleted;
    newSettings.lastShownDate = new Date().getTime();

    setStorageSettings(highlightedComponent.id, newSettings);

    hideHighlight(highlightedComponent.showNextAfterComplete ?? !isCompleted);
  };

  const handleOverlayPress = (e) => {
    const { pageX, pageY } = e.nativeEvent;
    const componentMinX = x;
    const componentMaxX = x + width;
    const componentMinY = y;
    const componentMaxY = y + height;
    if (componentMinX < pageX && componentMaxX > pageX && componentMinY < pageY && componentMaxY > pageY) {
      onHighlightPress?.();
      dismissHighlight(true);
    } else {
      dismissHighlight();
    }
  };

  const aStyle = useAnimatedStyle(() => {
    return { opacity: opacity.value, top: top.value, left: left.value };
  });

  const handleLayout = () => {
    const screenHeight = fullHeight();
    const screenWidth = fullWidth();
    runOnUI(() => {
      "worklet";

      try {
        const measures = measure(aRef);
        if (measures === null) {
          return;
        }
        const componentHighestY = y + height;
        const tooltipHightestX = x + measures.width;
        if (screenHeight - componentHighestY > measures.height) {
          top.value = componentHighestY + 12;
        } else if (screenHeight - componentHighestY < measures.height) {
          top.value = y - 12 - measures.height;
        }
        if (screenWidth > tooltipHightestX) {
          left.value = x;
        } else {
          left.value = screenWidth - measures.width;
        }
        opacity.value = withTiming(1);
      } catch (err) {
        // console.log(err, "MEASURE ERROR");
      }
    })();
  };

  return (
    <View style={[absolute, absoluteZero]}>
      <Svg height="100%" width="100%">
        <Mask id="mask">
          <Rect x={0} y={0} width="100%" height="100%" fill="white" />
          <Rect x={x} y={y} width={width} height={height} fill="black" onLayout={handleLayout} />
        </Mask>
        <Rect
          x={0}
          y={0}
          width="100%"
          height="100%"
          fill="rgba(0,0,0,0.7)"
          mask="url(#mask)"
          onPress={handleOverlayPress}
        />
      </Svg>

      {/* Tooltip */}
      {TooltipComponent && (
        <Animated.View
          style={[absolute, whiteBackground, singlePadding, borderRadiusHalf, tooltipComponentWrapperStyle, aStyle]}
          pointerEvents="none"
          ref={aRef}
        >
          {typeof TooltipComponent === "string" ? (
            <Text style={[smText]}>{TooltipComponent}</Text>
          ) : (
            <TooltipComponent />
          )}
        </Animated.View>
      )}
    </View>
  );
};

export default HighlightOverlay;
