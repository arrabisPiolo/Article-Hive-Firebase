import React, { useContext, useState, useEffect, useRef } from "react";
import { ContentContext } from "../context/content.context";
import * as Yup from "yup";
import { UserContext } from "../context/user.context";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { UpdatePost } from "../../utils/firebase/firebase.utils";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useDropzone } from "react-dropzone";
import "./create-post-form.styles.scss";

const validationSchema = Yup.object({
  title: Yup.string().required("Title is required"),
  content: Yup.string()
    .required("Content is required")
    .min(20, "Content must be at least 20 characters long"),
});

const EditPostForm = () => {
  const { currentUser } = useContext(UserContext);
  const { contents } = useContext(ContentContext);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();
  const { postId } = useParams();
  const post = contents.find((post) => post.id === parseInt(postId)); // find post with matching id

  useEffect(() => {
    setPostTitle(post.title);
    setPostText(post.content);
    setImagePreview(post.imageUrl);
  }, [post]);

  const textareaRef = useRef(null); // Ref to access the textarea element

  const MAX_HEIGHT = 300; // Define the maximum height value in pixels

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

      const updatedData = {
        title: postTitle,
        content: postText,
        imageUrl: imageUrl ? imageUrl : post.imageUrl,
      };

      await UpdatePost(currentUser.uid, post.id, updatedData);
      navigate("/my-post");
      window.location.reload(); // Reload the page
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
          placeholder="Title"
          value={postTitle}
          minLength={5}
          maxLength={50}
          onChange={(event) => setPostTitle(event.target.value)}
          ref={textareaRef}
        />
        <textarea
          className="content-field"
          required
          value={postText}
          onChange={(event) => setPostText(event.target.value)}
          ref={textareaRef}
        />
        <button className="btn-update" type="submit">
          Update Post
        </button>
      </form>
    </div>
  );
};

export default EditPostForm;
