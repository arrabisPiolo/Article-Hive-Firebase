import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";

import {
  getFirestore,
  collection,
  getDocs,
  setDoc,
  getDoc,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
} from "firebase/firestore";

export const firebaseConfig = {
  apiKey: "AIzaSyCd21ilmYgsxRKoTRoA9QMtJOhvFS_sD1M",
  authDomain: "fir-blog-db1b7.firebaseapp.com",
  projectId: "fir-blog-db1b7",
  storageBucket: "fir-blog-db1b7.appspot.com",
  messagingSenderId: "679571158187",
  appId: "1:679571158187:web:86ce89b7b06986b854b3ee",
};

const app = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();
const gitHubProvider = new GithubAuthProvider();

googleProvider.setCustomParameters({ prompt: "select_account" });

export const auth = getAuth();
export const signInWithGooglePopup = () =>
  signInWithPopup(auth, googleProvider);

export const signInWithGitHubPopUp = async () => {
  const result = await signInWithPopup(auth, gitHubProvider);
  return result;
};
export const db = getFirestore();

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;
  const userDocRef = doc(db, "users", userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  console.log(userSnapshot.exists());

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log("error creating the user", error.message);
    }
  }

  return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (
  email,
  password,
  displayName
) => {
  if (!email || !password) return;

  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  // Set the display name for the user
  await updateProfile(userCredential.user, { displayName });

  return userCredential;
};

export const signInAuthUserWithEmailAndPassword = async (email, password) => {
  if (!email || !password) return;

  return await signInWithEmailAndPassword(auth, email, password);
};

export const signOutUser = async () => await signOut(auth);

export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// export const SampleData = async (data) => {
//   try {
//     const docRef = await addDoc(collection(db, "posts"), data);
//     console.log("Document written with ID: ", docRef.id);
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// };

// export const SampleData = async (data) => {
//   try {
//     await setDoc(doc(db, "posts", "user1"), {
//       dataArray: arrayUnion(data),
//     });
//   } catch (e) {
//     console.error("Error adding document: ", e);
//   }
// };

export const SampleData = async (userId, data) => {
  const postRef = doc(db, "posts", userId);

  try {
    // Try to get the document first to check if it exists
    const postDoc = await getDoc(postRef);

    if (postDoc.exists()) {
      // If the document exists, update it with the new data
      await updateDoc(postRef, {
        dataArray: arrayUnion(data),
      });
    } else {
      // If the document doesn't exist, create it with the new data
      await setDoc(postRef, {
        dataArray: [data],
      });
    }
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const GetDataArray = async () => {
  const docRefs = await getDocs(collection(db, "posts"));
  const ids = docRefs.docs.map((doc) => doc.id);
  const dataArray = [];
  for (const id of ids) {
    const docRef = doc(db, "posts", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data && Array.isArray(data.dataArray)) {
        dataArray.push(...data.dataArray);
      }
    } else {
      console.log(`No such document with ID ${id}!`);
    }
  }
  return dataArray;
};

// export const SampleData = async (data) => {
//   try {
//     await updateDoc(doc(db, "posts", "user1"), {
//       dataArray: arrayUnion(data),
//     });
//   } catch (e) {
//     console.error("Error updating document: ", e);
//   }
// };

// export const SampleData = async (data) => {
//   const docRef = doc(db, "posts", "user1");
//   const docSnap = await getDocs(docRef);

//   if (docSnap.exists()) {
//     try {
//       await updateDoc(docRef, {
//         dataArray: arrayUnion(data),
//       });
//     } catch (e) {
//       console.error("Error updating document: ", e);
//     }
//   } else {
//     try {
//       await setDoc(docRef, {
//         dataArray: arrayUnion(data),
//       });
//     } catch (e) {
//       console.error("Error adding document: ", e);
//     }
//   }
// };

export const getDocsData = async () => {
  const querySnapshot = await getDocs(collection(db, "posts"));
  const data = querySnapshot.docs.map((doc) => doc.data());
  return data;
};
