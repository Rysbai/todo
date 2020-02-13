import React from "react";
import {
  MDBTypography,
} from "mdbreact";


import api from '../../api/index';
import Redirect from "react-router-dom/es/Redirect";


export default (props) => {
  const [confirmSuccess, setConfirmSuccess] = React.useState(false);
  const [error, setError] = React.useState();

  React.useEffect(() => {
    api.confirmEmail(props.match.params.key)
      .then(response => {
        setConfirmSuccess(true)
      })
      .catch(() => {
        setError('Incorrect Key!')
      })
  }, []);

  const renderRedirect = () => {
    if (confirmSuccess){
      return <Redirect to={''}/>
    }
  };

  const renderError = () => {
    if (error){
      return <MDBTypography colorText="red" className={'h3'}>{error}</MDBTypography>

    }
  };

  return (
    <div>
      {renderRedirect()}
      {renderError()}
    </div>
  )
}


