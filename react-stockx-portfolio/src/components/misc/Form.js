import React from 'react'
import PropTypes from 'prop-types'

import { Container } from 'react-bootstrap'




const Form = ({title,fields,onSubmitFunc,ExtraElems,submitButtonText}) => {
  
  return (
    <Container fluid className="p-4">
      
      <Container className='w-100 text-center'>
      <h2> {title} </h2>
      </Container>

      <form onSubmit={onSubmitFunc}>

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
                                required={field.required}
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
    onSubmitFunc:PropTypes.func.isRequired,
    submitButtonText:PropTypes.string,
    ExtraElems:PropTypes.element,
}


Form.defaultProps = {
    ExtraElems:<></>,
    submitButtonText:"Submit"
}

export default Form