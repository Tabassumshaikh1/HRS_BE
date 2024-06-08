import { initializeApp } from "firebase/app";
import { getDownloadURL, getStorage, ref, uploadBytes, deleteObject } from "firebase/storage";
import firebaseConfig from "../configs/firebase.config";
import { CommonConst, ImageMimeType } from "../data/app.constants";

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const uploadFileOnFirebase = (file: Express.Multer.File, moduleName: string): Promise<string | null> => {
  return new Promise<string | null>(async (resolve, reject) => {
    let fileName = file.originalname.toLowerCase().split(CommonConst.EMPTY_SPACE).join(CommonConst.EMPTY_STRING);
    const ext = (ImageMimeType as any)[file.mimetype];
    fileName = `${fileName}-${Date.now()}.${ext}`;

    const storageRef = ref(storage, `${moduleName}/${fileName}`);
    const metadata = { contentType: file.mimetype, name: file.originalname };

    await uploadBytes(storageRef, file.buffer, metadata)
      .then(async (snapshot) => {
        const uploadedFileUrl = await getDownloadURL(snapshot.ref);
        resolve(uploadedFileUrl);
      })
      .catch((error) => {
        resolve(null);
      });
  });
};

const removeFileFromFirebase = async (imageUrl: string) => {
  try {
    const storageRef = ref(storage, imageUrl);
    await deleteObject(storageRef);
    return true;
  } catch (error) {
    return false;
  }
};
export { uploadFileOnFirebase, removeFileFromFirebase };
