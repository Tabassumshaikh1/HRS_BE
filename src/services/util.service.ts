import * as bcrypt from "bcryptjs";
import { AppDefaults, CommonConst, QueryBuilderKeys, UserRoles } from "../data/app.constants";
import { IBuildQuery, IQuery } from "../interfaces/query.interface";
import { Request } from "express";
import { SortOrder } from "mongoose";

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

const buildQuery = (queryBuilderKey: `${QueryBuilderKeys}`, req: Request, defaultValues?: IQuery): IBuildQuery => {
  const queryParams: IQuery = {
    page: parseInt(req.query.page as string) - 1 || defaultValues?.page || 0,
    limit: parseInt(req.query.limit as string) || defaultValues?.limit || 0,
    sort: (req.query.sort || defaultValues?.sort || AppDefaults.SORT) as string,
    sortBy: (req.query.sortBy || req.query.orderBy || defaultValues?.sortBy || AppDefaults.SORT_BY) as SortOrder,
  };

  let query: any = {};

  switch (queryBuilderKey) {
    case QueryBuilderKeys.DRIVER_LIST:
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: req.query.q || "", $options: "i" } },
              { email: { $regex: req.query.q || "", $options: "i" } },
              { userName: { $regex: req.query.q || "", $options: "i" } },
              { contactNumber: { $regex: req.query.q || "", $options: "i" } },
              { licenseNumber: { $regex: req.query.q || "", $options: "i" } },
            ],
          },
          { role: { $eq: UserRoles.DRIVER } },
        ],
      };
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      return { query, queryParams };

    default:
      return { query, queryParams };
  }
};

export { bcryptValue, camelToTitleCase, compareBcryptValue, decodeBase64, encodeBase64, buildQuery };
