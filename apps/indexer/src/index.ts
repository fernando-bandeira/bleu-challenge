import { ponder } from 'ponder:registry'
import { stakedEvents, unstakedEvents } from "ponder:schema";

ponder.on('BleuNFT:Mint', async ({ event, context }) => {

  await context.db.insert(unstakedEvents).values({
    tokenId: event.args.tokenId,
    user: event.args.to,
    timestamp: event.block.timestamp,
  });
});

ponder.on('BleuNFT:Staked', async ({ event, context }) => {

  await context.db.insert(stakedEvents).values({
    tokenId: event.args.tokenId,
    user: event.args.user,
    timestamp: event.block.timestamp
  });

  await context.db.delete(unstakedEvents, { tokenId: event.args.tokenId });
});

ponder.on('BleuNFT:Unstaked', async ({ event, context }) => {

  await context.db.insert(unstakedEvents).values({
    tokenId: event.args.tokenId,
    user: event.args.user,
    timestamp: event.block.timestamp,
  });

  await context.db.delete(stakedEvents, { tokenId: event.args.tokenId });
});