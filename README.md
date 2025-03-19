
# react-native-highlight

  

Highlight React Native Components

  

## Installation

  
For npm:
```sh
npm  install  react-native-highlight
```

Or yarn:
```sh
yarn add react-native-highlight
```

  

## Usage

  

If highlighted component is located inside a scroll view, you must either use our `ScrollWrapper` or pass our `scrollRef` to your scroll view component and assign a function to its `onScroll` method to use our `ScrollEmitter` in the following way:

```js

onScroll={({nativeEvent}) => {
	ScrollEmitter.emitScroll(nativeEvent.contentSize, nativeEvent.layoutMeasurement, nativeEvent.contentOffset);
}};

```

  

To be able to use gifs in your Tooltip Component please follow these steps:

1. Add this to your `app/build.gradle`:

```
dependencies {
	// your app's other dependencies
	implementation 'com.facebook.fresco:fresco:3.6.0'
}
```

2. Add dependencies that suite your needs:

```
dependencies {
// For animated GIF support
implementation 'com.facebook.fresco:animated-gif:3.6.0'

// For WebP support, including animated WebP
implementation 'com.facebook.fresco:animated-webp:3.6.0'
implementation 'com.facebook.fresco:webpsupport:3.6.0'

// For WebP support, without animations
implementation 'com.facebook.fresco:webpsupport:3.6.0'

// Provide the Android support library (you might already have this or a similar dependency)
implementation 'com.android.support:support-core-utils:24.2.1'
}
```

3. Update your MainApplication

```java
// ...
import com.facebook.drawee.backends.pipeline.Fresco; // <-- add this
// ...

public  class  MyApplication  extends  Application {

	@Override
	public  void  onCreate() {
		super.onCreate();
		Fresco.initialize(this); // <-- add this
	}
}
```

  

## Contributing

  

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

  

## License

  

MIT