import { EmitterSubscription } from "react-native";
import Emitter from "./Emitter";

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

class InternalScrollEmitterClass extends Emitter {
  emitScroll(
    scrollFullSize: { height: number; width: number },
    scrollVisibleSize: { height: number; width: number },
    contentOffset: { x: number; y: number },
  ) {
    super.emitScroll(scrollFullSize, scrollVisibleSize, contentOffset);
  }

  addScrollListener(listener: Listener["listener"]): EmitterSubscription {
    return super.addScrollListener(listener);
  }

  getScrollFullSize(): SizeType {
    return super.getScrollFullSize();
  }

  getScrollVisibleSize(): SizeType {
    return super.getScrollVisibleSize();
  }

  getContentOffset() {
    return super.getContentOffset();
  }
}

const InternalScrollEmitter = new InternalScrollEmitterClass();
export default InternalScrollEmitter;
