import React from 'react'
import PropTypes from 'prop-types'

import { useState,useContext } from 'react'
import AuthContext from '../../context/AuthProvider'

import {Container,Row,Col} from "react-bootstrap"
import Form from "../../components/misc/Form"

import axios from "../../api/axios"

const LOGIN_URL = "/auth/login"



const LoginContent = () => {

  let {setAuth_state, setEmail} = useContext(AuthContext)
  let [email,local_setEmail] = useState("")
  let [password,setPassword] = useState("")


  return (
    <Container fluid className="body bg-light text-dark px-2 pt-1">
        
          {/* content */}
          <Row>
            <Col>
            </Col>
            <Col xl={4} lg={6} md={6} sm={8} xs={12}>
              <Form 
              title="login"
              fields={[
                {
                  label:"Email",
                  placeholder:"enter email",
                  type:"email",
                  state:email,
                  setState:local_setEmail
                },
                {
                  label:"Password",
                  placeholder:"enter password",
                  type:"password",
                  state:password,
                  setState:setPassword
                }
              ]}
              onSubmit={async (e)=>{
                e.preventDefault()
                
                const response = await axios.post(
                  LOGIN_URL,
                  {
                    email:email,
                    password:password,
                  },
                  {
                    headers:{
                      "Content-Type":"application/json"
                    }
                  }
                )
                
                
                let current_email = response.result.true ? email : ""
                setAuth_state(response.result)
                setEmail(email)


              }}
              submitButtonText="login"
              />
            </Col>
            <Col>
            </Col>
          </Row>




    </Container>
  )
}

LoginContent.propTypes = {}

export default LoginContent