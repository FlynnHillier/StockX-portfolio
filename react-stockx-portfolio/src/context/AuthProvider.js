import { createContext,useState } from "react";

const AuthContext = createContext({})

export const AuthProvider = ({children}) => {

    const [email,setEmail] = useState("")
    const [auth_state,setAuth_state] = useState(false)

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