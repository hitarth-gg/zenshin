// DiscordRPC.js
import { Client, register } from 'discord-rpc'
class DiscordRPC {
  constructor(clientId) {
    this.clientId = clientId
    this.client = new Client({ transport: 'ipc' })

    this.client.on('ready', () => {
      console.log('Discord RPC is ready!')
    })
  }

  initialize() {
    register(this.clientId)
    this.client.login({ clientId: this.clientId }).catch(() => {
      setTimeout(() => this.initialize(), 5000).unref()
    })
  }

  setActivity(activityDetails) {
    if (!this.client || !this.client.user) return

    this.client.request('SET_ACTIVITY', {
      pid: process.pid,
      activity: {
        timestamps: { start: Date.now() },
        details: activityDetails.details || 'Browsing Anime',
        state: activityDetails.state || 'Looking for anime to watch',
        assets: {
          // large_image: activityDetails.largeImageKey || 'logo',
          // large_text: activityDetails.largeImageText || 'Anime Time!',
          // small_image: activityDetails.smallImageKey || 'logo',
          // small_text: activityDetails.smallImageText || 'Zenshin'
          ...activityDetails.assets
        },

        buttons: [
          {
            label: 'Download app',
            url: 'https://github.com/hitarth-gg/zenshin/releases/latest'
          }
        ],
        instance: true,
        type: 3
      }
    })
  }
  disconnect() {
    this.client.destroy().then(() => {
      console.log('RPC client disconnected.')
    })
  }
}

export default DiscordRPC
