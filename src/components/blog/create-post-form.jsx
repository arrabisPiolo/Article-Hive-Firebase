import React, { useContext, useState, useEffect, useRef } from "react";
import * as Yup from "yup";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { SampleData } from "../../utils/firebase/firebase.utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  const textareaRef = useRef(null); // Ref to access the textarea element

  const MAX_HEIGHT = 500; // Define the maximum height value in pixels

  const autoExpandTextarea = () => {
    const textarea = textareaRef.current;
    textarea.style.height = "auto"; // Reset the height to auto to recalculate the height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height

    // Check if the height exceeds the maximum height
    if (textarea.scrollHeight > MAX_HEIGHT) {
      textarea.style.height = `${MAX_HEIGHT}px`; // Set the height to the maximum height
      textarea.style.overflowY = "auto"; // Enable vertical scrolling
    } else {
      textarea.style.overflowY = "hidden"; // Disable vertical scrolling
    }
  };
  useEffect(() => {
    textareaRef.current.addEventListener("input", autoExpandTextarea);

    return () => {
      if (textareaRef.current) {
        // Check if the ref exists before removing the event listener
        textareaRef.current.removeEventListener("input", autoExpandTextarea);
      }
    };
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (postText.length < 20) {
      alert("Content must be at least 20 characters long");
      return;
    }

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

      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      });

      const createdAt = currentDate.getTime(); // Current timestamp in milliseconds

      // Creating a new post
      const newPost = {
        id: Date.now() + 1,
        title: postTitle,
        author: currentUser.displayName,
        photoURL: currentUser.photoURL,
        content: postText,
        authoruid: currentUser.uid,
        imageUrl,
        createdAt: createdAt,
        formattedDate: formattedDate,
      };

      setPostText("");
      setPostTitle("");
      setImageFile(null);
      setImagePreview(null);
      navigate("/");

      SampleData(currentUser.uid, newPost);
      toast.success("Your article has been published.");
    } catch (error) {
      // Validation failed, display the validation error message
      console.error(error.message);
    }
  };
  const handleImageDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      setImageFile(selectedFile);

      const objectUrl = URL.createObjectURL(selectedFile);
      setImagePreview(objectUrl);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: "image/*",
    onDrop: handleImageDrop,
  });

  const handleCancelClick = () => {
    navigate("/");
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        {!imagePreview && (
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <img className="image-icon" src="/image-upload.png" alt="" />
            <p>Drag and drop an image here, or click to select a file</p>
          </div>
        )}
        {imagePreview && (
          <div className="image-preview-container">
            <img src={imagePreview} alt="Selected" className="imagePreview" />
            <button
              className="remove-button"
              onClick={() => setImagePreview(null)}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        <textarea
          className="title-field"
          type="text"
          required
          placeholder="New Post Title Here..."
          value={postTitle}
          minLength={5}
          maxLength={100}
          onChange={(event) => setPostTitle(event.target.value)}
          ref={textareaRef}
        />
        <textarea
          className="content-field"
          required
          placeholder="Write your post here..."
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          ref={textareaRef} // Add the ref to the textarea element
        />
        <div className="publish-cancel-container">
          <button className="btn-publish" type="submit">
            Publish
          </button>
          <button
            className="btn-cancel"
            onClick={handleCancelClick}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
