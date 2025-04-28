import { decodeEventLog } from 'viem';
import { BleuNFTAbi } from '@abis/BleuNFTAbi';
import { Token } from '@/hooks/useTokens';
import { toast } from 'sonner';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/lib/wagmi';

export const getTokenFromReceipt = (receipt: any) => {
  for (const log of receipt.logs) {
    try {
      const { eventName, args } = decodeEventLog({
        abi: BleuNFTAbi,
        data: log.data,
        topics: log.topics,
      });

      if (eventName === 'Transfer' && args.from === '0x0000000000000000000000000000000000000000') {
        const tokenId = (args.tokenId as bigint).toString();
        return {
          tokenId: tokenId
        };
      }
    } catch (err) {
      continue;
    }
  }
  return null;
}

export const getTransactionErrorMessage = (error: any) => {
  if (error?.message?.includes('User denied transaction signature')) {
    return 'Transaction was cancelled by the user.';
  } else if (error?.shortMessage) {
    return error.shortMessage;
  } else if (error?.cause?.message) {
    return error.cause.message;
  } else {
    console.error(error);
    return 'Unexpected error occurred during the transaction.';
  }
};

export const handleTokenAction = async (
  tokenId: string,
  action: 'stake' | 'unstake',
  actionMethod: (tokenId: string) => Promise<string>,
  unstakedTokensList: Token[],
  stakedTokensList: Token[],
  setStakedTokensList: React.Dispatch<React.SetStateAction<Token[]>>,
  setUnstakedTokensList: React.Dispatch<React.SetStateAction<Token[]>>,
  setLoadingTokens: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>,
  successMessage: string,
  errorMessage: string
) => {
  setLoadingTokens((prevState) => ({
    ...prevState,
    [tokenId.toString()]: true,
  }));

  try {
    const hash = await actionMethod(tokenId) as `0x${string}`;
    const receipt = await waitForTransactionReceipt(config, { hash });

    if (receipt.status === 'success') {
      toast.success(successMessage);

      // Get token from correct list
      const token = action === 'stake'
        ? unstakedTokensList.find((token) => token.tokenId === tokenId)
        : stakedTokensList.find((token) => token.tokenId === tokenId);

      // Add/remove token from staked/unstaked lists
      if (token) {
        if (action === 'stake') {
          setStakedTokensList((prev) => [...prev, token]);
          setUnstakedTokensList((prev) => prev.filter((t) => t.tokenId !== tokenId));
        } else {
          setUnstakedTokensList((prev) => [...prev, token]);
          setStakedTokensList((prev) => prev.filter((t) => t.tokenId !== tokenId));
        }
      }
    } else {
      toast.error(errorMessage);
    }
  } catch (error: any) {
    toast(getTransactionErrorMessage(error));
  } finally {
    setLoadingTokens((prevState) => ({
      ...prevState,
      [tokenId.toString()]: false,
    }));
  }
};

