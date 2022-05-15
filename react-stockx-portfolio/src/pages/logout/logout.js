import React,{ useState,useContext,useEffect } from 'react'
import PropTypes from 'prop-types'

import { Navigate } from 'react-router-dom'

import AuthContext from '../../context/AuthProvider'

import axios from './../../api/axios'

import StockContext from '../../context/StockProvider'








const Logout = props => {
    
    const {setCurrentStock,setCurrentStockIsInitialised} = useContext(StockContext)
    const { setAuth_state , setEmail,email,auth_state } = useContext(AuthContext)
    const [loggedOutState,setLoggedOutState] = useState(false)
    const [TimeSinceLoad,setTimeSinceLoad] = useState(0)
    const [PageMessage,setPageMessage] = useState(<>logging out...</>)

  
    useEffect(()=>{
        function onSuccess(){
            setCurrentStock([])
            setCurrentStockIsInitialised(false)
            setLoggedOutState(true)
            setAuth_state(false)
            setEmail("")
        }

        function onFail(){
            setLoggedOutState(false)
        }


        async function logOut(){
            const response = await axios.get(
                "auth/logout"
            )
            console.log(response)
            if(response.data.result === true){
                onSuccess()
            }
            if(response.data.result === false){
                onFail()
            }
        }

        logOut()

    },[])


    useEffect(()=>{
        async function incTime(){
            await new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    setTimeSinceLoad((currentValue)=>{
                        return currentValue += 1
                    })
                    resolve()
                },1000)
            })
            
            if(TimeSinceLoad >= 5){
                setPageMessage(
                    <>
                        Looks like there has been an error logging out. Please refresh the page to retry.
                    </>
                )
            }
        }

        incTime()


    },[TimeSinceLoad])

    return (
        loggedOutState ? <Navigate to="/"/> : PageMessage
    )
}

Logout.propTypes = {}

export default Logout