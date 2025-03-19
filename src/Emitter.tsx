import { EmitterSubscription, NativeEventEmitter } from "react-native";
import { getHighlightId } from "./HighlightProvider";
import useDebounce from "./useDebounce";

type SizeType = { height: number; width: number };
type Listener = {
  listener: ({
    scrollFullSize,
    scrollVisibleSize,
    contentOffset,
    isEnded,
  }: {
    scrollFullSize: SizeType;
    scrollVisibleSize: SizeType;
    contentOffset: { x: number; y: number };
    isEnded: boolean;
  }) => void;
};

class Emitter {
  private emitter = new NativeEventEmitter();

  private scrollFullSize: SizeType = { height: 0, width: 0 };

  private scrollVisibleSize: SizeType = { height: 0, width: 0 };

  private contentOffset = { x: 0, y: 0 };

  private _emitScroll(
    scrollFullSize: { height: number; width: number },
    scrollVisibleSize: { height: number; width: number },
    contentOffset: { x: number; y: number },
    isEnded: boolean,
  ) {
    this.emitter.emit("scroll", { scrollFullSize, scrollVisibleSize, contentOffset, isEnded });
  }

  private debounceScrollEnded = useDebounce(
    (
      scrollFullSize: { height: number; width: number },
      scrollVisibleSize: { height: number; width: number },
      contentOffset: { x: number; y: number },
    ) => {
      this._emitScroll(scrollFullSize, scrollVisibleSize, contentOffset, true);
    },
    300,
    { trailing: true },
  );

  emitScroll(
    scrollFullSize: { height: number; width: number },
    scrollVisibleSize: { height: number; width: number },
    contentOffset: { x: number; y: number },
  ) {
    this.scrollFullSize.height = scrollFullSize.height;
    this.scrollFullSize.width = scrollFullSize.width;
    this.scrollVisibleSize.height = scrollVisibleSize.height;
    this.scrollVisibleSize.width = scrollVisibleSize.width;
    this.contentOffset.x = contentOffset.x;
    this.contentOffset.y = contentOffset.y;
    if (getHighlightId() !== null) {
      return;
    }
    this.debounceScrollEnded(scrollFullSize, scrollVisibleSize, contentOffset);
    this._emitScroll(scrollFullSize, scrollVisibleSize, contentOffset, false);
  }

  protected addScrollListener(listener: Listener["listener"]): EmitterSubscription {
    return this.emitter.addListener("scroll", listener);
  }

  /**
   * Get scroll full size (total size, including not rendered part).
   *
   * @return {*}  {SizeType}
   * @memberof Emitter
   */
  getScrollFullSize(): SizeType {
    return this.scrollFullSize;
  }

  /**
   * Get scroll window visible size (layout measured).
   *
   * @return {*}  {SizeType}
   * @memberof Emitter
   */
  getScrollVisibleSize(): SizeType {
    return this.scrollVisibleSize;
  }

  getContentOffset() {
    return this.contentOffset;
  }
}

export default Emitter;
