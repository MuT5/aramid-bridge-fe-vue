import getAlgorandConfigTransaction from '../algo/getAlgorandConfigTransaction'
import type { IConfig } from '../interface/aramid/IConfig'
import type { PublicConfigurationRoot } from '../interface/mapping/PublicConfigurationRoot'
import getAppConfiguration from './getAppConfiguration'
import fileMapping from '@/env/public-configuration.ipfs'
import CryptoJS from 'crypto-js'
import getLogger from './getLogger'
import loadIPFSFile from '../ipfs/loadFile'
import asyncdelay from './asyncDelay'
import { useAppStore } from '@/stores/app'

let loading = false
const getPublicConfiguration = async (reload: boolean): Promise<PublicConfigurationRoot | null> => {
  const store = useAppStore()
  const logger = await getLogger()
  try {
    while (loading) {
      await asyncdelay(10)
    }
    if (!reload) {
      if (store.state.publicConfiguration !== null) return store.state.publicConfiguration
      console.log('currentMapping', store.state.publicConfiguration)
    }
    loading = true

    const appConfiguration = await getAppConfiguration()
    if (appConfiguration === null) return null

    if (appConfiguration.useFilesystemPublicConfiguration) {
      const copy = { ...fileMapping }
      copy.hash = CryptoJS.SHA256(JSON.stringify(fileMapping)).toString()
      logger.info(`${new Date()} Loaded configuration from localstorage. Hash: ${copy.hash}`)
      store.state.publicConfiguration = copy
      loading = false
      console.log('loading', loading, store.state.publicConfiguration)
      return store.state.publicConfiguration
    }
    const controlTx = await getAlgorandConfigTransaction(
      appConfiguration.mainToken,
      appConfiguration.mainNetwork,
      appConfiguration.configurationAddress
    )
    if (!controlTx) {
      throw 'Unable to load configuration'
    }
    let note = Buffer.from(controlTx.note, 'base64').toString('utf-8')
    if (!note.startsWith('aramid-config/v1:j')) {
      throw 'Unable to load configuration'
    }
    note = note.replace('aramid-config/v1:j', '')
    const configMessage: IConfig = JSON.parse(note)
    const data = await loadIPFSFile(configMessage.ipfsHash)
    const mappingFromWeb: PublicConfigurationRoot = data
    mappingFromWeb.hash = CryptoJS.SHA256(JSON.stringify(mappingFromWeb)).toString()
    store.state.publicConfiguration = mappingFromWeb
    logger.info(`${new Date()} Loaded configuration from hash: ${mappingFromWeb.hash}`)
    console.log('loaded configuration from ipfs:', store.state.publicConfiguration)

    loading = false
    return mappingFromWeb
  } catch (e) {
    logger.error('error loading mapping', e)
    loading = false
  }
  return store.state.publicConfiguration
}
export default getPublicConfiguration
