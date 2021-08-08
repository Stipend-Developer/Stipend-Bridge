import { ThemeProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";
import { FeeStore } from "./store/feeStore";
import { Store } from "./store/store";
import { TransactionStore } from "./store/transactionStore";
import { Web3Store } from "./store/web3Store";
import { theme } from "./theme/theme";
import { Transaction } from "./types/transaction";
import { newDefaultDatabase } from "./utils/database/defaultDatabase";

const database = newDefaultDatabase<Transaction>();

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Store.Provider initialState={database}>
      <FeeStore.Provider>
        <TransactionStore.Provider>
          <Web3Store.Provider>
            <ThemeProvider theme={theme}>
              <App />
            </ThemeProvider>
          </Web3Store.Provider>
        </TransactionStore.Provider>
      </FeeStore.Provider>
    </Store.Provider>,
    div
  );
  ReactDOM.unmountComponentAtNode(div);
});
