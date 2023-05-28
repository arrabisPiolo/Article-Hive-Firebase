import React, { useContext, useState, useEffect } from "react";
import * as Yup from "yup";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { SampleData } from "../../utils/firebase/firebase.utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import "./create-post-form.styles.scss";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters long"),
});

const CreatePostForm = () => {
  const { currentUser } = useContext(UserContext);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // added state for image preview
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      // User is not logged in, redirect to login page or another appropriate page
      navigate("/log-in");
    }
  }, [currentUser, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    event.preventDefault();

    try {
      await validationSchema.validate({ title: postTitle, content: postText });

      // Validation successful, proceed with form submission

      // Upload the image file to Firestore Storage if there is one
      let imageUrl = null;
      if (imageFile) {
        const storage = getStorage();
        const storageRef = ref(
          storage,
          `images/${Date.now()}_${imageFile.name}`
        );
        await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const DEFAULT_PROFILE_PICTURE_PATH = "/default-profile.png";

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const createdAt = currentDate.getTime(); // Current timestamp in milliseconds
      const newPost = {
        id: Date.now() + 1,
        title: postTitle,
        author: currentUser.displayName,
        photoURL: currentUser.photoURL || DEFAULT_PROFILE_PICTURE_PATH,
        content: postText,
        authoruid: currentUser.uid,
        imageUrl,
        createdAt: createdAt,
        formattedDate: formattedDate,
      };

      setPostText("");
      setPostTitle("");
      setImageFile(null);
      setImagePreview(null); // Clear image preview
      navigate("/");

      SampleData(currentUser.uid, newPost);
    } catch (error) {
      // Validation failed, display the validation error message
      console.error(error.message);
    }
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
          minLength={5}
          maxLength={50}
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
