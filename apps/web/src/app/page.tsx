'use client';

import { useAccount } from 'wagmi';
import { useTokens } from '@/hooks/useTokens';
import { useStake } from '@/hooks/useStake';
import { useUnstake } from '@/hooks/useUnstake';
import { useMint } from '@/hooks/useMint';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export default function Home() {
  const { stakedTokens, unstakedTokens, loading } = useTokens();
  const [loadingTokens, setLoadingTokens] = useState<{ [key: string]: boolean }>({});
  const { stake, isPending: isStaking } = useStake();
  const { unstake, isPending: isUnstaking } = useUnstake();
  const { mint, isPending: isMinting } =  useMint();
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
    setLoadingTokens((prevState) => ({
      ...prevState,
      [tokenId.toString()]: true,
    }));
    try {
      await stake(tokenId);
      console.log(`Successfully staked token ${tokenId}`);
      // Add current token to staked list and remove it from unstaked list
      const token = unstakedTokensList.find(token => token.tokenId === tokenId);
      if (token) {
        setStakedTokensList((prev) => [...prev, token]);
        setUnstakedTokensList((prev) => prev.filter(t => t.tokenId !== tokenId));
      }
    } catch (error) {
      console.error('Error staking token:', error);
    } finally {
      setLoadingTokens((prevState) => ({
        ...prevState,
        [tokenId.toString()]: false,
      }));
    }
  };

  const handleUnstake = async (tokenId: string) => {
    setLoadingTokens((prevState) => ({
      ...prevState,
      [tokenId.toString()]: true,
    }));
    try {
      await unstake(tokenId);
      console.log(`Successfully unstaked token ${tokenId}`);
      const token = stakedTokensList.find(token => token.tokenId === tokenId);
      if (token) {
        setUnstakedTokensList((prev) => [...prev, token]);
        setStakedTokensList((prev) => prev.filter(t => t.tokenId !== tokenId));
      }
    } catch (error) {
      console.error('Error unstaking token:', error);
    } finally {
      setLoadingTokens((prevState) => ({
        ...prevState,
        [tokenId.toString()]: false,
      }));
    }
  };

  const handleMint = async () => {
    mint();
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Your NFTs</h1>

      <div className="flex justify-center mb-8">
        <Button
          variant="default"
          onClick={() => handleMint()}
          className="text-lg font-semibold py-3 px-6 rounded-full transition duration-200 ease-in-out hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Mint
        </Button>
      </div>
      <div className="mb-6">
        <h2 className="text-2xl font-semibold mb-4">Staked NFTs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {stakedTokensList.length > 0 ? (
            stakedTokensList.map((token) => (
              <div
                key={token.tokenId}
                className="border rounded-2xl p-4 flex flex-col items-center bg-green-50 shadow-md"
              >
                <div className="text-lg font-semibold">Token ID: {token.tokenId.toString()}</div>
                <div className="text-sm text-gray-600 mb-4">Staked</div>
                <Button
                  variant="destructive"
                  onClick={() => handleUnstake(token.tokenId)}
                  disabled={loadingTokens[token.tokenId.toString()] || isUnstaking}
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {unstakedTokensList.length > 0 ? (
            unstakedTokensList.map((token) => (
              <div
                key={token.tokenId}
                className="border rounded-2xl p-4 flex flex-col items-center bg-yellow-50 shadow-md"
              >
                <div className="text-lg font-semibold">Token ID: {token.tokenId.toString()}</div>
                <div className="text-sm text-gray-600 mb-4">Unstaked</div>
                <Button
                  variant="default"
                  onClick={() => handleStake(token.tokenId)}
                  disabled={loadingTokens[token.tokenId.toString()] || isStaking}
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
