import React, { useState, useContext, useEffect } from "react";
import CreatePostForm from "./create-post-form";
import { ContentContext } from "../context/content.context";
import { UserContext } from "../context/user.context";
import { useNavigate } from "react-router-dom";
import "./blog.scss";
import { doc, getDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../../utils/firebase/firebase.utils";

const Blog = () => {
  const [showForm, setShowForm] = useState(false);
  const [dataArray, setDataArray] = useState([]);
  const { setContents } = useContext(ContentContext);
  const { currentUser } = useContext(UserContext);
  const navigate = useNavigate();
  const handleClick = () => {
    if (currentUser) {
      setShowForm(!showForm);
      navigate("/create-post");
    } else {
      alert("Please Login to Create Post");
    }
  };
  console.log(currentUser);

  // useEffect(() => {
  //   setDataArray(contents.dataArray);
  // }, [contents.dataArray]);

  // useEffect(() => {
  //   const getDataArray = async () => {
  //     const docRef = doc(db, "posts", "user1");
  //     const docSnap = await getDoc(docRef);
  //     if (docSnap.exists()) {
  //       setDataArray(docSnap.data().dataArray);
  //     } else {
  //       console.log("No such document!");
  //     }
  //   };

  //   getDataArray();
  // }, []);

  console.log(dataArray);
  useEffect(() => {
    const getDataArray = async () => {
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
      setDataArray(dataArray);
      setContents(dataArray);
    };

    getDataArray();
  }, []);
  const sortedDataArray = dataArray.sort((a, b) => b.id - a.id);
  return (
    <div className="div-container">
      <div className="blog-container">
        <div className="header">
          <h1>POSTS</h1>
          <span className="create-post" onClick={handleClick}>
            Create Post
          </span>
        </div>
        {showForm && <CreatePostForm />}
        <div>
          <ul>
            {sortedDataArray.map(({ id, title, content, imageUrl }) => {
              return (
                <li key={id}>
                  <div className="post">
                    <span className="title">{title}</span>
                    {imageUrl && (
                      <img src={imageUrl} alt={title} className="img-header" />
                    )}
                    <p className="content">{content}</p>
                    <button
                      className="btn-view"
                      onClick={() => navigate(`/post/${id}`)}
                    >
                      View
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blog;
