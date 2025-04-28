'use client';

import { useTokens } from '@/hooks/useTokens';
import { useStake } from '@/hooks/useStake';
import { useUnstake } from '@/hooks/useUnstake';
import { useMint } from '@/hooks/useMint';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { waitForTransactionReceipt } from 'wagmi/actions';
import { config } from '@/lib/wagmi';
import { getTokenFromReceipt, getTransactionErrorMessage, handleTokenAction } from '@/lib/contractUtils';
import { Loader2 } from 'lucide-react';
import TokenCard from '@/components/token-card';

export default function Home() {
  const { stakedTokens, unstakedTokens, setStakedTokens, setUnstakedTokens, loading } = useTokens();
  const [loadingTokens, setLoadingTokens] = useState<{ [key: string]: boolean }>({});
  const { stake, isPending: isStaking } = useStake();
  const { unstake, isPending: isUnstaking } = useUnstake();
  const { mint, isPending: isMinting } = useMint();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      <p className="text-gray-600 text-lg font-semibold">Loading...</p>
    </div>
  );

  const handleStake = async (tokenId: string) => {
    await handleTokenAction(
      tokenId,
      'stake',
      stake,
      unstakedTokens,
      stakedTokens,
      setStakedTokens,
      setUnstakedTokens,
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
      unstakedTokens,
      stakedTokens,
      setStakedTokens,
      setUnstakedTokens,
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
        setUnstakedTokens((prev) => [...prev, newToken]);
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
          {stakedTokens.length > 0 ? (
            stakedTokens.map((token) => (
              <TokenCard
                key={token.tokenId}
                tokenId={token.tokenId.toString()}
                loadingTokens={loadingTokens}
                handleUnstake={handleUnstake}
                handleStake={handleStake}
                isStaking={isStaking}
                isUnstaking={isUnstaking}
                isMinting={isMinting}
                type="unstake"
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No tokens staked</div>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-semibold mb-4">Unstaked NFTs</h2>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          {unstakedTokens.length > 0 ? (
            unstakedTokens.map((token) => (
              <TokenCard
                key={token.tokenId}
                tokenId={token.tokenId.toString()}
                loadingTokens={loadingTokens}
                handleUnstake={handleUnstake}
                handleStake={handleStake}
                isStaking={isStaking}
                isUnstaking={isUnstaking}
                isMinting={isMinting}
                type="stake"
              />
            ))
          ) : (
            <div className="text-center text-gray-500">No tokens unstaked</div>
          )}
        </div>
      </div>
    </div>
  );
}
