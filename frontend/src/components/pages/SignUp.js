import React from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow, MDBTypography} from "mdbreact";
import {Link, Redirect} from "react-router-dom";

import api from '../../api/index';


export default () => {
  const [name, setName] = React.useState();
  const [surname, setSurname] = React.useState();
  const [username, setUsername] = React.useState();
  const [email, setEmail] = React.useState();
  const [password, setPassword] = React.useState();

  const [signUpSuccess, setSignUpSuccess] = React.useState(false);
  const [error, setError] = React.useState();

  const renderRedirectToSuccessPage = () => {
    if (signUpSuccess){
      return (<Redirect to={''}/>)
    }
  };

  const renderError = () => {
    if (error){
      return <MDBTypography colorText="red">{error}</MDBTypography>
    }
  };

  const handleRegister = () => {
    api.signup(username, email, name, surname, password)
      .then(response => {
        setSignUpSuccess(true);

        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(error => {
        setError(error)
      })
  };

  return (
    <MDBContainer>
      {renderRedirectToSuccessPage()}
      <MDBRow className={'d-flex justify-content-center'}>
        <MDBCol md="6" className={"mt-5"}>
          <form>
            <p className="h5 text-center mb-4">Sign up</p>
            <div className="grey-text">
              <MDBInput
                label="Your username"
                group
                type="text"
                validate error="wrong"
                success="right"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
              <MDBInput
                label="Your email"
                group type="email"
                validate error="wrong"
                success="right"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
              <MDBInput
                label="Your name"
                group type="text"
                validate error="wrong"
                success="right"
                value={name}
                onChange={e => setName(e.target.value)}
              />
              <MDBInput
                label="Your surname"
                group type="text"
                validate error="wrong"
                success="right"
                value={surname}
                onChange={e => setSurname(e.target.value)}
              />
              <MDBInput
                label="Your password" group
                type="password" validate
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {renderError()}
            <div className="text-center">
              <MDBBtn
                color="primary"
                onClick={() => handleRegister()}
              >
                Register
              </MDBBtn>
              <Link to={'/login'} ><p className="text-center mt-3">Have an account? Click here to login.</p></Link>
            </div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}