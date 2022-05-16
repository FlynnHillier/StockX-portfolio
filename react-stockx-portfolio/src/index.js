import React from "react"
import ReactDOM from "react-dom"
import App from "./App.js"

import {AuthProvider} from './context/AuthProvider'
import {StockProvider} from "./context/StockProvider"
import {SettingsProvider} from "./context/SettingsProvider"


ReactDOM.render(
    <React.StrictMode>
        <StockProvider>
            <AuthProvider>
                <SettingsProvider>
                    <App/>
                </SettingsProvider>
            </AuthProvider>
        </StockProvider>
    </React.StrictMode>,
    document.getElementById("root")
)



