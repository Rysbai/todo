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
  MDBTableBody, MDBIcon
} from "mdbreact";

import api from '../../api/index';
import Redirect from "react-router-dom/es/Redirect";
import UserProfile from "../cards/UserProfile";


export default (props) => {
  const [toDos, setToDos] = React.useState([]);
  const [redirectToMyUsers, setRedirectToMyUsers] = React.useState(false);

  const columns = [
    {
      label: 'Title',
      field: 'title',
    },
    {
      label: 'Start',
      field: 'startAt'
    },
    {
      label: 'End',
      field: 'finishAt'
    },
    {
      label: 'Done',
      field: 'isDone'
    },
  ];

  const getToDoRows = (toDos) => {
    const rows = [];
    for (const toDo of toDos){
      const startDate = new Date(toDo.start_at);
      const finishDate = new Date(toDo.finish_at);
      rows.push({
        title: toDo.name,
        startAt: `${startDate.getDate()}-${startDate.getMonth() + 1}-${startDate.getFullYear()} and ${startDate.getHours()}:${startDate.getMinutes()}`,
        finishAt: `${finishDate.getDate()}-${finishDate.getMonth() + 1}-${finishDate.getFullYear()} and ${finishDate.getHours()}:${finishDate.getMinutes()}`,
        isDone: toDo.is_done ?
          <MDBIcon icon={'check-circle'} size={'sm'} className={'green-text pr-3'}/>
          :
          <MDBIcon icon={'times-circle'} size={'sm'} className={'red-text pr-3'}/>
      })
    }

    return rows
  };

  const renderRedirectToMyUsers = () => {
    if (redirectToMyUsers){
      return <Redirect to={'/my_users'}/>
    }
  };

  React.useEffect(() => {
    api.getUserToDos(props.match.params.user_id)
      .then(response => {
        const toDoRows = getToDoRows(response.data);
        setToDos(toDoRows);
      })
  });

  return (
    <MDBContainer className={'mt-4'}>
      {renderRedirectToMyUsers()}
      <MDBRow>
        <MDBCol md={8}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>
                Users ToDo List
                <MDBBtn size={'sm'} className={'ml-2'} onClick={() => {setRedirectToMyUsers(true)}}>My users </MDBBtn>
              </MDBCardTitle>
              <MDBTable btn fixed bordered>
                <MDBTableHead columns={columns}/>
                <MDBTableBody rows={toDos} />
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