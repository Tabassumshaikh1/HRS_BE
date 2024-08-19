import mongoose, { Schema, model } from "mongoose";
import { SchemaNames } from "../data/app.constants";
import { IAddress } from "../interfaces/address.interface";

const AddressSchema = new Schema<IAddress>(
  {
    name: { type: String, required: true },
    flatNo: { type: String, required: false },
    streetName: { type: String, required: true },
    area: { type: String, required: true },
    pincode: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    lat: { type: Number, required: false },
    lng: { type: Number, required: false },
    isPrimary: { type: Boolean, required: false, default: false },
    user: { type: mongoose.Schema.Types.ObjectId, ref: SchemaNames.USER },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Address = model<IAddress>(SchemaNames.ADDRESS, AddressSchema);
export default Address;
