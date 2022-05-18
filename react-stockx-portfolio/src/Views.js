import { Route, Routes,Outlet} from "react-router-dom"
import React from 'react'

import ProtectedRoutes from "./routers/ProtectedRoutes"
import OpenRoutes from "./routers/OpenRoutes"
import StockRouter from "./routers/StockRouting"
import SettingsRoutes from "./routers/SettingsRoutes"

import LoginContent from "./pages/login/LoginContent"
import SignupContent from "./pages/signup/SignupContent"
import PageNotFound from "./pages/pageNotFound/PageNotFound" 
import LandingPage from "./pages/landingPage/LandingPage"
import CurrentStockPage from "./pages/currentStock/CurrentStockPage"
import CurrentStockViewItemPage from "./pages/itemView/CurrentStockViewItemPage"
import Logout from "./pages/logout/logout"
import AmmendCurrentStockPage from "./pages/AmmendCurrentStockPage/AmmendCurrentStockPage"

import AmmendItem from "./pages/AmmendItemPageV2/AmmendItem"
import SettingsPage from "./pages/Settings/SettingsPage"


const Views = () => {

  return (
    <Routes>
          <Route path="/" element={<LandingPage/>}/>
          <Route element={<OpenRoutes/>}>
            <Route path="signup" element={<SignupContent/>}/>
            <Route path="login" element={<LoginContent/>}/>
          </Route>
          <Route  element={<ProtectedRoutes/>}>
          <Route element={<SettingsRoutes/>}>
              <Route path="/settings" element={<SettingsPage/>}/>
              <Route path="/stock">
                <Route path="current" element={<StockRouter/>}>
                  <Route path=""  element={<CurrentStockPage/>}/>
                  <Route path="ammend" element={<AmmendCurrentStockPage/>}/>
                  <Route path="view/:itemID" element={<CurrentStockViewItemPage/>}/>
                  <Route path="view/:itemID/ammend" element={<AmmendItem/>}/>
                </Route>
              </Route>
              <Route path="/priv" element={<>This is bye</>}/>
              <Route path="/logout" element={<Logout/>}/>
          </Route>
          </Route>
          <Route path="/*" element={<PageNotFound/>}/>
    </Routes>
  )
}

Views.propTypes = {}

export default Views