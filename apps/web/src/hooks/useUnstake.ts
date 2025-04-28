'use client';

import { useWriteContract } from 'wagmi';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useUnstake() {
  const { writeContractAsync, isPending } = useWriteContract();

  const unstake = async (tokenId: string) => {
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: BleuNFTAbi,
      functionName: 'unstake',
      args: [BigInt(tokenId)],
    });
  };

  return { unstake, isPending };
}
