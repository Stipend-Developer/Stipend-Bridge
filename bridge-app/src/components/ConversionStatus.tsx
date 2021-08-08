import Typography from "@material-ui/core/Typography";
import React from "react";

import { Transaction } from "../types/transaction";

interface Props {
  tx: Transaction;
}

export const ConversionStatus: React.FC<Props> = ({ tx }) => {
  const targetBtcConfs = tx.sourceNetworkVersion === "testnet" ? 2 : 6;
  const targetEthConfs = tx.sourceNetworkVersion === "testnet" ? 13 : 30;

  return (
    <React.Fragment>
      {tx.destNetwork === "ethereum" ? (
        <Typography variant="caption">
          {tx.awaiting === "btc-init" ? (
            <span>{`Waiting for SPD to be sent`}</span>
          ) : null}
          {tx.awaiting === "btc-settle" ? (
            <span>
              BTC transaction confirming (
              {tx.btcConfirmations === undefined || tx.btcConfirmations < 0
                ? "..."
                : tx.btcConfirmations}
              /{targetBtcConfs} complete)
            </span>
          ) : null}
          {tx.awaiting === "ren-settle" ? (
            <span>{`Submitting to RenVM`}</span>
          ) : null}
          {tx.awaiting === "eth-init" ? (
            <span>{`Submit to Ethereum`}</span>
          ) : null}
          {tx.awaiting === "eth-settle" ? (
            <span>
              {tx.error ? `Submit to Ethereum` : `Submitting to Ethereum`}
            </span>
          ) : null}
          {!tx.awaiting ? <span>{`Complete`}</span> : null}
        </Typography>
      ) : (
        <Typography variant="caption">
          {tx.awaiting === "eth-settle" ? (
            <span>
              {tx.sourceTxHash
                ? tx.error
                  ? `Transaction Failed`
                  : `Transaction confirming (${
                      tx.btcConfirmations === undefined ||
                      tx.btcConfirmations < 0
                        ? "..."
                        : tx.sourceTxConfs
                    }/${targetEthConfs} complete)`
                : `Submit to Ethereum`}
            </span>
          ) : null}
          {tx.awaiting === "ren-settle" ? (
            <span>{`Submitting to RenVM`}</span>
          ) : null}
          {!tx.awaiting ? <span>{`Complete`}</span> : null}
        </Typography>
      )}
    </React.Fragment>
  );
};
