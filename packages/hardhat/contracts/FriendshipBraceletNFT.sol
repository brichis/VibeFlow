// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

/// @title FriendshipBraceletNFT
/// @notice Mints NFTs representing friendship bracelets between two friends
contract FriendshipBraceletNFT is ERC721, Ownable {
    uint256 private _tokenIds;
    
    struct FriendshipBracelet {
        address firstFriend;
        address secondFriend;
        uint256 mintDate;
        string friendshipType;
    }
    
    mapping(uint256 => FriendshipBracelet) public friendshipBracelets;
    mapping(address => uint8[]) private userInterests;
    
    event FriendshipBraceletMinted(
        uint256 indexed tokenId,
        address indexed firstFriend,
        address indexed secondFriend,
        string friendshipType
    );
    
    event InterestAdded(address indexed user, uint8 interest);
    
    constructor() ERC721("FriendshipBracelet", "FRIEND") Ownable(msg.sender) {}
    
    /// @notice Add an interest for a user
    /// @param interest The interest code (0-255)
    function addInterest(uint8 interest) external {
        userInterests[msg.sender].push(interest);
        emit InterestAdded(msg.sender, interest);
    }
    
    /// @notice Get interests for a specific user
    /// @param user The user's address
    /// @return Array of user interests
    function getInterests(address user) external view returns (uint8[] memory) {
        return userInterests[user];
    }
    
    /// @notice Mint a friendship bracelet NFT
    /// @param friend1 First friend's address
    /// @param friend2 Second friend's address
    /// @param friendshipType Type of friendship (e.g., "Best Friends", "Study Buddies")
    function mintFriendshipBracelet(
        address friend1,
        address friend2,
        string memory friendshipType
    ) external returns (uint256) {
        require(friend1 != friend2, "Cannot create friendship with yourself");
        require(friend1 != address(0) && friend2 != address(0), "Invalid addresses");
        
        _tokenIds++;
        uint256 newTokenId = _tokenIds;
        
        // Mint NFT to the first friend
        _safeMint(friend1, newTokenId);
        
        // Store friendship bracelet data
        friendshipBracelets[newTokenId] = FriendshipBracelet({
            firstFriend: friend1,
            secondFriend: friend2,
            mintDate: block.timestamp,
            friendshipType: friendshipType
        });
        
        emit FriendshipBraceletMinted(newTokenId, friend1, friend2, friendshipType);
        
        return newTokenId;
    }
    
    /// @notice Get friendship bracelet data
    /// @param tokenId The NFT token ID
    /// @return Friendship bracelet data
    function getFriendshipBracelet(uint256 tokenId) external view returns (FriendshipBracelet memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return friendshipBracelets[tokenId];
    }
    
    /// @notice Get total number of friendship bracelets minted
    function totalSupply() external view returns (uint256) {
        return _tokenIds;
    }
}
