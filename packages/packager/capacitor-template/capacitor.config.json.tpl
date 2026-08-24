{
  "appId": "{{APP_ID}}",
  "appName": "{{APP_NAME}}",
  "webDir": "www",
  "bundledWebRuntime": false,
  "server": {
    "androidScheme": "https",
    "iosScheme": "capacitor",
    "hostname": "localhost"
  },
  "ios": {
    "scheme": "App",
    "contentInset": "automatic",
    "scrollEnabled": false,
    "backgroundColor": "{{BACKGROUND_HEX}}"
  },
  "android": {
    "backgroundColor": "{{BACKGROUND_HEX}}",
    "allowMixedContent": false,
    "captureInput": true,
    "webContentsDebuggingEnabled": false
  }
}
