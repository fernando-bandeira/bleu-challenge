'use client';

import { useWriteContract } from 'wagmi';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';

const CONTRACT_ADDRESS = '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707';

export function useStake() {
  const { writeContractAsync, isPending } = useWriteContract();

  const stake = async (tokenId: string) => {
    await writeContractAsync({
      address: CONTRACT_ADDRESS,
      abi: BleuNFTAbi,
      functionName: 'stake',
      args: [BigInt(tokenId)],
    });
  };

  return { stake, isPending };
}
