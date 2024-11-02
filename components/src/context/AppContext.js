import React, { createContext, useState } from 'react';
import { ENVIROMENT, API_URL_PROD, API_URL_DEV } from '@env';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  const [gPosition, setGPosition] = useState("");
  const [gPN, setGPN] = useState("");
  const [gDescription, setGDescription] = useState("");

  const [URL, setURL] = useState(ENVIROMENT=="DEV" ? API_URL_DEV : API_URL_PROD)
  console.log("URL "+ URL + "ENVIROMMENT " + ENVIROMENT)
  return (
    <AppContext.Provider 
      value={{ user, setUser, 
                URL, 
                theme, setTheme, 
                gPosition, setGPosition, 
                gDescription, setGDescription,
                gPN, setGPN}}>
      {children}
    </AppContext.Provider>
  );
};
