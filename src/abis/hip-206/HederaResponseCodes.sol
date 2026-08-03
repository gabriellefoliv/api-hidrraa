// SPDX-License-Identifier: Apache-2.0
pragma solidity >=0.5.0 <0.9.0;

library HederaResponseCodes {
    int32 constant SUCCESS = 22;
    int32 constant TOKEN_NOT_ASSOCIATED_TO_ACCOUNT = 192;
    int32 constant TRANSACTION_REQUIRES_ZERO_TOKEN_BALANCES = 193;
}
