import React from "react"
import { Modal,Row,Col,Container,Spinner } from "react-bootstrap"

const LoadingModal = ({show,message}) => {
    return (
        <Modal
            show={show}
        >
            <Container fluid className="py-3">
                <Row className="gy-3">
                    <Col xs={12} className="d-flex justify-content-center">
                        <Spinner animation='border'></Spinner>
                    </Col>
                    <Col xs={12} className="text-center">
                        <span className="text-muted">{message}</span>
                    </Col>
                </Row>
            </Container>
        </Modal>
    )
}

export default LoadingModal