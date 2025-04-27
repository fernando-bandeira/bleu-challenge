// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract BleuNFT is ERC721Enumerable {
    event Mint(address indexed to, uint256 indexed tokenId);
    event Staked(address indexed user, uint256 indexed tokenId);
    event Unstaked(address indexed user, uint256 indexed tokenId);
    uint256 private _currentTokenId;

    mapping(uint256 => bool) public isStaked;
    mapping(uint256 => uint256) public stakedAt;

    constructor() ERC721("BleuNFT", "MNFT") {
        _currentTokenId = 1;
    }

    function mint(address to) public {
        uint256 tokenId = _currentTokenId;
        _mint(to, tokenId);
        _currentTokenId++;
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