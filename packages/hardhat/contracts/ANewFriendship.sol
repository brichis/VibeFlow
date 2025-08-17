// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import { FriendshipBraceletNFT } from "./FriendshipBraceletNFT.sol";

/*
 * @author: Ariiellus
 * @title: ANewFriendship
 * @notice Factory contract that tests potential new friendships and mints NFTs for both friends
 */

contract ANewFriendship {
    address public firstFriend;
    address public secondFriend;
    mapping(address => string[]) private userInterests;

    FriendshipBraceletNFT public friendshipBraceletNFT;

    event FB__FriendshipBraceletMinted(address indexed firstFriend, address indexed secondFriend);
    event FB__FriendshipIsPossible(address indexed firstFriend, address indexed secondFriend);
    event InterestAdded(address indexed user, string interest);
    event FriendshipNFTsMinted(uint256 firstTokenId, uint256 secondTokenId, address firstFriend, address secondFriend);

    constructor(address _firstFriend, address _secondFriend, address _friendshipBraceletNFT) {
        require(_firstFriend != _secondFriend, "Cannot create friendship with yourself");
        require(_firstFriend != address(0) && _secondFriend != address(0), "Invalid addresses");
        require(_friendshipBraceletNFT != address(0), "Invalid NFT contract address");

        firstFriend = _firstFriend;
        secondFriend = _secondFriend;
        friendshipBraceletNFT = FriendshipBraceletNFT(_friendshipBraceletNFT);

        emit FB__FriendshipBraceletMinted(firstFriend, secondFriend);
    }

    /// @notice Generates unique ID for the friendship pair
    function aNewFriendshipHasBegun() internal returns (bytes32) {
        bytes32 friendshipHash = keccak256(abi.encode(firstFriend, secondFriend));

        mintFriendshipBracelets(friendshipHash);
        emit FB__FriendshipBraceletMinted(firstFriend, secondFriend);

        return friendshipHash;
    }

    function addInterest(string memory interest) external {
        require(msg.sender == firstFriend || msg.sender == secondFriend, "Only friends can add interests");
        userInterests[msg.sender].push(interest); // push the interest to the user's interests array
        emit InterestAdded(msg.sender, interest);
    }

    function testFriendship(address myFriend) external returns (bool) {
        require(myFriend == firstFriend || myFriend == secondFriend, "Not a valid friend");
        require(msg.sender == firstFriend || msg.sender == secondFriend, "Only friends can test");

        string[] memory myInterests = userInterests[msg.sender];
        string[] memory friendInterests = userInterests[myFriend];

        uint8 commonInterests = 0;

        for (uint256 i = 0; i < myInterests.length; i++) {
            bytes32 myInterestHash = keccak256(abi.encodePacked(myInterests[i]));

            for (uint256 j = 0; j < friendInterests.length; j++) {
                if (myInterestHash == keccak256(abi.encodePacked(friendInterests[j]))) {
                    commonInterests++;

                    if (commonInterests > 3) {
                        aNewFriendshipHasBegun();
                        return true;
                    }
                    
                    break;
                }
            }
        }

        return false;
    }

    function mintFriendshipBracelets(
        bytes32 friendshipHash
    ) internal returns (uint256 firstTokenId, uint256 secondTokenId) {
        require(msg.sender == firstFriend || msg.sender == secondFriend, "Only friends can mint");

        // Test if friendship is possible
        require(this.testFriendship(firstFriend), "Friendship test failed for first friend");
        require(this.testFriendship(secondFriend), "Friendship test failed for second friend");

        // Mint friendship bracelet NFTs using the FriendshipBraceletNFT contract
        string memory friendshipHashUnique = string(abi.encodePacked(friendshipHash));
        firstTokenId = friendshipBraceletNFT.mintFriendshipBracelet(firstFriend, secondFriend, friendshipHashUnique);
        secondTokenId = friendshipBraceletNFT.mintFriendshipBracelet(secondFriend, firstFriend, friendshipHashUnique);

        emit FB__FriendshipIsPossible(firstFriend, secondFriend);
        emit FriendshipNFTsMinted(firstTokenId, secondTokenId, firstFriend, secondFriend);
    }

    //////////////////////////
    // Getter functions /////
    //////////////////////////

    function getInterests(address friend) external view returns (string[] memory) {
        require(friend == firstFriend || msg.sender == secondFriend, "Not a valid friend");
        return userInterests[friend];
    }

    function getFriendshipDetails() external view returns (address, address, address) {
        return (firstFriend, secondFriend, address(friendshipBraceletNFT));
    }
}
