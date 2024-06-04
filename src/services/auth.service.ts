import { Request } from "express";
import { ILoginCredentials, ILoginResponse } from "../interfaces/login.interface";
import { encodeBase64 } from "./util.service";
import { UserRoles, UserStatus } from "../data/app.constants";

const login = async (reqBody: ILoginCredentials): Promise<ILoginResponse> => {
  const token =
    "eyJfaWQiOiIxMjMiLCJuYW1lIjoiVXNlciIsImVtYWlsIjoidXNlckBlbWFpbC5jb20iLCJjb250YWN0TnVtYmVyIjoiOTk5OTk5OTk5IiwicGFzc3dvcmQiOiIxMjIzNDU3Iiwicm9sZSI6IkFETUlOIiwicHJvZmlsZUltYWdlIjpudWxsLCJzdGF0dXMiOiJBY3RpdmUiLCJjcmVhdGVkQXQiOiIyMDI0LTA2LTAyVDA4OjMzOjUwLjIyOFoiLCJ1cGRhdGVkQXQiOiIyMDI0LTA2LTAyVDA4OjMzOjUwLjIyOFoifQ==";
  const user = encodeBase64({
    _id: "123",
    name: "User",
    email: "user@email.com",
    contactNumber: "999999999",
    password: "1223457",
    role: UserRoles.ADMIN,
    profileImage: null,
    status: UserStatus.ACTIVE,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return { token, user };
};

const logout = (req: Request) => {
  return true;
};

export { login, logout };
