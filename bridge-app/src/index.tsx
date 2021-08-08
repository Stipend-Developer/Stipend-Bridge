import React from "react";
import ReactDOM from "react-dom";
import { ThemeProvider } from "@material-ui/core";

import { App } from "./App";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { Store } from "./store/store";
import { TransactionStore } from "./store/transactionStore";
import { Web3Store } from "./store/web3Store";
import { theme } from "./theme/theme";
import { Transaction } from "./types/transaction";
import { newDefaultDatabase } from "./utils/database/defaultDatabase";
import { FeeStore } from "./store/feeStore";

const database = newDefaultDatabase<Transaction>();

const render = (Component: React.FC<any>) => {
  ReactDOM.render(
    <Store.Provider initialState={database}>
      <FeeStore.Provider>
        <TransactionStore.Provider>
          <Web3Store.Provider>
            <ThemeProvider theme={theme}>
              <Component />
            </ThemeProvider>
          </Web3Store.Provider>
        </TransactionStore.Provider>
      </FeeStore.Provider>
    </Store.Provider>,
    document.getElementById("root")
  );
};
render(App);

// tslint:disable-next-line: no-any
if ((module as any).hot) {
  // tslint:disable-next-line: no-any
  (module as any).hot.accept("./App", () => {
    const NextApp = require("./App").App;
    render(NextApp);
  });
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
