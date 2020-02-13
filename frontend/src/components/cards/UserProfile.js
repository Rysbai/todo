import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardText, MDBCardTitle
} from "mdbreact";

import Redirect from "react-router-dom/es/Redirect";


export default () => {
  const [isLogout, setLogout] = React.useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  const logout = () => {
    setLogout(true);
  };

  const renderLogoutRedirect = () => {
    if (isLogout){
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      return <Redirect to={'/login'}/>
    }
  };


  return (
    <MDBCard style={{ width: "22rem" }}>
      {renderLogoutRedirect()}
      <MDBCardBody>
        <MDBCardTitle>{user.name} {user.surname}</MDBCardTitle>
        <MDBCardText>
          Email: {user.email || 'Empty'}
        </MDBCardText>
        <MDBCardText>
          Username: {user.username}
        </MDBCardText>
        <MDBBtn size='sm' onClick={() => logout()}>Logout</MDBBtn>
      </MDBCardBody>
    </MDBCard>
  )
}