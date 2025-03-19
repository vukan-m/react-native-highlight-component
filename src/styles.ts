import { Dimensions } from "react-native";
import { BasicStyleProp } from "./types";

export const fullWidth = () => Dimensions.get("window").width;

export const fullHeight = () => Dimensions.get("window").height;

export const absolute: BasicStyleProp = { position: "absolute" };

export const absoluteZero: BasicStyleProp = {
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  };

  export const borderRadiusHalf = { borderRadius: 6 }; 
  export const singlePadding = {
    padding: 8,
  };

  export const regularFont: BasicStyleProp = {
    color: "#000000",
    fontSize: 16,
    includeFontPadding: false,
    textAlignVertical: "center",
    fontWeight: "normal",
  };

  export const smText = {
    ...(regularFont as {}),
    fontSize: 16,
    lineHeight: 22,
  };

  export const whiteBackground = {
    backgroundColor: "#ffffff",
  };