
// config/index.tsx

import { cookieStorage, createStorage, http } from '@wagmi/core'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { bsc } from '@reown/appkit/networks'

// Get projectId from https://cloud.reown.com
export const projectId = 'd49b2eb93c3727953138288bcf4fa3f4'

if (!projectId) {
  throw new Error('Project ID is not defined')
}

export const networks = [bsc]

//Set up the Wagmi Adapter (Config)
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: true,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig