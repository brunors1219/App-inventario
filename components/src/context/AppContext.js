import React, { createContext, useState } from 'react';
import { ENVIROMENT, API_URL_PROD, API_URL_DEV } from '@env';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const [position, setPosition] = useState("");
  const [item, setItem] = useState("");

  const [URL, setURL] = useState(API_URL_PROD)
  return (
    <AppContext.Provider 
      value={{ user, setUser, 
                theme, setTheme, 
                position, setPosition, 
                URL, 
                item, setItem}}>
      {children}
    </AppContext.Provider>
  );
};
