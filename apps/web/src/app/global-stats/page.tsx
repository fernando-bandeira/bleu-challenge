'use client';

import { useGlobalStats } from "@/hooks/useGlobalStats";
import { Loader2 } from 'lucide-react';

export default function GlobalStats() {
  const { totalStaked, topStakers, loading, error } = useGlobalStats();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 space-y-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
      <p className="text-gray-600 text-lg font-semibold">Loading...</p>
    </div>
  );
  if (error) return <p className="text-center text-xl text-error">Error loading stats: {error}</p>;

  return (
    <div className="bg-background text-content-foreground py-12 px-4">
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
                <span className="font-semibold text-primary text-sm sm:text-xl overflow-hidden whitespace-nowrap text-ellipsis max-w-[10rem] sm:max-w-none">
                  {staker.user}
                </span>
                <span className="text-sub-text text-sm sm:text-lg whitespace-nowrap">{staker.count} NFTs</span>
              </li>

            ))}
          </ul>
        </div>
      </div>
    </div>
  );

}
