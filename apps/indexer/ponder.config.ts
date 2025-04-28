import { createConfig } from 'ponder'
import { http } from 'viem'
import { BleuNFTAbi } from '@abis/BleuNFTAbi'

export default createConfig({
  networks: {
    anvil: {
      chainId: 31337,
      transport: http(process.env.ANVIL_ENDPOINT),
      disableCache: true
    }
  },
  contracts: {
    BleuNFT: {
      network: 'anvil',
      abi: BleuNFTAbi,
      address: process.env.CONTRACT_ADDRESS as `0x${string}`,
      startBlock: 0
    }
  }
})