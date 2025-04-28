'use client';

import { useTokens } from '@/hooks/useTokens';
import { useStake } from '@/hooks/useStake';
import { useUnstake } from '@/hooks/useUnstake';
import { useMint } from '@/hooks/useMint';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/lib/wagmi';
import { getTokenFromReceipt, getTransactionErrorMessage, handleTokenAction } from '@/lib/contractUtils';

export default function Home() {
  const { stakedTokens, unstakedTokens, loading } = useTokens();
  const [loadingTokens, setLoadingTokens] = useState<{ [key: string]: boolean }>({});
  const { stake, isPending: isStaking } = useStake();
  const { unstake, isPending: isUnstaking } = useUnstake();
  const { mint, isPending: isMinting } = useMint();
  const [stakedTokensList, setStakedTokensList] = useState(stakedTokens);
  const [unstakedTokensList, setUnstakedTokensList] = useState(unstakedTokens);

  useEffect(() => {
    if (!loading) {
      setStakedTokensList(stakedTokens);
      setUnstakedTokensList(unstakedTokens);
    }
  }, [stakedTokens, unstakedTokens, loading]);

  if (loading) return <div>Loading tokens...</div>;

  const handleStake = async (tokenId: string) => {
    await handleTokenAction(
      tokenId,
      'stake',
      stake,
      unstakedTokensList,
      stakedTokensList,
      setStakedTokensList,
      setUnstakedTokensList,
      setLoadingTokens,
      'Token staked successfully!',
      'Transaction failed while staking.'
    );
  };

  const handleUnstake = async (tokenId: string) => {
    await handleTokenAction(
      tokenId,
      'unstake',
      unstake,
      unstakedTokensList,
      stakedTokensList,
      setStakedTokensList,
      setUnstakedTokensList,
      setLoadingTokens,
      'Token unstaked successfully!',
      'Transaction failed while unstaking.'
    );
  };

  const handleMint = async () => {
    try {
      const hash = await mint();
      if (!hash) {
        toast.error('Failed to start minting transaction.');
        return;
      }
      const receipt = await waitForTransactionReceipt(config, { hash });
      const newToken = getTokenFromReceipt(receipt);
      if (newToken) {
        setUnstakedTokensList((prev) => [...prev, newToken]);
        toast.success('Token minted successfully!');
      } else {
        toast.warning('Mint succeeded, but no new token found. Try refreshing the page.');
      }
    } catch (error: any) {
      toast(getTransactionErrorMessage(error));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your NFTs</h1>

      <div className="flex justify-center mb-8">
        <Button
          variant="default"
          onClick={() => handleMint()}
          className="text-lg font-semibold py-3 px-6 rounded-full transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          disabled={isStaking || isUnstaking || isMinting}
        >
          Mint new NFT
        </Button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Staked NFTs</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {stakedTokensList.length > 0 ? (
            stakedTokensList.map((token) => (
              <div
                key={token.tokenId}
                className="border rounded-2xl p-4 flex flex-col items-center bg-green-50 shadow-md"
              >
                <div className="text-lg font-semibold text-gray-800">Token ID: {token.tokenId.toString()}</div>
                <Button
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => handleUnstake(token.tokenId)}
                  disabled={loadingTokens[token.tokenId.toString()] || isStaking || isUnstaking || isMinting}
                >
                  {loadingTokens[token.tokenId.toString()] ? 'Unstaking...' : 'Unstake'}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No tokens staked</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Unstaked NFTs</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {unstakedTokensList.length > 0 ? (
            unstakedTokensList.map((token) => (
              <div
                key={token.tokenId}
                className="border rounded-2xl p-4 flex flex-col items-center bg-yellow-50 shadow-md"
              >
                <div className="text-lg font-semibold text-gray-800">Token ID: {token.tokenId.toString()}</div>
                <Button
                  variant="default"
                  className="cursor-pointer"
                  onClick={() => handleStake(token.tokenId)}
                  disabled={loadingTokens[token.tokenId.toString()] || isStaking || isUnstaking || isMinting}
                >
                  {loadingTokens[token.tokenId.toString()] ? 'Staking...' : 'Stake'}
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500">No tokens unstaked</div>
          )}
        </div>
      </div>
    </div>
  );
}
