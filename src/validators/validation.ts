import * as Joi from "joi";
import { UserRoles, UserStatus, ValidationKeys } from "../data/app.constants";

const schemas = {
  [ValidationKeys.NEW_USER]: Joi.object({
    name: Joi.string().required(),
    userName: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    password: Joi.string().required().min(8),
    role: Joi.string().valid(UserRoles.ADMIN, UserRoles.DRIVER, UserRoles.CUSTOMER).required(),
    profileImage: Joi.any(),
    status: Joi.string().valid(UserStatus.ACTIVE, UserStatus.INACTIVE),
  }),

  [ValidationKeys.LOGIN]: Joi.object({
    userName: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
};

const validate = (key: `${ValidationKeys}`, reqBody: any): boolean | string => {
  const { error } = schemas[key].validate(reqBody);
  return error?.details[0].message || false;
};

export default validate;
