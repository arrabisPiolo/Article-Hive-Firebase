import React, { createContext, useState, useEffect } from "react";

export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState([]);

  // const handlePostSubmit = (newPost) => {
  //   SampleData(newPost);
  //   setContents((currentContent) => {
  //     return [...currentContent, newPost];
  //   });
  // };

  // const handlePostSubmit = async (newPost) => {
  //   // const id = newPost.id.toString(); // convert the id to a string
  //   await SampleData(newPost);
  //   setContents((currentContent) => {
  //     return [
  //       ...currentContent.filter((content) => content.id !== newPost.id),
  //       newPost,
  //     ];
  //   });
  // };

  return (
    <ContentContext.Provider value={{ contents, setContents }}>
      {children}
    </ContentContext.Provider>
  );
};
