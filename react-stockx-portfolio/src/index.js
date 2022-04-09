import React from "react"
import ReactDOM from "react-dom"
import App from "./App.js"

import {AuthProvider} from './context/AuthProvider'
import {StockProvider} from "./context/StockProvider"



ReactDOM.render(
    <React.StrictMode>
        <StockProvider>
            <AuthProvider>
                <App/>
            </AuthProvider>
        </StockProvider>
    </React.StrictMode>,
    document.getElementById("root")
)



