import { makeStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import React from "react";

import { ActionLink } from "../components/ActionLink";
import { ConversionActions } from "../components/ConversionActions";
import { ConversionStatus } from "../components/ConversionStatus";
import { Store } from "../store/store";
import { Web3Store } from "../store/web3Store";

const useStyles = makeStyles((theme) => ({
  container: {
    background: "#fff",
    border: "0.5px solid " + theme.palette.divider,
    minHeight: 200,
    height: "100%",
  },
  titleWrapper: {
    paddingBottom: theme.spacing(2),
  },
  actionsCell: {
    minWidth: 150,
  },
  emptyMessage: {
    display: "flex",
    paddingTop: theme.spacing(8),
    justifyContent: "center",
    height: "100%",
  },
}));

export const TransactionsTableContainer: React.FC = () => {
  const classes = useStyles();
  const {
    convertTransactions,
    selectedNetwork,
    fsSignature,
    loadingTransactions,
    walletConnectError,
  } = Store.useContainer();

  const { initLocalWeb3 } = Web3Store.useContainer();

  const transactions = convertTransactions.filter(
    (t) => t.sourceNetworkVersion === selectedNetwork
  );

  const signedIn = fsSignature;
  const error = walletConnectError;

  const showTransactions =
    signedIn && !loadingTransactions && !error && transactions.size > 0;

  return (
    <div className={classes.container}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell align="left">Transaction</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>
              <div className={classes.actionsCell}></div>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {showTransactions &&
            transactions
              .sort((txa, txb) => {
                return (txa.txCreatedAt ?? 0) < (txb?.txCreatedAt ?? 0) ? 1 : 0;
              })
              .map((tx, i) => {
                const destAsset = tx.destAsset.toUpperCase();
                const sourceAsset = tx.sourceAsset.toUpperCase();
                return (
                  <TableRow key={i}>
                    <TableCell align="left">
                      <Typography variant="caption">
                        {tx.sourceAmount ? tx.sourceAmount : tx.amount}{" "}
                        {sourceAsset} → {destAsset}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">
                        <ConversionStatus tx={tx} />
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Grid container justify="flex-end">
                        <ConversionActions tx={tx} />
                      </Grid>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
      <div>
        {!showTransactions && (
          <div className={classes.emptyMessage}>
            {loadingTransactions ? (
              <Typography variant="caption">Loading transactions...</Typography>
            ) : (
              <React.Fragment>
                {error ? (
                  <Typography variant="caption">
                    Connect failed.{" "}
                    <ActionLink onClick={initLocalWeb3}>Retry</ActionLink>
                  </Typography>
                ) : signedIn && !transactions.size ? (
                  <Typography variant="caption">No transactions</Typography>
                ) : !signedIn ? (
                  <Typography variant="caption">
                    Please{" "}
                    <ActionLink onClick={initLocalWeb3}>
                      connect wallet
                    </ActionLink>{" "}
                    to view transactions
                  </Typography>
                ) : null}
              </React.Fragment>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
