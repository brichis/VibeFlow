// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract EventMatcher {
    event Chosen(uint256 indexed activityId, address indexed user);
    function choose(uint256 activityId) external {
        emit Chosen(activityId, msg.sender);
    }
}
