'use client';

import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';
import { useAccount } from 'wagmi';

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string;

const TOKENS_QUERY = gql`
  query TokensQuery($user: String!) {
    stakedEventss(where: { user: $user }) {
      items {
        tokenId
      }
    }
    unstakedEventss(where: { user: $user }) {
      items {
        tokenId
      }
    }
  }
`;

export type Token = {
  tokenId: string;
};

type TokensResponse = {
  stakedEventss: { items: Token[] };
  unstakedEventss: { items: Token[] };
};

export function useTokens() {
  const { address } = useAccount();
  const [stakedTokens, setStakedTokens] = useState<Token[]>([]);
  const [unstakedTokens, setUnstakedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!address) {
      setLoading(false);
      return;
    }

    async function fetchTokens() {
      try {
        const data = await request<TokensResponse>(GRAPHQL_ENDPOINT, TOKENS_QUERY, {
          user: address?.toLowerCase() ?? '',
        });
        setStakedTokens(data.stakedEventss.items);
        setUnstakedTokens(data.unstakedEventss.items);
      } catch (error) {
        console.error('Failed to fetch tokens', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, [address]);

  return { stakedTokens, unstakedTokens, loading };
}
