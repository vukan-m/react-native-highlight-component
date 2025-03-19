import Emitter from "./Emitter";

class ScrollEmitterClass extends Emitter {
  public emitScroll(
    scrollFullSize: { height: number; width: number },
    scrollVisibleSize: { height: number; width: number },
    contentOffset: { x: number; y: number },
  ) {
    super.emitScroll(scrollFullSize, scrollVisibleSize, contentOffset);
  }

  /**
   * Get scroll full size (total size, including not rendered part).
   *
   * @return {*}
   * @memberof ScrollEmitterClass
   */
  getScrollFullSize() {
    return super.getScrollFullSize();
  }

  /**
   * Get scroll window visible size (layout measured).
   *
   * @return {*}
   * @memberof ScrollEmitterClass
   */
  getScrollVisibleSize() {
    return super.getScrollVisibleSize();
  }

  /**
   * Get current scrolled offset.
   *
   * @return {*}
   * @memberof ScrollEmitterClass
   */
  getContentOffset() {
    return super.getContentOffset();
  }
}

const ScrollEmitter = new ScrollEmitterClass();
export default ScrollEmitter;
