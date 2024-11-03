import React, { createContext, useState } from 'react';
import { ENVIROMENT, API_URL_PROD, API_URL_DEV } from '@env';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [theme, setTheme] = useState("light");

  const [gPosition, setGPosition] = useState("");
  const [gPN, setGPN] = useState("");
  const [gDescription, setGDescription] = useState("");
  const [gScore, setGScore] = useState("");

  const [URL, setURL] = useState(ENVIROMENT=="DEV" ? API_URL_DEV : API_URL_PROD)

  const clearContextItem = () => {
    setGPosition("");
    setGPN("");
    setGDescription("")
    setGScore("")
  }

  return (
    <AppContext.Provider 
      value={{ userId, setUserId, 
                userProfile, setUserProfile,
                URL, 
                theme, setTheme, 
                gPosition, setGPosition, 
                gDescription, setGDescription,
                gPN, setGPN,
                gScore, setGScore,
                clearContextItem}}>
      {children}
    </AppContext.Provider>
  );
};
