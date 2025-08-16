// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/// @title ENSMirror
/// @notice Lets users claim and mirror their ENS name on a non-mainnet chain

contract ENSMirror {

    mapping(bytes32 => address) public ensToAddress;
    string public mainEnsDomain;
    address public owner;
    // Events
    event ENSRegistered(string ens, address owner);
    event ENSUnregistered(string ens);
    event ETHTransferred(address recipient, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor(string memory _mainEnsDomain) {
        owner = msg.sender;
        mainEnsDomain = string(abi.encodePacked(".", _mainEnsDomain, ".eth"));
    }

    function register(string memory ens) external {
        bytes32 nameHash = keccak256(abi.encodePacked(ens, mainEnsDomain));

        require(ensToAddress[nameHash] == address(0), "ENS already registered");

        ensToAddress[nameHash] = msg.sender;

        emit ENSRegistered(ens, msg.sender);
    }

    /// @notice Unregister an ENS name
    function unregister(string memory ens) external onlyOwner {
        bytes32 nameHash = keccak256(abi.encodePacked(ens, mainEnsDomain));
        require(ensToAddress[nameHash] == msg.sender, "Not owner");

        delete ensToAddress[nameHash];

        emit ENSUnregistered(ens);
    }

    /// @notice Resolve ENS name to address
    function resolve(string memory _ens) public view returns (address) {
        bytes32 nameHash = keccak256(abi.encodePacked(_ens, mainEnsDomain));

        return ensToAddress[nameHash];
    }

    function transferETH(string memory _ens) external payable {
        address recipient = resolve(_ens);
        (bool success, ) = payable(recipient).call{value: msg.value}("");
        require(success, "Transfer failed");
        emit ETHTransferred(recipient, msg.value);
    }
}
