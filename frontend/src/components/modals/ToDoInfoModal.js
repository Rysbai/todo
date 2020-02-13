import React, { Component } from 'react';
import {MDBContainer, MDBBtn, MDBModal, MDBModalBody, MDBModalHeader, MDBModalFooter, MDBTypography} from 'mdbreact';


export default (todo) => {
  return ({}) => {
    const [modal, setModal] = React.useState(true);
    const toggle = () => { setModal(!modal) };

    return (
      <MDBModal isOpen={modal} toggle={toggle}>
        <MDBModalHeader toggle={toggle}>ToDo Info</MDBModalHeader>
        <MDBModalBody>
          <MDBTypography>Title: {todo.name}</MDBTypography>
          <MDBTypography>Description: {todo.description}</MDBTypography>
          <MDBTypography>Start at: {todo.start_at}</MDBTypography>
          <MDBTypography>End at: {todo.finish_at}</MDBTypography>
        </MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
        </MDBModalFooter>
      </MDBModal>
    )
  }
}