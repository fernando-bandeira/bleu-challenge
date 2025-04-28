'use client';

import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT!;

const GLOBAL_STATS_QUERY = gql`
  query GlobalStatsQuery {
    stakedEventss {
      items {
        tokenId
        user
      }
    }
  }
`;

type TokenEvent = {
  tokenId: string;
  user: string;
};

type StatsResponse = {
  stakedEventss: { items: TokenEvent[] };
};

export function useGlobalStats() {
  const [totalStaked, setTotalStaked] = useState(0);
  const [topStakers, setTopStakers] = useState<{ user: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await request<StatsResponse>(GRAPHQL_ENDPOINT, GLOBAL_STATS_QUERY);

        setTotalStaked(data.stakedEventss.items.length);

        const userCounts = new Map<string, number>();
        for (const { user } of data.stakedEventss.items) {
          userCounts.set(user, (userCounts.get(user) || 0) + 1);
        }

        const sorted = Array.from(userCounts.entries())
          .map(([user, count]) => ({ user, count }))
          .sort((a, b) => b.count - a.count);

        setTopStakers(sorted);
      } catch (err: any) {
        setError(err.message || 'Unknown error');
      } finally {
        setLoading(false);
      }
    }


    fetchStats();
  }, []);

  return { totalStaked, topStakers, loading, error };
}
