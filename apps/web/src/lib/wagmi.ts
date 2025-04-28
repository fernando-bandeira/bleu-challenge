import { createConfig, http } from 'wagmi'
import { defineChain } from 'viem'

const anvilRpcUrl = process.env.NEXT_PUBLIC_ANVIL_ENDPOINT;
if (!anvilRpcUrl) {
  throw new Error('NEXT_PUBLIC_ANVIL_ENDPOINT is not defined');
}

export const anvil = defineChain({
  id: 31337,
  name: 'Anvil',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [anvilRpcUrl],
    },
  },
})

export const config = createConfig({
  chains: [anvil],
  connectors: [],
  transports: {
    [anvil.id]: http(anvilRpcUrl),
  },
})
