{
  "$schema": "https://schema.tauri.app/config/2",
  "productName": "{{PRODUCT_NAME}}",
  "version": "{{VERSION}}",
  "identifier": "{{IDENTIFIER}}",
  "build": {
    "beforeDevCommand": "npx next dev --port {{DEV_PORT}}{{NEXT_DEV_FLAGS}}",
    "devUrl": "http://localhost:{{DEV_PORT}}",
    "frontendDist": "../out"
  },
  "app": {
    "windows": [
      {
        "label": "main",
        "title": "{{TITLE}}",
        "width": {{WIDTH}},
        "height": {{HEIGHT}},
        "resizable": true,
        "fullscreen": {{FULLSCREEN}},
        "maximized": {{MAXIMIZED}},
        "center": true,
        "titleBarStyle": "{{TITLE_BAR_STYLE}}",
        "hiddenTitle": {{HIDDEN_TITLE}}
      }
    ],
    "security": {
      "csp": null
    }
  },
  "bundle": {
    "active": true,
    "targets": "all",
    "icon": [
      "icons/32x32.png",
      "icons/128x128.png",
      "icons/128x128@2x.png",
      "icons/icon.icns",
      "icons/icon.ico"
    ],
    "category": "Game",
    "shortDescription": "{{SHORT_DESCRIPTION}}",
    "longDescription": "{{LONG_DESCRIPTION}}"
  },
  "plugins": {
    "deep-link": {
      "desktop": {
        "schemes": {{DEEP_LINK_SCHEMES_JSON}}
      }
    }
  }
}
