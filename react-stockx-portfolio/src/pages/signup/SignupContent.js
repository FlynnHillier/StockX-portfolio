import React from 'react'
import PropTypes from 'prop-types'

import { useState, useContext } from 'react'

import {Container,Row,Col} from "react-bootstrap"
import Form from '../../components/misc/Form'

import AuthContext from '../../context/AuthProvider'



const SignupContent = () => {

    const [email,local_setEmail] = useState("")
    const [password,setPassword] = useState("")

    const { setAuth_state , setEmail } = useContext(AuthContext)

  return (
    <Container fluid className="body bg-light text-dark px-2 pt-1">
        
          {/* content */}
          <Row>
            <Col>
            </Col>
            <Col xl={4} lg={6} md={6} sm={8} xs={12}>
              
              <Form 
                title="Test Form"
                onSubmit={function(e){
                    e.preventDefault()
                    setAuth_state(true)
                    setEmail(email)
                }}
                fields={[
                    {
                        label:"Email",
                        type:"email",
                        placeholder:"enter email",
                        setState:local_setEmail,
                        state:email,
                    },
                    {
                        label:"Password",
                        type:"password",
                        placeholder:"enter password",
                        setState:setPassword,
                        state:password,
                    },
                    
                ]}
              />

            </Col>
            <Col>
            </Col>
          </Row>




    </Container>
  )
}

SignupContent.propTypes = {}

export default SignupContent