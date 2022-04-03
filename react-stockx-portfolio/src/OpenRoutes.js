import react,{ useContext } from 'react'
import AuthContext from './context/AuthProvider'

import { Navigate,Outlet } from 'react-router-dom'


const useAuth = () => {
    const {auth_state} = useContext(AuthContext)
    return !auth_state
}


const OpenRoutes = () => {
    return useAuth() ? <Outlet/> : <Navigate to="/"/>
}


export default OpenRoutes