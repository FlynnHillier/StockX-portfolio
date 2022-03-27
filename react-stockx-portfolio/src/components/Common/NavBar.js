import React from 'react'
import PropTypes from 'prop-types'
import urlPropType from 'url-prop-type';

import { Nav } from 'react-bootstrap'

import './StyleSheets/navbar.css'




const NavBar = ({components}) => {
  return (
    <Nav
        activeKey={components.find((component)=> component.active === true).url}
        onSelect={(selectedKey) => {
            alert(selectedKey)
        }}

        className="border-top border-bottom border-1 border-secondary ps-2"
    >


        {components.map((component) => {
            return (
            <Nav.Item key={component.name}>
                <Nav.Link href={component.url} > {component.name} </Nav.Link>
            </Nav.Item>
            )
        })}


    </Nav>
  )
}

NavBar.propTypes = {
    components:PropTypes.arrayOf(PropTypes.shape({
        url:urlPropType.isRequired,
        name:PropTypes.string.isRequired
    })),
}

export default NavBar