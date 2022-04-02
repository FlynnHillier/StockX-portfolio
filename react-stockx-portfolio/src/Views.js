import { BrowserRouter,Route, Routes} from "react-router-dom"
import React from 'react'
import PropTypes from 'prop-types'

import ProtectedRoutes from "./ProtectedRoutes"
import OpenRoutes from "./OpenRoutes"

import LoginContent from "./pages/login/LoginContent"
import SignupContent from "./pages/signup/SignupContent"

import AuthContext from './context/AuthProvider'
import { useContext } from "react"


const Views = () => {

  let {auth_state} = useContext(AuthContext)

  return (
    <Routes>
          <Route element={<OpenRoutes/>}>
            <Route path="signup" element={<SignupContent/>}/>
            <Route path="login" element={<LoginContent/>}/>
          </Route>
          <Route  element={<ProtectedRoutes/>}>
            <Route path="/priv" element={<>This is bye</>}/>
          </Route>
          <Route path="/*" element={<>Page not found</>}/>
    </Routes>
  )
}

Views.propTypes = {}

export default Views