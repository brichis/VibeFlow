"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export const SearchBar = () => {
  const [searchInput, setSearchInput] = useState("");
  const router = useRouter();

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    
    // Simple validation - check if it looks like a hash or address
    if (searchInput.startsWith("0x") && searchInput.length >= 42) {
      // Assume it's a transaction hash or address
      if (searchInput.length === 66) {
        // Likely a transaction hash
        router.push(`/blockexplorer/transaction/${searchInput}`);
      } else {
        // Likely an address
        router.push(`/blockexplorer/address/${searchInput}`);
      }
      return;
    }
    
    // For now, just show an error or redirect to a search results page
    console.log("Search functionality disabled - contract interaction required");
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center justify-end mb-5 space-x-3 mx-5">
      <input
        className="border-primary bg-base-100 text-base-content placeholder:text-base-content/50 p-2 mr-2 w-full md:w-1/2 lg:w-1/3 rounded-md shadow-md focus:outline-hidden focus:ring-2 focus:ring-accent"
        type="text"
        value={searchInput}
        placeholder="Search by hash or address (simulation mode)"
        onChange={e => setSearchInput(e.target.value)}
      />
      <button className="btn btn-sm btn-primary" type="submit">
        Search
      </button>
    </form>
  );
};
