import bodyParser from "body-parser";
import cors from "cors";
import * as dotenv from "dotenv";
import express, { Express } from "express";
import { errorHandler, notFound } from "./src/middleware/error.middleware";
import routes from "./src/routes/routes";

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());
app.use(cors());
app.use("/", routes);
app.use(notFound);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
  console.log(`Server started at ${process.env.PORT} port`);
});
