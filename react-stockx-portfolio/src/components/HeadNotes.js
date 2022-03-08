import React from 'react'
import PropTypes from 'prop-types'
import { Container,Row,Col } from 'react-bootstrap'

import './StyleSheets/headnotes.css'

const HeadNotes = ({elements}) => {
    


    return (
    <Container className='align-text-top headNotes d-flex flex-row-reverse'>

            {elements.map((element)=>{
                return (
                    <div className='text-end px-2'>
                        {element}
                    </div>
                )
            })}





    </Container>
  )
}

HeadNotes.propTypes = {

}

export default HeadNotes