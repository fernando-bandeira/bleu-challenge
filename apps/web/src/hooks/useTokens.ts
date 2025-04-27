'use client';

import { useEffect, useState } from 'react';
import { request, gql } from 'graphql-request';

const GRAPHQL_ENDPOINT = 'http://localhost:42069/';

const TOKENS_QUERY = gql`
  query TokensQuery {
    stakedEventss {
      items {
        tokenId
        timestamp
        user
      }
    }
    unstakedEventss {
      items {
        tokenId
        timestamp
        user
      }
    }
  }
`;

type Token = {
  tokenId: string;
  timestamp: string;
  user: string;
};

type TokensResponse = {
  stakedEventss: { items: Token[] };
  unstakedEventss: { items: Token[] };
};

export function useTokens() {
  const [stakedTokens, setStakedTokens] = useState<Token[]>([]);
  const [unstakedTokens, setUnstakedTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTokens() {
      try {
        const data = await request<TokensResponse>(GRAPHQL_ENDPOINT, TOKENS_QUERY);
        setStakedTokens(data.stakedEventss.items);
        setUnstakedTokens(data.unstakedEventss.items);
      } catch (error) {
        console.error('Failed to fetch tokens', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTokens();
  }, []);

  return { stakedTokens, unstakedTokens, loading };
}
