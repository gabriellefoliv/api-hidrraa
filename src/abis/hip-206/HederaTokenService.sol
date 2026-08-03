// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;

import "./HederaResponseCodes.sol";

contract HederaTokenService {
    address constant precompileAddress = address(0x167);

    function transferNFT(address token, address sender, address receiver, int64 serialNumber) internal returns (int responseCode) {
        (bool success, bytes memory result) = precompileAddress.call(
            abi.encodeWithSelector(
                0xfec30765, // transferNFT function selector
                token, 
                sender, 
                receiver, 
                serialNumber
            )
        );
        responseCode = success ? abi.decode(result, (int32)) : HederaResponseCodes.TRANSACTION_REQUIRES_ZERO_TOKEN_BALANCES;
    }
}
