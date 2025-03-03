# zenshin-electron

An Electron application with React

## Recommended IDE Setup

- [VSCode](https://code.visualstudio.com/) + [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint) + [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)

## Project Setup

### Install

```bash
$ npm install
```

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

## Running on Android

To run this application on an Android device, you can use Cordova to package the Electron application as an APK.

### Install Cordova

```bash
$ npm install -g cordova
```

### Create a new Cordova project

```bash
$ cordova create zenshin-cordova com.zenshin.app Zenshin
```

### Copy existing Electron application files into the Cordova project

Copy the contents of the `Electron/zenshin-electron` directory into the `zenshin-cordova/www` directory.

### Build the APK using Cordova CLI

```bash
$ cd zenshin-cordova
$ cordova platform add android
$ cordova build android
```
