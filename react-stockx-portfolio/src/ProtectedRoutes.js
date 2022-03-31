import React,{useContext} from 'react'
import PropTypes from 'prop-types'
import { Outlet } from 'react-router'

import AuthContext from './context/AuthProvider'

import LoginContent from './pages/login/LoginContent'




const ProtectedRoutes = () => {
    const {auth_state} = useContext(AuthContext)
    return auth_state ? <Outlet/> : <LoginContent/>
}

ProtectedRoutes.propTypes = {}

export default ProtectedRoutes