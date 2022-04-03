import React,{ useState, useContext } from 'react'
import AuthContext from '../../context/AuthProvider'

import {Container,Row,Col} from "react-bootstrap"
import Form from '../../components/misc/Form'
import { Link } from 'react-router-dom'

import axios from "./../../api/axios"
const SIGNUP_URL = "/auth/signup"


const SignupContent = () => {

    const [email,local_setEmail] = useState("")
    const [password,setPassword] = useState("")
    const [errorMessage,setErrorMessage] = useState("")

    const { setAuth_state , setEmail } = useContext(AuthContext)

  return (
    <Container fluid className="body bg-light text-dark px-2 pt-1">
        
          {/* content */}
          <Row>
            <Col>
            </Col>
            <Col xl={4} lg={6} md={6} sm={8} xs={12}>
              
              <Form 
                ErrorMessageState={{
                  state:errorMessage,
                  setState:setErrorMessage
                }}
                title="Signup"
                onSubmit={async (e)=>{
                    e.preventDefault()

                    const response = await axios.post(
                      SIGNUP_URL,
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
                    

                    setErrorMessage(response.data.result ? "" : response.data.message)
                    setAuth_state(response.data.result)
                    setEmail(response.data.result ? email : "")

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

              >
                <div>
                already a user?
                <br></br>
                <Link to="/login">log in</Link>

              </div>
            </Form>

            </Col>
            <Col>
            </Col>
          </Row>




    </Container>
  )
}

export default SignupContent