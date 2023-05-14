import React, { useContext, useState } from "react";
import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import { SampleData } from "../../utils/firebase/firebase.utils";
import "./create-post-form.styles.scss";

const CreatePostForm = () => {
  const { setContents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);
  const [postText, setPostText] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const newPost = { id: Date.now() + 1, title: postTitle, content: postText };

    setPostText("");
    setPostTitle("");
    navigate("/");
    SampleData(newPost);
    // setContents((currentContent) => {
    //   return [...currentContent, newPost];
    // });
  };

  return (
    <div className="form-container">
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="title-field"
          type="text"
          placeholder="Title"
          onChange={(event) => setPostTitle(event.target.value)}
        />
        <textarea
          className="content-field"
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
