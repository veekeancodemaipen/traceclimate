// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @notice Integrity receipts, not certification of environmental accuracy.
contract EvidenceRegistry {
    address public immutable reviewer;
    struct Receipt { bytes32 reportHash; uint256 timestamp; address submitter; }
    mapping(bytes32 => Receipt) public receipts;
    event Anchored(bytes32 indexed datasetHash, bytes32 reportHash, address indexed submitter);
    constructor() { reviewer = msg.sender; }
    function anchor(bytes32 datasetHash, bytes32 reportHash) external {
        require(msg.sender == reviewer, "Unauthorized reviewer");
        require(datasetHash != bytes32(0) && reportHash != bytes32(0), "Empty hash");
        require(receipts[datasetHash].timestamp == 0, "Already anchored");
        receipts[datasetHash] = Receipt(reportHash, block.timestamp, msg.sender);
        emit Anchored(datasetHash, reportHash, msg.sender);
    }
}
