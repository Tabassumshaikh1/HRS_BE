import * as bcrypt from "bcryptjs";
import { AppDefaults, CommonConst, QueryBuilderKeys, UserRoles } from "../data/app.constants";
import { IBuildQuery, IQuery } from "../interfaces/query.interface";
import { Request } from "express";
import mongoose, { SortOrder } from "mongoose";

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

const getUniqueId = (): string => {
  return new mongoose.Types.ObjectId().toString();
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
              { name: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { email: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { userName: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { contactNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { licenseNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
            ],
          },
          { role: { $eq: UserRoles.DRIVER } },
        ],
      };
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      return { query, queryParams };
    case QueryBuilderKeys.VEHICLE_LIST:
      query = {
        $and: [
          {
            $or: [
              { vehicleNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { company: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { capacity: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { mfgYear: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { chassisNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { regNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
            ],
          },
        ],
      };
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      if (req.query.vehicleType) {
        query.$and.push({ vehicleType: { $eq: req.query.vehicleType } });
      }
      return { query, queryParams };
    case QueryBuilderKeys.CUSTOMER_LIST:
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { email: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { userName: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { contactNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { licenseNumber: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
            ],
          },
          { role: { $eq: UserRoles.CUSTOMER } },
        ],
      };
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      if (req.query.accountType) {
        query.$and.push({ accountType: { $eq: req.query.accountType } });
      }
      return { query, queryParams };
    case QueryBuilderKeys.VEHICLE_TYPE_LIST:
      query = {
        $and: [
          {
            $or: [{ name: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } }],
          },
        ],
      };
      return { query, queryParams };
    case QueryBuilderKeys.DAILY_EXPENSE:
      query = {
        $and: [
          {
            $or: [{ remark: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } }],
          },
        ],
      };
      if (req.query.vehicle) {
        query.$and.push({ vehicle: { $eq: req.query.vehicle } });
      }
      if (req.query.fromDate && req.query.toDate) {
        const date = {
          fromDate: req.query.fromDate as string,
          toDate: req.query.toDate as string,
        };
        query.$and.push({
          date: {
            $gte: new Date(date.fromDate),
            $lte: new Date(date.toDate),
          },
        });
      }
      if (req.query.status) {
        query.$and.push({ status: { $eq: req.query.status } });
      }
      if (req.user.role === UserRoles.DRIVER) {
        query.$and.push({ createdBy: { $eq: req.user._id } });
      } else if (req.query.createdBy) {
        query.$and.push({ createdBy: { $eq: req.query.createdBy } });
      }
      return { query, queryParams };
    case QueryBuilderKeys.ADDRESS:
      query = {
        $and: [
          {
            $or: [
              { name: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { flatNo: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { streetName: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { area: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { city: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
              { state: { $regex: req.query.q || CommonConst.EMPTY_STRING, $options: CommonConst.I } },
            ],
          },
        ],
      };
      if (req.user) {
        query.$and.push({ user: { $eq: req.user._id } });
      }
      return { query, queryParams };
    default:
      return { query, queryParams };
  }
};

export { bcryptValue, camelToTitleCase, compareBcryptValue, decodeBase64, encodeBase64, getUniqueId, buildQuery };
