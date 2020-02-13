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
  MDBTypography,
  MDBTable,
  MDBTableHead,
  MDBTableBody, MDBBtnGroup, MDBModal, MDBModalHeader, MDBModalBody, MDBModalFooter
} from "mdbreact";
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';

import api from '../../api/index';
import Redirect from "react-router-dom/es/Redirect";
import UserProfile from "../cards/UserProfile";


export default () => {
  const [user, setUser] = React.useState();
  const [redirectToLogin, setRedirectToLogin] = React.useState(false);
  const [redirectToMyUsers, setRedirectToMyUsers] = React.useState(false);
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const [newTodoDescription, setNewTodoDescription] = React.useState('');

  const [newTodoStartAt, setNewTodoStartTime] = React.useState('');
  const [newTodoFinishAt, setNewTodoFinishAt] = React.useState('');

  const [todos, setTodos] = React.useState();
  const [showAll, setShowAll] = React.useState(false);
  const [todoInfoModal, setModal] = React.useState(false);
  const [modalToDo, setModalToDo] = React.useState();
  const toggle = () => { setModal(!todoInfoModal) };

  const renderRedirectToLogin = () => {
    if (redirectToLogin){
      return <Redirect to={'login'}/>
    }
  };

  const renderRedirectToMyUsers = () => {
    if (redirectToMyUsers){
      return <Redirect to={'/my_users'}/>
    }
  };

  const ToDo = (todo) => {
    const setIsDone = () => {
      api.setToDoStatus(todo, true)
        .then(() => updateTodoList())
    };
    const setIsUnDone = () => {
      api.setToDoStatus(todo, false)
        .then(() => updateTodoList())
    };
    return {
      'title': todo.name,
      'isDone': (
        <MDBBtnGroup>
          {!todo.is_done ?
            <MDBBtn color="green" size="sm" onClick={setIsDone}>Done</MDBBtn>
            :
            <MDBBtn color="blue-grey" size="sm" onClick={setIsUnDone}>UnDone</MDBBtn>
          }
          <MDBBtn
            color="blue"
            size="sm"
            onClick={() => {
              setModalToDo(todo);
              setModal(true);
            }}
          >Info
          </MDBBtn>
        </MDBBtnGroup>
      )
    }
  };

  const updateTodoList = () => {
    api.getToDos(!showAll)
      .then(response => {
        const rows = [];
        for (const todo of response.data){
          rows.push(ToDo(todo))
        }
        setTodos(rows)
      })
  };

  React.useEffect(() => {
    api.getCurrentUser()
      .then((response) => {
        setUser(response.data);
        localStorage.setItem('user', JSON.stringify(response.data));
      })
      .catch(error => {
        setRedirectToLogin(true)
      });
    updateTodoList()
  }, [showAll]);

  const columns = [
    {
      label: 'Title',
      field: 'title',
    },
    {
      label: 'Done',
      field: 'isDone'
    }
  ];

  const createTodo = () => {
    const startDateTime = moment(newTodoStartAt).format('YYYY-MM-DDThh:mm');
    const finishDateTime = moment(newTodoFinishAt).format('YYYY-MM-DDThh:mm');

    const todo = {
      name: newTodoTitle,
      description: newTodoDescription,
      start_at: startDateTime,
      finish_at: finishDateTime,
      is_done: false
    };

    api.createTodo(todo)
      .then(() => {
        updateTodoList();

        setNewTodoTitle('');
        setNewTodoDescription('');
        setNewTodoStartTime('');
        setNewTodoFinishAt('');
      })
      .catch((error) => console.log(error))
  };

  const renderCreateTodoCard = () => {
    return (
      <MDBCard style={{ width: "22rem" }}>
      <MDBCardBody>
        <MDBCardTitle>Create ToDo</MDBCardTitle>
        <MDBCardText>
          <MDBInput 
            label="Title" 
            group type="text" 
            validate error="wrong"
            success="right" 
            value={newTodoTitle}
            onChange={(event) => setNewTodoTitle(event.target.value)}
            />
          <MDBInput 
            label="Short description" 
            group 
            type="textarea" 
            error="wrong"
            success="right"
            value={newTodoDescription}
            onChange={(event) => setNewTodoDescription(event.target.value)}
          />
          <label className={'mr-2'}>Start at</label>
          <DateTimePicker
            onChange={setNewTodoStartTime}
            value={newTodoStartAt}
          />
          <br/>
          <br/>
          <label className={'mr-2'}>End at</label>
          <DateTimePicker
            onChange={setNewTodoFinishAt}
            value={newTodoFinishAt}
          />
        </MDBCardText>
        <MDBBtn size={'sm'} onClick={createTodo}>Create</MDBBtn>
      </MDBCardBody>
    </MDBCard>
    )
  };

  return (
    <MDBContainer className={'mt-4'}>
      {renderRedirectToLogin()}
      {renderRedirectToMyUsers()}
      {!user || !user.is_email_confirmed ?
        <MDBCard>
          <MDBCardBody>
            <MDBTypography
              colorText='blue'
              className={'h3'}
            >
              You are registered successfully. Check your email, confirm and reload page.
            </MDBTypography>
          </MDBCardBody>
        </MDBCard>

        :

        <MDBRow>
          <MDBModal isOpen={todoInfoModal} toggle={toggle}>
            <MDBModalHeader toggle={toggle}>ToDo Info</MDBModalHeader>
            <MDBModalBody>
              <MDBTypography>Title: {modalToDo ? modalToDo.name : ''}</MDBTypography>
              <MDBTypography>Description: {modalToDo ? modalToDo.description : ''}</MDBTypography>
              <MDBTypography>Start at: {modalToDo ? modalToDo.start_at : ''}</MDBTypography>
              <MDBTypography>End at: {modalToDo ? modalToDo.finish_at : ''}</MDBTypography>
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={toggle}>Close</MDBBtn>
            </MDBModalFooter>
          </MDBModal>


          <MDBCol md={8}>
            <MDBCard>
              <MDBCardBody>
                <MDBCardTitle>
                  ToDo List
                  {!showAll ?
                    <MDBBtn
                      size={'sm'}
                      className={'ml-2'}
                      onClick={() => {
                        setShowAll(true);
                      }}
                    >
                      Show All
                    </MDBBtn>
                    :
                    <MDBBtn
                      size={'sm'}
                      className={'ml-2'}
                      onClick={() => {
                        setShowAll(false);
                      }}
                    >
                      Show Actuals
                    </MDBBtn>
                  }
                  {user.is_admin ? <MDBBtn size={'sm'} onClick={() => setRedirectToMyUsers(true)}>Show My Users</MDBBtn> : ''}
                </MDBCardTitle>
                <MDBTable btn fixed bordered>
                  <MDBTableHead columns={columns}/>
                  <MDBTableBody rows={todos} />
                </MDBTable>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md={4} >
            <MDBRow>
              <UserProfile/>
            </MDBRow>
            <MDBRow className={'mt-3'}>
              {renderCreateTodoCard()}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      }

    </MDBContainer>
  )
}
