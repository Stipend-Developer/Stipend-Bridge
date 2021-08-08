import React from "react";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  footerContainer: {
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
    fontSize: 10,
    "& a": {
      color: "#333",
      marginRight: theme.spacing(2),
    },
  },
  footerLogo: {
    height: 32,
    width: "auto",
    marginRight: theme.spacing(2),
  },
}));

export const Footer: React.FC = () => {
  const classes = useStyles();

  return (
    <Grid container className={classes.footerContainer}>
      <Container fixed maxWidth="lg">
        <Grid container alignItems="center" justify="flex-end">
          <Typography variant="caption">
            Welcome to the WSPD Bridge! This is a new project, so please use with caution.
          </Typography>
        </Grid>
      </Container>
    </Grid>
  );
};
