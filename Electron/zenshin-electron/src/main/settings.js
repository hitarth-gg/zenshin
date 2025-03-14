import { app, dialog } from 'electron'
import path from 'path'
import fs from 'fs'

const zenshinPathDocuments = app.getPath('documents') + '/Zenshin'
const settingsPath = path.join(zenshinPathDocuments, 'settings.json')
let defaultDownloadsDir = path.join(app.getPath('downloads'), 'ZenshinDownloads')

let backendPort = 64621

export default class Settings {
  constructor() {
    this.defaultSettings = {
      uploadLimit: -1,
      downloadLimit: -1,
      downloadsFolderPath: defaultDownloadsDir,
      backendPort: backendPort,
      broadcastDiscordRpc: true,
      extensionUrls: {}
    }

    this.settings = this.loadSettings()
  }

  loadSettings() {
    // create settings.json file if it doesn't exist
    let settings = this.defaultSettings
    if (!fs.existsSync(settingsPath)) {
      try {
        this.settings = settings
        this.saveSettings()
      } catch (error) {
        console.error('Error creating settings.json file:', error)
        dialog.showErrorBox('Error creating settings.json file:', error.message)
      }
    } else {
      try {
        settings = JSON.parse(fs.readFileSync(settingsPath))
      } catch (error) {
        console.error('Error reading settings.json file:', error)
        dialog.showErrorBox('Error reading settings.json file:', error.message)
      }
    }
    return settings
  }

  saveSettings() {
    try {
      fs.writeFileSync(settingsPath, JSON.stringify(this.settings, null, 2)) // null, 2 is for pretty printing
    } catch (error) {
      console.error('Error writing settings.json file:', error)
      dialog.showErrorBox('Error writing settings.json file:', error.message)
    }
  }

  get(key) {
    return this.settings[key]
  }

  set(key, value) {
    this.settings[key] = value
    this.saveSettings()
  }

  getSettings() {
    return this.settings
  }

  getDefaultSettings() {
    return this.defaultSettings
  }
}
