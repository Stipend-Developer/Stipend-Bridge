import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import InputAdornment from "@material-ui/core/InputAdornment";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import TextField from "@material-ui/core/TextField";
import React, { useRef, useState } from "react";

import { Asset, MINI_ICON_MAP } from "../utils/assets";

const useStyles = makeStyles((theme) => ({
  amountField: {
    width: "100%",
  },
  endAdornment: {
    "& p": {
      color: "#000",
    },
  },
  item: {
    display: "flex",
    fontSize: 14,
    alignItems: "center",
    minWidth: 55,
    paddingLeft: theme.spacing(1),
    "& div": {
      display: "flex",
    },
    justifyContent: "flex-end",
  },
  select: {
    display: "flex",
    "& div": {
      display: "flex",
    },
    "& MuiInput-underline:before": {
      display: "none",
    },
  },
  icon: {
    width: 16,
    height: 16,
    marginRight: theme.spacing(0.75),
  },
}));

interface Props {
  onCurrencyChange: (newCurrency: string) => void;
  onAmountChange: (newAmount: number) => void;
  items: string[];
  inputRef?: React.RefObject<any>;
  disabled?: boolean;
}

export const CurrencyInput: React.FC<Props> = ({
  onCurrencyChange,
  onAmountChange,
  items,
  inputRef,
  disabled,
}) => {
  const classes = useStyles();
  const anchorEl = useRef<any>(null);
  const defaultInputRef = useRef<any>(null);

  const [currency, setCurrency] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = (event: any) => {
    const value = event.target.value;
    if (value) {
      onCurrencyChange(value);
      setCurrency(value);
    }
    setOpen(false);
  };

  const selected = currency || items[0];

  return (
    <TextField
      id=""
      className={classes.amountField}
      placeholder="Convert Amount"
      margin="dense"
      variant="outlined"
      onChange={(event) => {
        if (onAmountChange) {
          onAmountChange(Number(event.target.value));
        }
      }}
      inputRef={inputRef || defaultInputRef}
      type="number"
      InputProps={{
        endAdornment:
          items && items.length && items.length > 1 ? (
            <InputAdornment position="end">
              <Button
                ref={anchorEl}
                aria-controls="simple-menu"
                aria-haspopup="true"
                onClick={handleOpen}
              >
                <img
                  alt=""
                  role="presentation"
                  src={MINI_ICON_MAP[selected.toLowerCase() as Asset]}
                  className={classes.icon}
                />
                <span>{selected}</span>
              </Button>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl.current}
                keepMounted
                open={open}
                onClose={handleClose}
              >
                {items.map((i: string, index: number) => (
                  <MenuItem
                    onClick={() => {
                      handleClose({
                        target: {
                          value: i,
                        },
                      });
                    }}
                    key={index}
                    value={i}
                  >
                    <img
                      alt=""
                      role="presentation"
                      src={MINI_ICON_MAP[i.toLowerCase() as Asset]}
                      className={classes.icon}
                    />
                    <span>{i}</span>
                  </MenuItem>
                ))}
              </Menu>
            </InputAdornment>
          ) : (
            <InputAdornment className={classes.endAdornment} position="end">
              {
                <div className={classes.item}>
                  {
                    <img
                      alt=""
                      role="presentation"
                      src={MINI_ICON_MAP[items[0].toLowerCase() as Asset]}
                      className={classes.icon}
                    />
                  }
                  <span>{items[0]}</span>
                </div>
              }
            </InputAdornment>
          ),
      }}
      inputProps={{
        "aria-label": "bare",
        disabled: disabled,
      }}
    />
  );
};
