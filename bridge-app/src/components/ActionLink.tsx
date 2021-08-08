import { makeStyles } from "@material-ui/core";
import classNames from "classnames";
import React from "react";

import { AProps } from "../types/jsx";

const useStyles = makeStyles({
  link: {
    fontSize: 12,
    textDecoration: "underline",
    cursor: "pointer",
  },
  linkDisabled: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
});

interface Props extends AProps {
  disabled?: boolean;
}

const disabledOnClick = () => {};

export const ActionLink: React.FC<Props> = ({
  disabled,
  children,
  className,
  onClick,
  ...restOfProps
}) => {
  const classes = useStyles();
  return (
    <a
      className={classNames(
        classes.link,
        className,
        disabled ? classes.linkDisabled : ""
      )}
      onClick={disabled ? disabledOnClick : onClick}
      {...restOfProps}
    >
      {children}
    </a>
  );
};
