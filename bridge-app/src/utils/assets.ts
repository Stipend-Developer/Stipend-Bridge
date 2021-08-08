import SPD from "../assets/tokens/spd.png";
import WSPD from "../assets/tokens/spd.png";

export enum Asset {
  SPD = "spd",
  WSPD = "wspd",
}

export const NAME_MAP = {
  [Asset.SPD]: "Stipend",
  [Asset.WSPD]: "Wrapped Stipend",
};

export const MINI_ICON_MAP = {
  [Asset.SPD]: SPD,
  [Asset.WSPD]: WSPD,
};
