import NodeCache from "node-cache";
import { CommonConst } from "../data/app.constants";

const cache = new NodeCache();

const cacheSetItem = (key: string, value: any, expiryTime?: number) => {
  return cache.set(key, value, expiryTime ? expiryTime : CommonConst.EMPTY_STRING);
};

const cacheGetItem = (key: string) => {
  const value = cache.get(key);
  return value ? value : null;
};

const cacheRemoveItem = (key: string) => {
  return cache.del(key);
};

export { cacheGetItem, cacheRemoveItem, cacheSetItem };
