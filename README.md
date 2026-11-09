<p align="center">
   <img alt="Thinger.io" src="https://www.thinger.io/wp-content/uploads/2015/03/platform_logo.png" width="400"/>
</p>

# Thinger.io Mobile App Client

Mobile App source code for the [Thinger.io](https://thinger.io) Internet of Things Platform. 

## Overview

The app lets you interact with your Thinger.io IoT devices: read sensor values, change LED or relay states, and plot resources in real time. It is available for Android and iOS.

There are two ways to add devices:

- **Sign in** with your Thinger.io account (or your own server) to list all the devices of the account.
- **Scan a device token** as a QR code (or paste it from the clipboard) to access a single device without signing in.

Only HTTPS servers are accepted (`http://localhost` is allowed for development). Session tokens and device tokens are stored in the iOS Keychain / Android private storage; passwords are never stored.

## Development

Requirements: Node.js, Yarn, the [React Native CLI](https://facebook.github.io/react-native/docs/getting-started.html) (React Native 0.54), Xcode for iOS and Android Studio / Android SDK for Android.

```bash
yarn install
react-native link
```

Run the app:

```bash
yarn start            # Metro bundler
react-native run-ios
react-native run-android
```

Checks:

```bash
yarn lint
yarn test
```

Android release builds are signed with the `THINGER_APP_RELEASE_*` properties defined in your `~/.gradle/gradle.properties`.

## Contributors

Any help is always welcome! If you feel confident about some feature to implement, or want to fix a bug, or improve the existing code, please, submit a pull request! :)

## License

<img align="right" src="http://opensource.org/trademarks/opensource/OSI-Approved-License-100x137.png">

The class is licensed under the [MIT License](http://opensource.org/licenses/MIT):

Copyright &copy; 2015 [THINGER LTD](http://thinger.io)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON INFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
