// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./hip-206/HederaTokenService.sol";
import "./hip-206/HederaResponseCodes.sol";

contract TraceabilityContract is HederaTokenService {

    event FundAllocation(int64 indexed serialId, string projectReference, uint256 amount);
    event FundPayment(int64 indexed serialId, string paymentReference, uint256 amount);

    address public treasury;

    constructor(address _treasury) {
        treasury = _treasury;
    }

    // Called when the Treasury allocates funds to a project
    // Transfers NFT from Treasury to this Contract (Escrow)
    function allocateFund(address token, int64 serial, string memory projectReference, uint256 amount) external {
        int response = HederaTokenService.transferNFT(token, treasury, address(this), serial);

        if (response != HederaResponseCodes.SUCCESS) {
            revert("NFT Transfer Failed");
        }

        emit FundAllocation(serial, projectReference, amount);
    }

    // Called when a payment is made (Liquidation)
    // If the fund is exhausted, we might burn it (requires precompile or external call).
    // For this simple version, we just emit the event to prove usage.
    // The actual BURN usually happens from the owner (this contract) via HTS.
    function registerPayment(int64 serial, string memory paymentReference, uint256 amount) external {
        emit FundPayment(serial, paymentReference, amount);
    }
}
