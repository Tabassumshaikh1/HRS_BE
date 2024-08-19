import { Schema, model } from "mongoose";
import { ISettings } from "../interfaces/settings.interface";
import { SchemaNames } from "../data/app.constants";

const settingsSchema = new Schema<ISettings>(
  {
    pricePerKM: { type: Number, required: true },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Settings = model<ISettings>(SchemaNames.SETTINGS, settingsSchema);
export default Settings;
