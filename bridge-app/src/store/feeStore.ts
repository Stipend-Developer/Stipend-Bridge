import * as Sentry from "@sentry/react";
import { AbiItem } from "web3-utils";
import { UnmarshalledFees } from "@renproject/interfaces";
import { useCallback } from "react";
import curveABI from "../utils/ABIs/curveABI.json";
import { CURVE_MAIN, CURVE_TEST } from "../utils/environmentVariables";
import { Store } from "./store";
import { Transaction } from "../types/transaction";
import { createContainer } from "unstated-next";

export function useFeesStore() {
  const {
    fees,
    convertAmount,
    convertSelectedDirection,
    dataWeb3,
    selectedNetwork,

    setConvertExchangeRate,
    setConvertRenVMFee,
    setConvertNetworkFee,
    setConvertConversionTotal,

    setFees,
  } = Store.useContainer();

  // External Data
  const updateRenVMFees = useCallback(async () => {
    try {
      const fees = await fetch("https://lightnode-mainnet.herokuapp.com", {
        method: "POST", // or 'PUT'
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: 67,
          jsonrpc: "2.0",
          method: "ren_queryFees",
          params: {},
        }),
      });
      const data: UnmarshalledFees = (await fees.json()).result;
      setFees(data);
    } catch (e) {
      console.error(e);
    }
  }, [setFees]);

  const gatherFeeData = useCallback(
    async (directAmount?: number) => {
      const amount = directAmount || convertAmount;
      const selectedDirection = convertSelectedDirection;
      const fixedFee = 0; // Number(fees![Asset.SPD][fixedFeeKey] / 10 ** 8);
      const dynamicFeeRate = 0; // Number(fees![Asset.SPD].ethereum[dynamicFeeKey] / 10000);

      if (!amount || !dataWeb3 || !fees) return;

      try {
        let exchangeRate: number;
        let renVMFee: number;
        let total: number | string;
        const amountInSats = 0; // Math.round(RenJS.utils.value(amount, Asset.SPD).sats().toNumber());
        const curve = new dataWeb3.eth.Contract(
          curveABI as AbiItem[],
          selectedNetwork === "testnet" ? CURVE_TEST : CURVE_MAIN
        );

        // withdraw
        if (selectedDirection) {
          const swapResult =
            (await curve.methods.get_dy(1, 0, amountInSats).call()) / 10 ** 8;
          exchangeRate = Number(swapResult / Number(amount));
          renVMFee = Number(swapResult) * dynamicFeeRate;
          total =
            Number(swapResult - renVMFee - fixedFee) > 0
              ? Number(swapResult - renVMFee - fixedFee)
              : "0.000000";
        } else {
          renVMFee = Number(amount) * dynamicFeeRate;
          const amountAfterMint =
            Number(Number(amount) - renVMFee - fixedFee) > 0
              ? Number(Number(amount) - renVMFee - fixedFee)
              : 0;
          const amountAfterMintInSats = 0; //Math.round(RenJS.utils.value(amountAfterMint, Asset.SPD).sats().toNumber());

          if (amountAfterMintInSats) {
            const swapResult =
              (await curve.methods.get_dy(0, 1, amountAfterMintInSats).call()) /
              10 ** 8;
            exchangeRate = Number(swapResult / amountAfterMint);
            total = Number(swapResult);
          } else {
            exchangeRate = Number(0);
            total = Number(0);
          }
        }

        setConvertExchangeRate(exchangeRate);
        setConvertRenVMFee(renVMFee);
        setConvertNetworkFee(fixedFee);
        setConvertConversionTotal(total);
        return {
          exchangeRate,
          renVMFee,
          fixedFee,
          total,
        };
      } catch (e) {
        console.error(e);
      }
    },
    [
      convertAmount,
      convertSelectedDirection,
      fees,
      dataWeb3,
      selectedNetwork,
      setConvertExchangeRate,
      setConvertRenVMFee,
      setConvertNetworkFee,
      setConvertConversionTotal,
    ]
  );

  const getFinalDepositExchangeRate = useCallback(
    async (tx: Transaction) => {
      const { renResponse } = tx;

      const utxoAmountInSats = Number(renResponse.autogen.amount);
      const dynamicFeeRate = 0; // Number(fees![Asset.SPD].ethereum["mint"] / 10000);
      const finalAmount = Math.round(utxoAmountInSats * (1 - dynamicFeeRate));

      const curve = new dataWeb3!.eth.Contract(
        curveABI as AbiItem[],
        selectedNetwork === "testnet" ? CURVE_TEST : CURVE_MAIN
      );
      try {
        const swapResult = Number(
          (await curve.methods.get_dy(0, 1, finalAmount).call()).toString()
        );
        return swapResult / finalAmount;
      } catch (e) {
        console.error(e);
        Sentry.withScope(function (scope) {
          scope.setTag("error-hint", "fetching deposit exhange rate");
          Sentry.captureException(e);
        });
      }
    },
    [dataWeb3, fees, selectedNetwork]
  );

  return {
    getFinalDepositExchangeRate,
    updateRenVMFees,
    gatherFeeData,
  };
}

export const FeeStore = createContainer(useFeesStore);
