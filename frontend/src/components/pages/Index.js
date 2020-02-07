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
import DateTimePicker from 'react-datetime-picker';
import ToDoCard from '../cards/ToDo';
import {Link, Redirect} from "react-router-dom";

import api from '../../api/index';


export default () => {
  const [startToDoTime, setStartToDoTime] = React.useState();
  const [endToDoTime, setEndToDoTime] = React.useState();

  return (
    <MDBContainer className={'mt-4'} >
      <MDBRow>
        <MDBCol md={8}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>ToDo</MDBCardTitle>
              { ToDoCard('Do something', 'Description', '10 Feb', '20 Feb', false)}
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md={4} className={'sticky-top'}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Create ToDo</MDBCardTitle>
              <MDBCardText>
                <MDBInput label="Title" group type="text" validate error="wrong"
                          success="right" />
                <MDBInput label="Short description" group type="textarea" error="wrong"
                          success="right" />
                <label className={'mr-2'}>Start at</label>
                <DateTimePicker
                  onChange={setStartToDoTime}
                  value={startToDoTime}
                />
                <br/>
                <br/>
                <label className={'mr-2'}>End at</label>
                <DateTimePicker
                  onChange={setEndToDoTime}
                  value={endToDoTime}
                />
              </MDBCardText>
              <MDBBtn href="#">Create</MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}