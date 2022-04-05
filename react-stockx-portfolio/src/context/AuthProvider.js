import { createContext,useEffect,useState } from "react";

import axios from "./../api/axios"




const AuthContext = createContext({})

export const AuthProvider = ({children}) => {

    const [email,setEmail] = useState("")
    const [auth_state,setAuth_state] = useState(false)


    useEffect(()=>{
        
        async function getSavedAuthState() {
            const response = await axios.get("auth")
            
            setAuth_state(response.data.result)
            setEmail(response.data.email !== undefined ? response.data.email : "")
        }


        getSavedAuthState()
    },[])

    return (
        <AuthContext.Provider value={{
            email,
            setEmail,
            auth_state,
            setAuth_state
        }}>

        {children}

        </AuthContext.Provider>
    )
}

export default AuthContext