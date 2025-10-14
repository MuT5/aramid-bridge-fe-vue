import './assets/main.css'
import { NetworkId, WalletId, WalletManagerPlugin } from '@txnlab/use-wallet-vue'
import { NetworkId as AVMNetworkId, WalletId as AVMWalletId, WalletManagerPlugin as AVMWalletManagerPlugin } from 'avm-wallet-vue'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import i18n from './i18n'

import ToastService from 'primevue/toastservice'
import Tooltip from 'primevue/tooltip'
import './assets/base.css'
import Aura from '@/presets/lara' //import preset
const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)

app.use(PrimeVue, {
  unstyled: true,
  pt: Aura
})
app.directive('tooltip', Tooltip)
app.use(ToastService)

// Install the plugin
app.use(WalletManagerPlugin, {
  wallets: [
    WalletId.DEFLY,
    WalletId.PERA,
    WalletId.EXODUS,
    WalletId.KIBISIS,
    {
      id: WalletId.BIATEC,
      options: {
        projectId: '54958e07dbb79eedf5cd5564bf16d817',
        metadata: {
          name: 'Aramid Finance Dapp',
          description: 'Aramid Finance Bridge between Algorand, Voi, Near, Ethereum, Polygon and Aurora',
          url: 'https://aramid.finance',
          icons: ['https://beta.k8s.aramid.finance/aramid-logo.svg']
        }
      }
    },
    {
      id: WalletId.WALLETCONNECT,
      options: {
        projectId: '54958e07dbb79eedf5cd5564bf16d817',
        metadata: {
          name: 'Aramid Finance Dapp',
          description: 'Aramid Finance Bridge between Algorand, Voi, Near, Ethereum, Polygon and Aurora',
          url: 'https://aramid.finance',
          icons: ['https://beta.k8s.aramid.finance/aramid-logo.svg']
        }
      }
    }
  ],

  network: NetworkId.MAINNET
})
// Install the plugin
app.use(AVMWalletManagerPlugin, {
  wallets: [
    AVMWalletId.DEFLY,
    AVMWalletId.PERA,
    AVMWalletId.EXODUS,
    AVMWalletId.KIBISIS,
    {
      id: AVMWalletId.BIATEC,
      options: {
        projectId: '54958e07dbb79eedf5cd5564bf16d817',
        metadata: {
          name: 'Aramid Finance Dapp',
          description: 'Aramid Finance Bridge between Algorand, Voi, Near, Ethereum, Polygon and Aurora',
          url: 'https://aramid.finance',
          icons: ['https://beta.k8s.aramid.finance/aramid-logo.svg']
        }
      }
    },
    {
      id: AVMWalletId.WALLETCONNECT,
      options: {
        projectId: '54958e07dbb79eedf5cd5564bf16d817',
        metadata: {
          name: 'Aramid Finance Dapp',
          description: 'Aramid Finance Bridge between Algorand, Voi, Near, Ethereum, Polygon and Aurora',
          url: 'https://aramid.finance',
          icons: ['https://beta.k8s.aramid.finance/aramid-logo.svg']
        }
      }
    }
  ],
  network: AVMNetworkId.MAINNET
})

app.mount('#app')
