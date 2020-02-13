import React from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBInput, MDBRow, MDBTypography} from "mdbreact";
import {Link, Redirect} from "react-router-dom";

import api from '../../api/index';


export default () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  if (token && user){
    return <Redirect to={''}/>
  }

  const [login, setLogin] = React.useState();
  const [password, setPassword] = React.useState();
  const [loginSuccess, setIsLoginSuccess] = React.useState(false);
  const [error, setError] = React.useState(null);

  const renderRedirect = () => {
    if (loginSuccess){
      return <Redirect to={''}/>
    }
  };

  const renderError = () => {
    if (error){
      return <MDBTypography colorText="red">{error}</MDBTypography>
    }
  };

  const submit = () => {
    api.login(login, password)
      .then(response => {
        const token = response.data.token;
        setIsLoginSuccess(true);

        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(response.data));
      })

      .catch(error => {
        if (error.response && error.response.status === 400){
          setError('Password or login is incorrect.')
        } else {
          setError('Something wrong with server!')
        }
      })
    };
  return (
    <MDBContainer>
      {renderRedirect()}
      <MDBRow className={'d-flex justify-content-center'}>
        <MDBCol md="6" className={"mt-5"}>
          <form>
            <p className="h5 text-center mb-4">Sign in</p>
            <div className="grey-text">
              <MDBInput
                label="Type your email"
                icon="envelope"
                group
                type="email"
                validate
                error="wrong"
                success="right"
                value={login}
                onChange={e => setLogin(e.target.value)}
              />
              <MDBInput
                label="Type your password"
                icon="lock"
                group
                type="password"
                validate
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
            </div>
            {renderError()}
            <div className="text-center">
              <MDBBtn onClick={submit}>Login</MDBBtn>
            </div>
          </form>
          <Link to={'/signup'} ><p className="text-center mt-3">Don't have an account? Click here to create one.</p></Link>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
};