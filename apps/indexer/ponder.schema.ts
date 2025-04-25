import { onchainTable } from 'ponder';

export const stakedEvents = onchainTable("staked_events", (t) => ({
  tokenId: t.bigint().primaryKey(),
  user: t.hex(),
  timestamp: t.bigint(),
}));

export const unstakedEvents = onchainTable("unstaked_events", (t) => ({
  tokenId: t.bigint().primaryKey(),
  user: t.hex(),
  timestamp: t.bigint(),
}));
