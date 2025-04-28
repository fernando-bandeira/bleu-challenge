import { Button } from "./ui/button";

interface TokenCardProps {
  tokenId: string;
  loadingTokens: Record<string, boolean>;
  handleUnstake: (tokenId: string) => void;
  handleStake: (tokenId: string) => void;
  isStaking: boolean;
  isUnstaking: boolean;
  isMinting: boolean;
  type: 'stake' | 'unstake';
}

const TokenCard: React.FC<TokenCardProps> = ({
  tokenId,
  loadingTokens,
  handleUnstake,
  handleStake,
  isStaking,
  isUnstaking,
  isMinting,
  type,
}) => {
  const isLoading = loadingTokens[tokenId];
  const isActionDisabled = isLoading || isStaking || isUnstaking || isMinting;

  return (
    <div className="border rounded-2xl p-4 flex flex-col items-center bg-green-50 shadow-md">
      <div className="text-lg font-semibold text-gray-800">Token ID: {tokenId}</div>
      <Button
        variant={type === 'unstake' ? "outline" : "default"}
        className="cursor-pointer"
        onClick={() => type === 'unstake' ? handleUnstake(tokenId) : handleStake(tokenId)}
        disabled={isActionDisabled}
      >
        {isLoading ? `${type === 'unstake' ? 'Unstaking' : 'Staking'}...` : type === 'unstake' ? 'Unstake' : 'Stake'}
      </Button>
    </div>
  );
};

export default TokenCard;
