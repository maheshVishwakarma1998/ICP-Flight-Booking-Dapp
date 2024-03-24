#!/usr/bin/env bash

# Change the variable to "ic" to deploy the ledger on the mainnet.
export NETWORK=local

if ! dfx identity list | grep -q minter; then
    # If minter is not found, run the command
    dfx identity new minter --storage-mode=plaintext
fi

export MINTER_ACCOUNT_ID=$(dfx ledger account-id --identity minter)
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id --identity default)

dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai ledger_canister --argument '(variant {
    Init = record {
      minting_account = "'${MINTER_ACCOUNT_ID}'";
      initial_values = vec {
        record {
          "'${DEFAULT_ACCOUNT_ID}'";
          record {
            e8s = 1000_000_000_000 : nat64;
          };
        };
      };
      send_whitelist = vec {};
      transfer_fee = opt record {
        e8s = 10_000 : nat64;
      };
      token_symbol = opt "LICP";
      token_name = opt "Local ICP";
    }
  })'
