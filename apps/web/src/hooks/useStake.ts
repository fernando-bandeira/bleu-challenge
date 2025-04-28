'use client';

import { useWriteContract } from 'wagmi';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

export function useStake() {
  const { writeContractAsync, isPending } = useWriteContract();

  const stake = async (tokenId: string) => {
    return await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: BleuNFTAbi,
      functionName: 'stake',
      args: [BigInt(tokenId)],
    });
  };

  return { stake, isPending };
}
