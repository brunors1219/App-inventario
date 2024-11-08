import React, { createContext, useState } from 'react';
import { ENVIRONMENT, API_URL_PROD, API_URL_DEV, USER_DEFAULT, PWD_DEFAUT } from '@env';
export const AppContext = createContext();

export const AppProvider = ({ children }) => {

  const [userId, setUserId] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [theme, setTheme] = useState("light");

  const [gPosition, setGPosition] = useState("");
  const [gPN, setGPN] = useState("");
  const [gDescription, setGDescription] = useState("");
  const [gScore, setGScore] = useState("");

  const [gENVIRONMENT, setgENVIRONMENT] = useState(ENVIRONMENT);
  const [gUSER_DEFAULT, setgUSER_DEFAULT] = useState(USER_DEFAULT);
  const [gPWD_DEFAUT, setgPWD_DEFAUT] = useState(PWD_DEFAUT);

  const [URL, setURL] = useState(ENVIRONMENT=="DEV" ? API_URL_DEV : API_URL_PROD)

  const [forceUpdate, setForceUpdate] = useState(false)

  const clearContextItem = () => {
    //setGPosition("");
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
                forceUpdate, setForceUpdate,
                gENVIRONMENT,
                gUSER_DEFAULT,
                gPWD_DEFAUT,
                clearContextItem}}>
      {children}
    </AppContext.Provider>
  );
};
