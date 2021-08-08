import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Grid from "@material-ui/core/Grid";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";
import React from "react";
import { makeStyles } from "@material-ui/core";

import { Store } from "../store/store";

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
  title: {
    display: "flex",
    alignItems: "center",
    marginBottom: theme.spacing(2),
    fontWeight: "bold",
  },
  titleContainer: {
    marginBottom: theme.spacing(3),
  },
  content: {
    fontSize: 14,
    width: "100%",
  },
}));

export const NetworkModalContainer: React.FC = () => {
  const classes = useStyles();
  const {
    showNetworkModal,
    selectedNetwork,
    setShowNetworkModal,
  } = Store.useContainer();

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={classes.modal}
      open={showNetworkModal}
      onClose={() => {
        setShowNetworkModal(false);
      }}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={showNetworkModal}>
        <Grid container className={classes.modalContent}>
          <Typography variant="subtitle1" className={classes.title}>
            Switch Network
          </Typography>
          <Typography variant="body1" className={classes.content}>
            Please connect wallet to the{" "}
            {selectedNetwork === "testnet" ? "kovan" : "mainnet"} network.
          </Typography>
        </Grid>
      </Fade>
    </Modal>
  );
};
