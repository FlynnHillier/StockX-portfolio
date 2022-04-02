import "./StyleSheets/Form.css"

import React,{useState,useEffect} from 'react'
import PropTypes from 'prop-types'

import { Container } from 'react-bootstrap'





const ErrorHeader = (errorMessage)=>{
  return errorMessage.errorMessage === "" || errorMessage.errorMessage === undefined ? (<></>) : (
    <Container className="form errorContainer p-2">
      {errorMessage.errorMessage === undefined  ? "an error occured." : errorMessage.errorMessage }
    </Container>
  )
}



const Form = ({title,fields,onSubmit,submitButtonText,ErrorMessageState}) => {
  
  // let [errorMessage,setErrorMessage] = ErrorMessageState === undefined ? [undefined,()=>{return}] : ErrorMessageState

  let errorMessage = ErrorMessageState.state !== undefined ? ErrorMessageState.state : undefined
  let setErrorMessage = typeof ErrorMessageState.setState === "function" ? ErrorMessageState.setState : ()=>{return}

  const fieldStates = []
  for(let field of fields){
    fieldStates.push(field.state)
  }




  useEffect(()=>{
    setErrorMessage("")
  },fieldStates)
  


  return (
    <Container fluid className="p-4">
      
      <Container className='w-100 text-center'>
      <h2> {title} </h2>
      </Container>

      <ErrorHeader errorMessage={errorMessage}/>

      <form onSubmit={onSubmit}>

        {
            fields.map((field)=>{
                    return(
                        <section className='form-group my-2' key={title ?`Form_${title}_${fields.indexOf(field)}` : `Form_untitled_${fields.indexOf(field)}`}>
                            <label>
                                {field.label}
                            </label>
                            <input 
                                className='form-control' 
                                placeholder={field.placeholder}
                                type={field.type}
                                value={field.state} 
                                onInput={(e)=>field.setState(e.target.value)}
                                required={field.required === undefined ? true : field.required}
                            />
                        </section>
                    )
                })
        }
        
        <button
          className='btn btn-primary my-1'
        > 
            {submitButtonText}
        </button>
        
      </form>

        {/* <ExtraElems/> */}
    </Container>
  )
}

Form.propTypes = {
    title:PropTypes.string,
    fields:PropTypes.arrayOf(PropTypes.shape({
        label:PropTypes.string,
        placeholder:PropTypes.string,
        type:PropTypes.string,
        setState:PropTypes.func.isRequired,
        state:PropTypes.string.isRequired,
        required:PropTypes.bool,
    })),
    onSubmit:PropTypes.func.isRequired,
    submitButtonText:PropTypes.string,
    ExtraElems:PropTypes.element,
    ErrorMessageState:PropTypes.shape(
      {
        setState:PropTypes.func,
        state:PropTypes.any,
      }
    ),
}


Form.defaultProps = {
    ExtraElems:<></>,
    submitButtonText:"Submit",
    ErrorMessageState:{},
}

export default Form