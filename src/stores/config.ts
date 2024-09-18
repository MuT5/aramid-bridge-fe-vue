import { reactive } from 'vue'
import { defineStore } from 'pinia'
import type { AppConfiguration } from '@/scripts/interface/configuration/AppConfiguration'
export const useConfigStore = defineStore('app', () => {
  const state = reactive<AppConfiguration>({
    loading: true,
    wcProjectId: '',
    mainNetwork: 101003,
    mainToken: 100,
    configurationAddress: 'EGRNQAIVBY4O47XJNCLIYZGSHBQIKYC25VWEHBQVFRUACCXBR7TDSKISSA',
    environment: 'mainnet',
    initChainFrom: 416001,
    initChainTo: 416102,
    initTokenFrom: '31566704',
    initTokenTo: '26168978',
    debug: false,
    soldierId: '',
    useFilesystemPublicConfiguration: false,
    encryptionKey: '',
    showClaimButton: true
  })

  return { state }
})
