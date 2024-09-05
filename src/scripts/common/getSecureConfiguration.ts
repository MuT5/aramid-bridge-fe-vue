/**
 * To generate secure key and iv, use openssl rand -hex 16
 */
import type { SecureConfiguration } from '../interface/configuration/SecureConfiguration'
import getLogger from './getLogger'
import config from '@/env/secure.json'
let currentConfiguration: SecureConfiguration | null = null
const getSecureConfiguration = async (): Promise<SecureConfiguration | null> => {
  const logger = await getLogger()
  try {
    if (currentConfiguration !== null) return currentConfiguration
    const fileStorage: SecureConfiguration = config
    currentConfiguration = fileStorage
    return fileStorage
  } catch (e) {
    logger.error('Error reading secure configuration', e)
    return null
  }
}
export default getSecureConfiguration
