import { AgeBand } from "./plan-types";

export const AGE_BANDS: { label: string; value: AgeBand }[] = [
  { label: "0 a 18 anos", value: "0-18" },
  { label: "19 a 23 anos", value: "19-23" },
  { label: "24 a 28 anos", value: "24-28" },
  { label: "29 a 33 anos", value: "29-33" },
  { label: "34 a 38 anos", value: "34-38" },
  { label: "39 a 43 anos", value: "39-43" },
  { label: "44 a 48 anos", value: "44-48" },
  { label: "49 a 53 anos", value: "49-53" },
  { label: "54 a 58 anos", value: "54-58" },
  { label: "59 anos ou mais", value: "59+" },
];

export const DEFAULT_AGE_BAND: AgeBand = "29-33";
