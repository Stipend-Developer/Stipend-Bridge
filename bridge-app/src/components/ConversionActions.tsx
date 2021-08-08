// eslint-disable jsx-a11y/anchor-is-valid

import { makeStyles } from "@material-ui/core";
import React, { useState } from "react";

import { Store } from "../store/store";
import { TransactionStore } from "../store/transactionStore";
import { Transaction } from "../types/transaction";
import { ExternalLink } from "./ExternalLink";

const useStyles = makeStyles((theme) => ({
  viewLink: {
    fontSize: 12,
    marginRight: theme.spacing(1),
    textDecoration: "underline",
    cursor: "pointer",
  },
}));

interface Props {
  tx: Transaction;
}

export const ConversionActions: React.FC<Props> = ({ tx }) => {
  const classes = useStyles();
  const {
    setShowGatewayModal,
    setGatewayModalTx,
    setShowCancelModal,
    setCancelModalTx,
  } = Store.useContainer();
  const {
    completeConvertToEthereum,
    initConvertFromEthereum,
    removeTx,
  } = TransactionStore.useContainer();

  const direction = tx.destNetwork === "ethereum" ? "in" : "out";

  const [submitting, setSubmitting] = useState(false);

  return (
    <React.Fragment>
      <div>
        {direction === "in" && tx.sourceTxHash && (
          <ExternalLink
            className={classes.viewLink}
            href={`https://openchains.info/coin/stipend/block/${tx.sourceTxHash}`}
          >
            View SPD TX
          </ExternalLink>
        )}
        {direction === "in" && tx.destTxHash ? (
          <ExternalLink
            className={classes.viewLink}
            href={
              "https://" +
              (tx.destNetworkVersion === "testnet" ? "kovan." : "") +
              "etherscan.io/tx/" +
              tx.destTxHash
            }
          >
            View ETH TX
          </ExternalLink>
        ) : null}
        {direction === "in" && tx.awaiting === "btc-init" && !tx.error && (
          <React.Fragment>
            <a
              className={classes.viewLink}
              onClick={() => {
                // view modal
                setShowGatewayModal(true);
                setGatewayModalTx(tx.id);
              }}
            >
              View Gateway Address
            </a>
            <a
              className={classes.viewLink}
              onClick={() => {
                // are you sure modal
                setShowCancelModal(true);
                setCancelModalTx(tx.id);
              }}
            >
              Cancel
            </a>
          </React.Fragment>
        )}

        {direction === "out" && tx.sourceTxHash ? (
          <ExternalLink
            className={classes.viewLink}
            href={
              "https://" +
              (tx.sourceNetworkVersion === "testnet" ? "kovan." : "") +
              "etherscan.io/tx/" +
              tx.sourceTxHash
            }
          >
            View ETH TX
          </ExternalLink>
        ) : null}
        {direction === "out" && !tx.awaiting && tx.destAddress && (
          <ExternalLink
            className={classes.viewLink}
            href={`https://sochain.com/address/BTC${
              tx.destNetworkVersion === "testnet" ? "TEST" : ""
            }/${tx.destAddress}`}
          >
            View SPD TX
          </ExternalLink>
        )}

        {((tx.error && tx.awaiting === "eth-settle") ||
          tx.awaiting === "eth-init") && (
          <React.Fragment>
            <a
              className={classes.viewLink}
              onClick={async () => {
                setSubmitting(true);
                try {
                  if (direction === "out") {
                    await initConvertFromEthereum(tx);
                  } else {
                    await completeConvertToEthereum(tx);
                  }
                } catch (error) {
                  alert(error);
                }
                setSubmitting(false);
              }}
            >
              {submitting ? "Submitting..." : "Submit"}
            </a>
            {direction === "out" && (
              <a
                className={classes.viewLink}
                onClick={() => {
                  removeTx(tx);
                }}
              >
                Cancel
              </a>
            )}
          </React.Fragment>
        )}

        {!tx.awaiting && !tx.error && (
          <a
            className={classes.viewLink}
            onClick={() => {
              removeTx(tx);
            }}
          >
            Clear
          </a>
        )}

        {direction === "out" && tx.error && tx.sourceTxHash && (
          <a
            className={classes.viewLink}
            onClick={() => {
              removeTx(tx);
            }}
          >
            Clear
          </a>
        )}
      </div>
    </React.Fragment>
  );
};
