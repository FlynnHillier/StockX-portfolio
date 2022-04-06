import React,{ useState,useContext,useEffect } from 'react'
import PropTypes from 'prop-types'

import { Navigate } from 'react-router-dom'

import AuthContext from '../../context/AuthProvider'

import axios from './../../api/axios'








const Logout = props => {
    
    const { setAuth_state , setEmail,email,auth_state } = useContext(AuthContext)
    const [loggedOutState,setLoggedOutState] = useState(false)
    const [TimeSinceLoad,setTimeSinceLoad] = useState(0)
    const [PageMessage,setPageMessage] = useState(<>logging out...</>)

  
    useEffect(()=>{

        async function logOut(){
            const response = await axios.get(
                "auth/logout"
            )

            setLoggedOutState(response.data.result ? true : false)
            setAuth_state(response.data.result ? false : auth_state)

            setEmail(response.data.result ? "" : email)
        }

        logOut()

    },[])


    useEffect(()=>{

        console.log("second")

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