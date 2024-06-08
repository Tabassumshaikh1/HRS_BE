import { connect } from "mongoose";
import { AppMessages, CommonConst } from "../data/app.constants";

export const dbConnect = async () => {
  try {
    await connect(process.env.MONGO_URI || CommonConst.EMPTY_STRING);
    console.log(AppMessages.DB_CONN_SUCCESS);
  } catch (error) {
    console.log(AppMessages.DB_CONN_FAIL, error);
    process.exit(1);
  }
};
