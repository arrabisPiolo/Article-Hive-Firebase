import React, { useContext, useState } from "react";

import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { SampleData } from "../../utils/firebase/firebase.utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./create-post-form.styles.scss";

const CreatePostForm = () => {
  const { currentUser } = useContext(UserContext);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // added state for image preview
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Upload the image file to Firestore Storage if there is one
    let imageUrl = null;
    if (imageFile) {
      const storage = getStorage();
      const storageRef = ref(storage, `images/${Date.now()}_${imageFile.name}`);
      await uploadBytes(storageRef, imageFile);
      imageUrl = await getDownloadURL(storageRef);
    }

    const DEFAULT_PROFILE_PICTURE_PATH = "/default-profile.png";
    const newPost = {
      id: Date.now() + 1,
      title: postTitle,
      author: currentUser.displayName,
      photoURL: currentUser.photoURL || DEFAULT_PROFILE_PICTURE_PATH,
      content: postText,
      authoruid: currentUser.uid,
      imageUrl,
    };

    setPostText("");
    setPostTitle("");
    setImageFile(null);
    setImagePreview(null); // Clear image preview
    navigate("/");

    SampleData(currentUser.uid, newPost);
    // setContents((currentContent) => {
    //   return [...currentContent, newPost];
    // });
  };

  const handleImageChange = (event) => {
    const selectedFile = event.target.files[0];
    setImageFile(selectedFile);

    // Create temporary URL for selected image file
    const objectUrl = URL.createObjectURL(selectedFile);
    setImagePreview(objectUrl);
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="title-field"
          type="text"
          required
          placeholder="Title"
          onChange={(event) => setPostTitle(event.target.value)}
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <img src={imagePreview} alt="Selected" className="imagePreview" />
        )}
        <textarea
          className="content-field"
          required
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
        />
        <button className="btn-save" type="submit">
          Save Post
        </button>
      </form>
    </div>
  );
};

export default CreatePostForm;
