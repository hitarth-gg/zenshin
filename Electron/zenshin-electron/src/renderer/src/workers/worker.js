import * as Comlink from 'comlink'

async function loadExtensions(extension) {
  console.log('Loading extensions:', extension)

  try {
    const extensionUrl = extension.startsWith('http') ? extension : `https://esm.sh/${extension}`
    const exts = await import(/* @vite-ignore */ extensionUrl) // Dynamically import the extension
    const { Tosho } = exts // Assuming `default` is the main export
    console.log('Extensions: ', Tosho)
    //export { default as Tosho } from "./extensions/tosho.js"; : tosho is the default export which is an instance of Class containing the getToshoEpisodes function
    return Tosho
  } catch (error) {
    console.error('Error loading extensions:', error)
    return null
  }
}

async function initialize(extension) {
  const Tosho = await loadExtensions(extension)
  console.log('initialization')

  if (Tosho) {
    const toshoExtension = {
      getToshoEpisodes: async (options) => {
        try {
          const { quality, aids, eids } = options
          const data = await Tosho.getToshoEpisodes(quality, aids, eids)

          return data
        } catch (error) {
          console.error('Error fetching episodes:', error)
          throw error
        }
      },
      getNewReleases: async (options) => {
        try {
          const { packer } = options
          const data = await Tosho.getNewReleases(packer)
          console.log(data)

          return data
        } catch (error) {
          console.error('Error fetching episodes:', error)
          throw error
        }
      }
    }

    Comlink.expose(toshoExtension)
  } else {
    console.error('Failed to load extension.')
  }
}
initialize('gh/hitarth-gg/mizukijs')
console.log('Worker initialized')
