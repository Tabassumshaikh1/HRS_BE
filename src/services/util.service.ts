import { AppDefaults } from "../data/app.constants";

const camelToTitleCase = (value: string) =>
  value
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
    .toLowerCase()
    .replace(/^./, (match) => match.toUpperCase());

const encodeBase64 = (value: any) => {
  return Buffer.from(JSON.stringify(value)).toString(AppDefaults.BASE64);
};

const decodeBase64 = (value: any) => {
  return JSON.parse(Buffer.from(value, AppDefaults.BASE64).toString(AppDefaults.ASCII));
};

export { camelToTitleCase, encodeBase64, decodeBase64 };
