import React, {useState,useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import PropTypes from 'prop-types'

import { Container,Row,Col } from 'react-bootstrap'

import { Link } from 'react-router-dom'

import axios from "./../../api/axios"
const LOGIN_URL = "/auth/login"


const LoginForm = () => {
  const { setAuth_state , setEmail } = useContext(AuthContext)
  
  let [password,setPassword] = useState("")
  let [local_email,setLocal_email] = useState("")
  let [password_isHidden,setPassword_isHidden] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const response = await axios.post(
        LOGIN_URL,
        JSON.stringify({
          email:local_email,
          password:password
        }),
        {
          headers:{
            "Content-Type":"application/json",
          }
        }
      )

      setAuth_state(response.data.result)
      const email = response.data.result ? local_email : ""
      setEmail(email)

      console.log("context set")


    } catch(error){
      console.error(error)
    }
    

  }


  return (
    <Container fluid className="p-4">
      
      <Container className='w-100 text-center'>
      <h2> Login </h2>
      </Container>

      <form onSubmit={handleSubmit}>

        <section className='form-group my-2'>
          <label>Email</label>
          <input 
            className='form-control' 
            placeholder='enter email'
            type="email"
            value={local_email} 
            onInput={(e)=>setLocal_email(e.target.value)}
            required
          />
        </section>

        <section className='form-group my-2'>
          <label>Password</label>
          <input 
            className='form-control' 
            placeholder='enter password' 
            type="password" 
            value={password} 
            onInput={(e)=>setPassword(e.target.value)}
            required
          />
        </section>

        
        <button
          className='btn btn-primary my-1'
        > 
        Sign in
        </button>

      </form>

      <p>
        New user?
        <br/>
        <Link to="/signup"></Link>
      </p>
    
    
    </Container>
  )
}

LoginForm.propTypes = {


}

export default LoginForm