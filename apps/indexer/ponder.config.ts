import { createConfig } from 'ponder'
import { http } from 'viem'
import { BleuNFTAbi } from '@abis/BleuNFTAbi'

export default createConfig({
  networks: {
    anvil: {
      chainId: 31337,
      transport: http('http://127.0.0.1:8545'),
      disableCache: true
    }
  },
  contracts: {
    BleuNFT: {
      network: 'anvil',
      abi: BleuNFTAbi,
      address: '0xe7f1725e7734ce288f8367e1bb143e90bb3f0512',
      startBlock: 0
    }
  }
})