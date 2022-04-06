import { Route, Routes,Outlet} from "react-router-dom"
import React from 'react'

import ProtectedRoutes from "./ProtectedRoutes"
import OpenRoutes from "./OpenRoutes"


import LoginContent from "./pages/login/LoginContent"
import SignupContent from "./pages/signup/SignupContent"
import PageNotFound from "./pages/pageNotFound/PageNotFound" 
import LandingPage from "./pages/landingPage/LandingPage"
import CurrentStock from "./pages/currentStock/CurrentStock"
import Logout from "./pages/logout/logout"


const Views = () => {

  return (
    <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route element={<OpenRoutes/>}>
            <Route path="signup" element={<SignupContent/>}/>
            <Route path="login" element={<LoginContent/>}/>
          </Route>
          <Route  element={<ProtectedRoutes/>}>
            <Route 
              path="/stock" 
              element={
                <>
                  <Outlet/>
                </>
              }
            >
              <Route path="current" element={<CurrentStock/>}/>
            </Route>
            <Route path="/priv" element={<>This is bye</>}/>
            <Route path="/logout" element={<Logout/>}/>
          </Route>
          <Route path="/*" element={<PageNotFound/>}/>
    </Routes>
  )
}

Views.propTypes = {}

export default Views