'use client';

import { useWriteContract } from 'wagmi';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';

const CONTRACT_ADDRESS = '0x5fc8d32690cc91d4c39d9d3abcbd16989f875707';

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
