'use client';

import { useWriteContract, useAccount } from 'wagmi';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useMint() {
  const { address } = useAccount();
  const { writeContractAsync, isPending } = useWriteContract();

  const mint = async () => {
    if (!address) {
      console.error('No address found.');
      return;
    }

    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: BleuNFTAbi,
      functionName: 'mint',
      args: [address],
    });
  };

  return { mint, isPending };
}
