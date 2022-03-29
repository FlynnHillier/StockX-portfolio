import React, {useState,useContext} from 'react'
import AuthContext from '../../context/AuthProvider'
import PropTypes from 'prop-types'

import { Container,Row,Col } from 'react-bootstrap'

import axios from "axios"
const LOGIN_URL = "/auth/login"


const LoginForm = ({}) => {
  const { setAuth_state , setEmail } = useContext(AuthContext)
  
  let [password,setPassword] = useState("")
  let [local_email,setLocal_email] = useState("")
  let [password_isHidden,setPassword_isHidden] = useState(false)


  const handleSubmit = async (e) => {
    e.preventDefault()
    
    setAuth_state(true)
    setEmail(local_email)


    try {

      const response = await axios.post(
        "http://localhost:5000/auth/login",
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

      if(response.result === true){
        setEmail(local_email)
        setAuth_state(true)
        console.log("valid")
      }

      if(response.result === false){
        console.log("not valid")
      }

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
        {"Sign In"}
        </button>

      </form>

      <p>
        New user?
        <br/>
        <span className='line'>
          {/* react router link here */}
          <a href="#">Sign Up </a>
        </span>
      </p>
    
    
    </Container>
  )
}

LoginForm.propTypes = {


}

export default LoginForm