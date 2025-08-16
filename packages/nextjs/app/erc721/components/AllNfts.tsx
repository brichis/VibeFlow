"use client";

import { useEffect, useState } from "react";
import { NFTCard } from "./NFTCard";

export interface Collectible {
  id: number;
  uri: string;
  owner: string;
  image: string;
  name: string;
}

export const AllNfts = () => {
  const [allNfts, setAllNfts] = useState<Collectible[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // TODO: Implement Flow NFT fetching logic
    setLoading(false);
    setAllNfts([]);
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center mt-10">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );

  return (
    <>
      <div className="flex justify-center items-center space-x-2 flex-col sm:flex-row">
        <p className="y-2 mr-2 font-bold text-2xl my-2">Total Supply:</p>
        <p className="text-xl">0 tokens (Flow integration pending)</p>
      </div>
      {allNfts.length > 0 && (
        <div className="flex flex-wrap gap-4 my-8 px-5 justify-center">
          {allNfts.map(item => (
            <NFTCard nft={item} key={item.id} />
          ))}
        </div>
      )}
      {allNfts.length === 0 && (
        <div className="text-center mt-4">
          <p className="text-lg">No NFTs found. Flow integration is in progress.</p>
        </div>
      )}
    </>
  );
};
