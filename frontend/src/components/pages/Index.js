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
  MDBTableBody
} from "mdbreact";
import DateTimePicker from 'react-datetime-picker';
import moment from 'moment';

import api from '../../api/index';


export default () => {
  const [newTodoTitle, setNewTodoTitle] = React.useState('');
  const [newTodoDescription, setNewTodoDescription] = React.useState('');

  const [newTodoStartAt, setNewTodoStartTime] = React.useState('');
  const [newTodoFinishAt, setNewTodoFinishAt] = React.useState('');

  const [todos, setTodos] = React.useState();

  const updateTodoList = () => {
    const rows = [];

    api.getActualToDos()
    .then(response => {
      console.log(response.data)
      for (const todo of response.data){
        rows.push(ToDo(todo))
      }
      setTodos(rows)
    })
  }


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

  const ToDo = (todo) => {
    const setIsDone = () => {
      api.setToDoStatus(todo, true)
        .then(() => updateTodoList())
    }
    return {
      'title': todo.name,
      'isDone': <MDBBtn color="purple" size="sm" onClick={setIsDone}>Done</MDBBtn>
    }
  }
  React.useEffect(() => {
    updateTodoList()
  }, [])



  const createTodo = () => {
    const startDateTime = moment(newTodoStartAt).format('YYYY-MM-DDThh:mm');
    const finishDateTime = moment(newTodoFinishAt).format('YYYY-MM-DDThh:mm');
    console.log(startDateTime, finishDateTime);

    const todo = {
      name: newTodoTitle,
      description: newTodoDescription,
      start_at: startDateTime,
      finish_at: finishDateTime,
      is_done: false
    };

    api.createTodo(todo)
      .then(() => {
        updateTodoList()

        setNewTodoTitle('');
        setNewTodoDescription('');
        setNewTodoStartTime('');
        setNewTodoFinishAt('');
      })
      .catch((error) => console.log(error))
  }

  const renderCreateTodoCard = () => {
    return (
      <MDBCard>
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
        <MDBBtn href="#" onClick={createTodo}>Create</MDBBtn>
      </MDBCardBody>
    </MDBCard>
    )
  }

  return (
    <MDBContainer className={'mt-4'} >
      <MDBRow>
        <MDBCol md={8}>
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>ToDo List</MDBCardTitle>
                <MDBTable btn fixed bordered>
                  <MDBTableHead columns={columns}/>
                  <MDBTableBody rows={todos} />
                </MDBTable>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md={4} className={'sticky-top'}>
          {renderCreateTodoCard()}
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  )
}
