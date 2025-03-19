
# react-native-highlight-component

  

**react-native-highlight-component** is a React Native library that allows developers to highlight specific components within their applications. This functionality is particularly useful for onboarding tutorials, feature walkthroughs, or drawing user attention to particular UI elements.
  

## Features
- Highlight any React Native component with an overlay.​
- Customize the appearance of the highlight.​
- Support for components within scrollable views.

## Installation

To install the package, use either of the following commands:
  
Using npm:
```sh
npm install react-native-highlight-component
```

Using yarn:
```sh
yarn add react-native-highlight-component
```

  

## Usage

### Setting Up the Provider

In order for highlights to work, you must wrap your app with `HighlightProvider` and add `HighlightOverlay` within `HighlightProvider` at the same level as your app entry point:

```jsx
<SafeAreaProvider>
	<GestureHandlerRootView  style={[flex]}>
		<SafeAreaView  style={[flex]}>
			<HighlightProvider> // <-- Add this
				<Main  /> // <-- App entry point
				<HighlightOverlay  /> // <-- Add this
			</HighlightProvider>
		</SafeAreaView>
	</GestureHandlerRootView>
</SafeAreaProvider>
```

### Highlighting Components

Highlighting components is accomplished by using a **Higher-Order Component (HoC)**, `withHighlight`. You wrap the target component as follows:

```jsx
withHighlight({
  Component: ImageComponent,
  id: `image_component_${item?.id}`,
  TooltipComponent: "This is a tooltip.",
  onHighlightPress: openImage,
  topOffset: 16,
});

```

### Handling Scrollable Views

If the highlighted component is located inside a scroll view, you must either use our `ScrollWrapper` or pass our `scrollRef` to your scroll view component and assign a function to its `onScroll` method to use our `ScrollEmitter` in the following way:

#### Using `ScrollWrapper`

```jsx
import React from 'react';
import { Text, Image } from 'react-native';
import { ScrollWrapper, withHighlight } from 'react-native-highlight-component';

const App = () => {
  const HighlightedComponent = withHighlight({
    Component: Image,
    id: `example_image_component`,
    TooltipComponent: "This is an example image.",
  });
  return (
    <ScrollWrapper>
      <HighlightedComponent
        style={{width: 50, height: 50}}
        source={{
          uri: 'https://reactnative.dev/img/tiny_logo.png',
        }}
      />
    </ScrollWrapper>
  );
};

export default App;

```

#### Integrating `ScrollEmitter` and `scrollRef` with an existing ScrollView

```jsx
import React from 'react';
import { ScrollView } from 'react-native';
import { ScrollEmitter, scrollRef } from 'react-native-highlight-component';
import HighlightedComponent from './HighlightedComponent';

const App = () => {
  return (
    <ScrollView
      ref={scrollRef}
      onScroll={({ nativeEvent }) => {
        ScrollEmitter.emitScroll(
          nativeEvent.contentSize,
          nativeEvent.layoutMeasurement,
          nativeEvent.contentOffset
        );
      }}
    >
      <HighlightedComponent />
    </ScrollView>
  );
};

export default App;

```

### Using GIFs in Tooltips

To be able to use GIFs in your Tooltip Component, please follow these steps:

1.  Add this to your `app/build.gradle`:

```
dependencies {
  // your app's other dependencies
  implementation 'com.facebook.fresco:fresco:3.6.0'
}

```

2.  Add dependencies that suit your needs:

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

3.  Update your `MainApplication`:

```java
// ...
import com.facebook.drawee.backends.pipeline.Fresco; // <-- add this
// ...

public class MyApplication extends Application {
  @Override
  public void onCreate() {
    super.onCreate();
    Fresco.initialize(this); // <-- add this
  }
}
```

## Contributing

See the [contributing guide](https://chatgpt.com/c/CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/vukan-m/react-native-highlight-component/blob/master/LICENSE) file for more details.

----------

For more detailed information and advanced configurations, refer to the [GitHub repository](https://github.com/vukan-m/react-native-highlight-component).