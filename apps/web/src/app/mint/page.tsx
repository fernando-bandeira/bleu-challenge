// app/mint/page.tsx
'use client';

import { useState } from 'react';
import { getContract } from '@/lib/ethers';

export default function MintPage() {
  const [isMinting, setIsMinting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleMint = async () => {
    setIsMinting(true);
    setError(null);

    try {
      const contract = getContract();
      const tokenId = 1; // Aqui você pode escolher o tokenId
      const tx = await contract.mint("0xSeuEndereco", tokenId);
      await tx.wait();
      alert("NFT mintado com sucesso!");
    } catch (err) {
      setError("Erro ao mintar");
      console.error(err);
    }

    setIsMinting(false);
  };

  return (
    <div>
      <h1>Mintar NFT</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={handleMint} disabled={isMinting}>
        {isMinting ? 'Mintando...' : 'Mintar NFT'}
      </button>
    </div>
  );
}
