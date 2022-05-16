import React,{useContext} from 'react'
import { Outlet } from 'react-router-dom'

import SettingsContext from '../context/SettingsProvider'
import { SettingsProvider } from '../context/SettingsProvider'

import LoadSettingsPage from '../pages/LoadSettings/LoadSettings'

const useSettings = () => {
    const {settingsIsInit} = useContext(SettingsContext)
    return settingsIsInit
}


const SettingsRoutes = () => {
    return useSettings() === true ? <Outlet/> : <LoadSettingsPage/>
}



export default SettingsRoutes