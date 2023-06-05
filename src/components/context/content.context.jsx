import React, { createContext, useState, useEffect } from "react";
import { GetDataArray } from "../../utils/firebase/firebase.utils";
export const ContentContext = createContext();

export const ContentProvider = ({ children }) => {
  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const dataArray = await GetDataArray();
      setContents(dataArray);
    };
    fetchData();
  }, []);

  return (
    <ContentContext.Provider value={{ contents, setContents }}>
      {children}
    </ContentContext.Provider>
  );
};
