import React from 'react'
import PropTypes from 'prop-types'
import urlPropType from 'url-prop-type';

import { Nav } from 'react-bootstrap'

import './StyleSheets/navbar.css'




const NavBar = ({components}) => {
  return (
    <Nav
        activeKey={components.find((component)=> component.urlPath === window.location.pathname)}
        // onSelect={(selectedKey) => {
        //     window.location.replace(selectedKey.urlPath)
        // }}

        className="border-top border-bottom border-1 border-secondary ps-2"
    >


        {components.map((component) => {
            return (
            <Nav.Item key={component.name}>
                <Nav.Link href={component.urlPath} > {component.name} </Nav.Link>
            </Nav.Item>
            )
        })}


    </Nav>
  )
}

NavBar.propTypes = {
    components:PropTypes.arrayOf(PropTypes.shape({
        urlPath:urlPropType.isRequired,
        name:PropTypes.string.isRequired
    })),
}

export default NavBar