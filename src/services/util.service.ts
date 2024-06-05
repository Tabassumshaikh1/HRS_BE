import * as bcrypt from "bcryptjs";
import { CommonConst } from "../data/app.constants";

const camelToTitleCase = (value: string) =>
  value
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()
    .toLowerCase()
    .replace(/^./, (match) => match.toUpperCase());

const encodeBase64 = (value: any) => {
  return Buffer.from(JSON.stringify(value)).toString(CommonConst.BASE64);
};

const decodeBase64 = (value: any) => {
  return JSON.parse(Buffer.from(value, CommonConst.BASE64).toString(CommonConst.ASCII));
};

const bcryptValue = async (value: any): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(value, salt);
};

const compareBcryptValue = async (value: any, hashedValue: any): Promise<boolean> => {
  return await bcrypt.compare(value, hashedValue);
};

export { bcryptValue, camelToTitleCase, compareBcryptValue, decodeBase64, encodeBase64 };
