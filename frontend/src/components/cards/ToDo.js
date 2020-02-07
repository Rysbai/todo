import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText, MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
  MDBTypography
} from "mdbreact";

import api from '../../api/index';

export default function(title, description, startAt, endAt, isDone){
  const renderModal = () => {

  };
  return (
    <MDBContainer>
      <MDBRow>
        <MDBCol md={11}>
          <p>{title}</p>
        </MDBCol>
        <MDBCol md={1}>
          <MDBInput filled type="checkbox" id="checkbox2" />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
};