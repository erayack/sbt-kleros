// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


/// Following the design of https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4105763

contract SBT is Ownable, ERC721URIStorage {
    using SafeMath for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    mapping(address => bool) public issuedSBT;
    mapping(address => string) public accountToURI;

    constructor(string memory _name, string memory _symbol)
        ERC721(_name, _symbol)
    {}

    function issueSBT(address to) external onlyOwner {
        require(!issuedSBT[to], "Token already issued");
        issuedSBT[to] = true;
    }

    function claimSBT(string memory tokenURI) public returns (uint256) {
        require(issuedSBT[_msgSender()], "Token not issued");
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        _mint(_msgSender(), newTokenId);

        issuedSBT[_msgSender()] = false;
        accountToURI[_msgSender()] = tokenURI;

        return newTokenId;
    }
}
