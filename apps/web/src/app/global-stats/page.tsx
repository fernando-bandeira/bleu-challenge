'use client';

import { useGlobalStats } from "@/hooks/useGlobalStats";

export default function Home() {
  const { totalStaked, topStakers, loading, error } = useGlobalStats();

  if (loading) return <p className="text-center text-2xl text-primary">Loading stats...</p>;
  if (error) return <p className="text-center text-xl text-error">Error loading stats: {error}</p>;

  return (
    <div className="bg-background text-content-foreground min-h-screen py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-primary mb-4">Total NFTs Staked</h2>
          <p className="text-4xl font-semibold text-success">{totalStaked}</p>
        </div>

        <div className="bg-content p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold text-primary mb-4">Top Stakers</h3>
          <ul className="space-y-4">
            {topStakers.map((staker) => (
              <li
                key={staker.user}
                className="flex justify-between items-center py-3 px-4 rounded-lg bg-content text-foreground border border-sub-text"
              >
                <span className="text-xl font-semibold text-primary">{staker.user}</span>
                <span className="text-lg text-sub-text">{staker.count} NFTs</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
