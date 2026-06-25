import {
  FirebaseStorage,
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import { nanoid } from "nanoid";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAK0sul54LA5orLfbEqojHeWOYyQ5rAOV0",
  authDomain: "affiliation-platform-38b20.firebaseapp.com",
  projectId: "affiliation-platform-38b20",
  storageBucket: "affiliation-platform-38b20.appspot.com",
  messagingSenderId: "649297533021",
  appId: "1:649297533021:web:d7789fe5ce1a8aaef895b4",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export const uploadFileToFirebase = (
  fileName: string,
  file: File,
  onProgress: (progress: number) => void
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress(progress);
      },
      (error) => {
        reject(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          resolve(downloadURL);
        });
      }
    );
  });
};

export const deleteFileFromFirebase = (filePath: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const storage = getStorage();
    const storageRef = ref(storage, filePath.trim());
    
    deleteObject(storageRef)
      .then(() => {
        resolve();
      })
      .catch((error) => {
        reject(error);
      });
  });
};
