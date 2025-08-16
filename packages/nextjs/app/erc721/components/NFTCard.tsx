import { useState } from "react";
import { Collectible } from "./MyNfts";
import { Address } from "~~/components/scaffold-eth";

export const NFTCard = ({ nft, transfer }: { nft: Collectible; transfer?: boolean }) => {
  const [transferToAddress, setTransferToAddress] = useState("");

  return (
    <div className="card card-compact bg-base-100 shadow-lg w-[300px] shadow-secondary">
      <figure className="relative">
        {/* eslint-disable-next-line  */}
        <img src={nft.image} alt="NFT Image" className="h-60 min-w-full" />
        <figcaption className="glass absolute bottom-4 left-4 p-4 w-25 rounded-xl">
          <span className="text-white "># {nft.id}</span>
        </figcaption>
      </figure>
      <div className="card-body space-y-3">
        <div className="flex items-center justify-center">
          <p className="text-xl p-0 m-0 font-semibold">{nft.name}</p>
        </div>
        <div className="flex space-x-3 mt-1 items-center">
          <span className="text-lg font-semibold">Owner : </span>
          <Address address={nft.owner} />
        </div>
        {transfer && (
          <>
            <div className="flex flex-col my-2 space-y-1">
              <span className="text-lg font-semibold mb-1">Transfer To: </span>
              <input
                type="text"
                value={transferToAddress}
                placeholder="receiver address"
                onChange={(e) => setTransferToAddress(e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
            <div className="card-actions justify-end">
              <button
                className="btn btn-secondary btn-md px-8 tracking-wide"
                onClick={() => {
                  try {
                    // TODO: Implement Flow NFT transfer logic
                    console.log("Transferring NFT", nft.id, "to", transferToAddress);
                    setTransferToAddress("");
                  } catch (err) {
                    console.error("Error calling transfer function");
                  }
                }}
              >
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
