import React, { useCallback } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { scrollRef } from "./HighlightProvider";
import ScrollEmitter from "./InternalScrollEmitter";
import { ScrollWrapperProps } from "./types";

const ScrollWrapper = (props: ScrollWrapperProps) => {
  const { children, contentContainerStyle, style } = props;
  const onScroll = useCallback(({ nativeEvent }) => {
    ScrollEmitter.emitScroll(nativeEvent.contentSize, nativeEvent.layoutMeasurement, nativeEvent.contentOffset);
  }, []);
  return (
    <ScrollView ref={scrollRef} onScroll={onScroll} style={style} contentContainerStyle={contentContainerStyle}>
      {children}
    </ScrollView>
  );
};

export default ScrollWrapper;
