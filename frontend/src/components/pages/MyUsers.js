import React from "react";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBTable,
  MDBTableHead,
  MDBTableBody
} from "mdbreact";

import api from '../../api/index';
import Redirect from "react-router-dom/es/Redirect";
import UserProfile from "../cards/UserProfile";


export default () => {
  const [users, setUsers] = React.useState([]);
  const [redirectToMainPage, setRedirectToMainPage] = React.useState(false);
  const [userIdToRedirect, setUserIdToRedirect] = React.useState(null);

  const columns = [
    {
      label: 'Full name',
      field: 'full_name',
    },
    {
      label: 'Email',
      field: 'email'
    },
    {
      label: '',
      field: 'showToDos'
    }
  ];

  const prepareUsersToRows = (users) => {
    const rows = [];
    for (const user of users){
      rows.push(
        {
          full_name: user.name + ' ' + user.surname,
          email: user.email,
          showToDos: <MDBBtn size={'sm'} onClick={() => setUserIdToRedirect(user.id)}>Show ToDos</MDBBtn>
        }
      )
    }

    return rows
  };

  const renderRedirectToMainPage = () => {
    if (redirectToMainPage){
      return <Redirect to={''}/>
    }
  };

  const renderRedirectToUserToDos = () => {
    if (userIdToRedirect){
      return <Redirect to={`my_users/${userIdToRedirect}`}/>
    }
  };

  React.useEffect(() => {
    api.getAllUsers()
      .then(response => {
        const userRows = prepareUsersToRows(response.data);
        setUsers(userRows);
      })
  }, []);

  return (
    <MDBContainer className={'mt-4'}>
      {renderRedirectToMainPage()}
      {renderRedirectToUserToDos()}
      <MDBRow>
        <MDBCol md={8}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>
                My users
                <MDBBtn size={'sm'} className={'ml-2'} onClick={() => {setRedirectToMainPage(true)}}>Main page </MDBBtn>
              </MDBCardTitle>
              <MDBTable btn fixed bordered>
                <MDBTableHead columns={columns}/>
                <MDBTableBody rows={users} />
              </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md={4} >
          <MDBRow>
            <UserProfile/>
          </MDBRow>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
    )
}
