import React,{useContext} from 'react'
import AuthContext from './../context/AuthProvider'

import { Outlet } from 'react-router-dom'

import LoginContent from '../pages/login/LoginContent'


const useAuth = () => {
    const {auth_state} = useContext(AuthContext)
    return auth_state
}


const ProtectedRoutes = () => {
    return useAuth() ? <Outlet/> : <LoginContent/>
}



export default ProtectedRoutes