import { Route, Routes,Outlet} from "react-router-dom"
import React from 'react'

import ProtectedRoutes from "./routers/ProtectedRoutes"
import OpenRoutes from "./routers/OpenRoutes"


import LoginContent from "./pages/login/LoginContent"
import SignupContent from "./pages/signup/SignupContent"
import PageNotFound from "./pages/pageNotFound/PageNotFound" 
import LandingPage from "./pages/landingPage/LandingPage"
import CurrentStockPage from "./pages/currentStock/CurrentStockPage"
import CurrentStockViewItemPage from "./pages/itemView/CurrentStockViewItemPage"
import Logout from "./pages/logout/logout"
import ammendItemPage from "./pages/ammendItemPage/AmmendItemPage"
import AmmendItemPage from "./pages/ammendItemPage/AmmendItemPage"


const Views = () => {

  return (
    <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route element={<OpenRoutes/>}>
            <Route path="signup" element={<SignupContent/>}/>
            <Route path="login" element={<LoginContent/>}/>
          </Route>
          <Route  element={<ProtectedRoutes/>}>
            <Route path="/stock">
              <Route path="current">
                <Route path=""  element={<CurrentStockPage/>}/>
                <Route path="view/:itemID" element={<CurrentStockViewItemPage/>}/>
                <Route path="view/:itemID/ammend" element={<AmmendItemPage/>}/>
              </Route>
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