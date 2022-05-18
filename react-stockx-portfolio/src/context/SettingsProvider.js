import { createContext,useEffect,useState } from "react";

import axios from "../api/axios"




const SettingsContext = createContext({})

export const SettingsProvider = ({children}) => {

    let [settings,setSettings] = useState(null)
    let [settingsIsInit,setSettingsIsInit] = useState(false)

    async function settingsInit() {
        try {
            const response = await axios.get("api/private/settings")

            if(response.data.result !== true){
                throw Error("error retrieving user settings. Server responded with result other than true.")
            }

            setSettings(response.data.data)
            setSettingsIsInit(true)
        } catch(err){
            throw(err)
        }
        
    }



    return (
        <SettingsContext.Provider value={{
            settings,
            setSettings,
            settingsIsInit,
            setSettingsIsInit,
            settingsInit
        }}>

        {children}

        </SettingsContext.Provider>
    )
}

export default SettingsContext