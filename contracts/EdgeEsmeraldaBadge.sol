// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title EdgeEsmeralda Badge - AICURATE Limited Edition
 * @dev Only 2000 EdgeEsmeralda badges will ever exist
 * Designed for World App Send Transaction integration
 */
contract EdgeEsmeraldaBadge is ERC1155, Ownable, ReentrancyGuard {
    using Strings for uint256;

    // Badge Configuration
    uint256 public constant EDGE_ESMERALDA_ID = 1;
    uint256 public constant MAX_SUPPLY = 2000;
    
    // State Variables
    uint256 public currentSupply = 0;
    mapping(address => bool) public hasMinted;
    mapping(bytes32 => bool) public usedNullifierHashes;
    
    // Events
    event EdgeEsmeraldaMinted(
        address indexed recipient, 
        uint256 badgeNumber,
        bytes32 nullifierHash
    );

    constructor(
        string memory baseURI,
        address initialOwner
    ) ERC1155(baseURI) Ownable(initialOwner) {}

    /**
     * @dev Mint EdgeEsmeralda badge (called by World Send Transaction)
     * @param recipient Address to receive the badge
     * @param nullifierHash World ID nullifier hash for verification
     */
    function mintEdgeEsmeralda(
        address recipient,
        bytes32 nullifierHash
    ) external nonReentrant {
        require(currentSupply < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[recipient], "Already minted");
        require(!usedNullifierHashes[nullifierHash], "Nullifier used");
        require(nullifierHash != bytes32(0), "Invalid nullifier");
        
        // Update state
        hasMinted[recipient] = true;
        usedNullifierHashes[nullifierHash] = true;
        currentSupply++;
        
        // Mint badge
        _mint(recipient, EDGE_ESMERALDA_ID, 1, "");
        
        emit EdgeEsmeraldaMinted(recipient, currentSupply, nullifierHash);
    }

    /**
     * @dev Get badge information for frontend
     */
    function getBadgeInfo() external view returns (
        uint256 current,
        uint256 max,
        uint256 remaining
    ) {
        return (currentSupply, MAX_SUPPLY, MAX_SUPPLY - currentSupply);
    }

    /**
     * @dev Check if address can mint
     */
    function canMint(address user) external view returns (bool) {
        return currentSupply < MAX_SUPPLY && !hasMinted[user];
    }

    /**
     * @dev Admin function for special cases
     */
    function adminMint(address recipient) external onlyOwner {
        require(currentSupply < MAX_SUPPLY, "Max supply reached");
        require(!hasMinted[recipient], "Already minted");
        
        hasMinted[recipient] = true;
        currentSupply++;
        
        _mint(recipient, EDGE_ESMERALDA_ID, 1, "");
        emit EdgeEsmeraldaMinted(recipient, currentSupply, bytes32(0));
    }

    /**
     * @dev Disable transfers (soulbound)
     */
    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override {
        require(from == address(0), "EdgeEsmeralda badges are soulbound");
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override {
        require(from == address(0), "EdgeEsmeralda badges are soulbound");
        super.safeBatchTransferFrom(from, to, ids, amounts, data);
    }
}