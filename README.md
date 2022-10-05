# SimpleHold React-Native SDK

[sh-mobile-sdk](https://www.npmjs.com/package/sh-mobile-sdk) is SimpleHold react native SDK, it allows you to request wallets.

- Table of Contents
  - [Installation](#installation)
  - [Configuring Android](#configuring-android)
  - [Configuring iOS](#configuring-ios)
  - [Example](#example)
  - [Usage](#usage)
  - [Contributing](#contributing)
  - [License](#license)

## Installation

```shell
yarn add sh-mobile-sdk
```

## Configuring Android

Make sure you have set up intent-filter for your app ([documentation here](https://developer.android.com/training/app-links/deep-linking#adding-filters))

The `example` app settings:

```xml
<activity
  android:name=".MainActivity"
  android:launchMode="singleTask"
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <data android:scheme="example-app"/>
    </intent-filter>
</activity>
```

## Configuring iOS

Make sure you have set up url scheme for your app (Open Xcode an click on your project. Go to the 'Info' tab and expand the 'URL Types' group).

The `example` app settings:

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleTypeRole</key>
    <string>Editor</string>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>example-app</string>
    </array>
  </dict>
</array>
```

```objc
// iOS 9.x or newer
#import <React/RCTLinkingManager.h>

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

// If your app is using Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity
 restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}
```

## Example

Run iOS

```shell
react-native run-ios
```

Run Android

```shell
react-native run-android
```

## Usage

import the package:

```typescript
import SimpleHoldSDK from "sh-mobile-sdk";
```

initialize an instance, e.g. in `componentDidMount`:

```typescript
const sh = new SimpleHoldSDK("<your_app_scheme>://");
```

request wallets:

```typescript
sh.requestWallets()
  .then((wallets) => {
    Alert.alert("Wallets", wallets.join("\n"));
  })
  .catch((error) => {
    Alert.alert("Error", JSON.stringify(error));
  });
```

clean up all resolve handlers, e.g. in`componentWillUnmount`:

```typescript
sh.cleanup();
```

## Contributing

You are welcome! Create pull requests and help to improve the package.

## License

MIT
