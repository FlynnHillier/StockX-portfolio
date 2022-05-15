import React,{useContext} from 'react'
import AuthContext from './../context/AuthProvider'

import { Outlet } from 'react-router-dom'

import LoginContent from '../pages/login/LoginContent'

import { SettingsProvider } from '../context/SettingsProvider'

const useAuth = () => {
    const {auth_state} = useContext(AuthContext)
    return auth_state
}


const ProtectedRoutes = () => {
    return useAuth() ? <SettingsProvider><Outlet/></SettingsProvider> : <LoginContent/>
}



export default ProtectedRoutes