import { makeStyles } from "@material-ui/core";
import Backdrop from "@material-ui/core/Backdrop";
import Button from "@material-ui/core/Button";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import classNames from "classnames";
import React from "react";

import { Store } from "../store/store";
import { TransactionStore } from "../store/transactionStore";

const useStyles = makeStyles((theme) => ({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: theme.spacing(2),
    [theme.breakpoints.down("xs")]: {
      overflowY: "scroll",
      overflowX: "hidden",
      alignItems: "flex-start",
    },
  },
  modalContent: {
    backgroundColor: "#fff",
    width: 360,
    maxWidth: "100%",
    padding: theme.spacing(2),
  },
  signInInput: {
    width: "100%",
  },
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },
  arrow: {
    width: 30,
  },
  subtitle: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(3),
  },
  divider: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  dividerTotal: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  cancelButton: {
    marginTop: theme.spacing(3),
  },
  backButton: {
    marginTop: theme.spacing(1),
  },
}));

export const CancelModalContainer: React.FC = () => {
  const classes = useStyles();
  const {
    cancelModalTx,
    showCancelModal,
    setShowCancelModal,
    setCancelModalTx,
    convertTransactions,
  } = Store.useContainer();

  const transaction = convertTransactions
    .filter((tx) => tx.id === cancelModalTx)
    .first(null);

  const { removeTx } = TransactionStore.useContainer();

  if (!transaction) return null;

  const cancelDeposit = () => {
    if (!transaction) return;
    removeTx(transaction);

    setShowCancelModal(false);
    setCancelModalTx(null);
  };

  const goBack = () => {
    setShowCancelModal(false);
    setCancelModalTx(null);
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={showCancelModal}
      onClose={() => {
        setShowCancelModal(false);
        setCancelModalTx(null);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showCancelModal}>
        <Grid container className={classes.modalContent}>
          <Grid container alignItems="center" justify="center">
            <Grid item xs={12}>
              <Grid container>
                {
                  <Typography variant="subtitle1" className={classes.title}>
                    Are you sure?
                  </Typography>
                }

                <Typography variant="body1">
                  Bitcoin sent to this deposit address will be no longer be
                  accessible.
                </Typography>

                {
                  <Button
                    variant="outlined"
                    size="large"
                    color="primary"
                    fullWidth={true}
                    className={classNames(classes.cancelButton)}
                    onClick={cancelDeposit}
                  >
                    Cancel deposit
                  </Button>
                }

                {
                  <Button
                    size="large"
                    color="primary"
                    fullWidth={true}
                    className={classNames(classes.backButton)}
                    onClick={goBack}
                  >
                    Go back
                  </Button>
                }
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Fade>
    </Modal>
  );
};
