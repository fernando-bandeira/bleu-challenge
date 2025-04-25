// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract BleuNFT is ERC721 {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);

    mapping(uint256 => bool) public isStaked;
    mapping(uint256 => uint256) public stakedAt;

    constructor() ERC721("BleuNFT", "MNFT") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
        emit Mint(to, tokenId);
    }

    function stake(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(!isStaked[tokenId], "Already staked");

        isStaked[tokenId] = true;
        stakedAt[tokenId] = block.timestamp;
        emit Staked(msg.sender, tokenId);
    }

    function unstake(uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Not the owner");
        require(isStaked[tokenId], "Not staked");

        isStaked[tokenId] = false;
        emit Unstaked(msg.sender, tokenId);
    }
}