import { BrowserRouter,Route, Routes} from "react-router-dom"
import React from 'react'
import PropTypes from 'prop-types'

import ProtectedRoutes from "./ProtectedRoutes"

import LoginContent from "./pages/login/LoginContent"




const Views = () => {
  return (
    <Routes>
          <Route path="/" element={<ProtectedRoutes/>}>
            <Route path="signup" element={<>YO this is signup</>}/>
            <Route path="bye" element={<>This is bye</>}/>
          </Route>
          <Route path="/" element={<>This is home</>} />
          <Route path="/login" element={<LoginContent/>}/>
          <Route path="/*" element={<>Page not found</>}/>
    </Routes>
  )
}

Views.propTypes = {}

export default Views