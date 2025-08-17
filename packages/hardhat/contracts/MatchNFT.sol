// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title MatchNFT
/// @notice Mints NFTs representing user matches with custom metadata like preferences and color.

contract MatchNFT is ERC721, Ownable (msg.sender) {
    uint256 private _tokenIds;

    struct MatchMetadata {
        string category;
        string color;
        string preferences;
    }

    mapping(uint256 => MatchMetadata) public matchMetadata;

    event MatchMinted(uint256 tokenId, address owner, string category, string color, string preferences);

    constructor() ERC721("MatchNFT", "MTCH") {}

    /// @notice Mint a new match NFT with custom metadata
    /// @param to The address receiving the NFT
    /// @param category Category of the match (e.g., Music, Art)
    /// @param color Color associated with this match (e.g., #ffcc00)
    /// @param preferences Custom preferences or tags (e.g., "techno, digital art")
    function mintMatch(
        address to,
        string memory category,
        string memory color,
        string memory preferences
    ) external onlyOwner returns (uint256) {
        _tokenIds++;
        uint256 newId = _tokenIds;
        _safeMint(to, newId);

        matchMetadata[newId] = MatchMetadata({
            category: category,
            color: color,
            preferences: preferences
        });

        emit MatchMinted(newId, to, category, color, preferences);

        return newId;
    }

    /// @notice Get metadata for a specific tokenId
    function getMatchMetadata(uint256 tokenId) external view returns (MatchMetadata memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return matchMetadata[tokenId];
    }
}
