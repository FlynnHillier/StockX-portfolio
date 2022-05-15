import { createContext,useEffect,useState } from "react";

import axios from "../api/axios"




const SettingsContext = createContext({})

export const SettingsProvider = ({children}) => {

    const [settings,setSettings] = useState(null)


    useEffect(()=>{
        
        async function getSavedSettings() {
            try {
                const response = await axios.get("api/private/settings")

                if(response.data.result !== true){
                    throw Error("error retrieving user settings. Server responded with result other than true.")
                }

                setSettings(response.data.data)
            } catch(err){
                throw(err)
            }
            
        }


        getSavedSettings()
    },[])

    return (
        <SettingsContext.Provider value={{
            settings,
            setSettings,
        }}>

        {children}

        </SettingsContext.Provider>
    )
}

export default SettingsContext