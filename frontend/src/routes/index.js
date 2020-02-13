import React, { Component } from "react";
import { Router, Route, Switch } from "react-router-dom";

import { history } from "../index";

import MainPage from "../components/pages/Index";
import SignInPage from "../components/pages/SignIn";
import SignUp from "../components/pages/SignUp";
import ConfirmEmail from "../components/pages/ConfirmEmail";
import MyUsers from "../components/pages/MyUsers";
import ShowUserToDos from "../components/pages/ShowUserToDos";

export default class AppRouter extends Component{
  render() {
    return (
      <Router history={history}>
        <div>
          <Switch>
            <Route exact path={'/signup'} component={SignUp}/>
            <Route exact path={'/confirm_email/:key'} component={ConfirmEmail}/>
            <Route exact path={'/login'} component={SignInPage}/>
            <Route exact path={'/my_users'} component={MyUsers}/>
            <Route exact path={'/my_users/:user_id'} component={ShowUserToDos}/>
            <Route exact path={''} component={MainPage}/>
          </Switch>
        </div>
      </Router>
    )
  }
}