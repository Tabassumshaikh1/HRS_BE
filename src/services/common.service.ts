import { AppError } from "../classes/app-error.class";
import { HttpStatus, ValidationKeys } from "../data/app.constants";
import { ISettings } from "../interfaces/settings.interface";
import Settings from "../models/settings.model";
import validate from "../validators/validation";

const getSettings = async (): Promise<ISettings> => {
  const settings = await Settings.find();
  if (!settings.length) {
    return {} as ISettings;
  }
  return settings[0];
};

const addUpdateSettings = async (reqBody: ISettings): Promise<ISettings> => {
  // Validating Settings before saving into DB
  const errorMessage = validate(ValidationKeys.SETTINGS, reqBody);
  if (errorMessage) {
    throw new AppError(HttpStatus.BAD_REQUEST, errorMessage);
  }

  const existingSettings = await getSettings();

  if (existingSettings?._id) {
    return (await Settings.findByIdAndUpdate(existingSettings?._id, reqBody)) as ISettings;
  } else {
    const settings = new Settings({
      pricePerKM: reqBody.pricePerKM || 0,
    });
    return await settings.save();
  }
};

export { getSettings, addUpdateSettings };
