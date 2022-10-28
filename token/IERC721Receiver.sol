pragma solidity ^0.8.0;

// File: @openzeppelin/contracts/token/ERC721/IERC721Receiver.sol

interface IERC721Receiver {
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external returns (bytes4);
}