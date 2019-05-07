import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import Takako from "./components/Takako";
import Note from "./components/Note";
import Transaction from "./components/Transaction";
import Search from "./components/Search";
import Profile from "./components/Profile";
import MessageBox from "./components/MessageBox";
import TravelerProfile from "./components/TravelerProfile";
import NotFound from "./components/NotFound";
import HowItWorks from "./components/HowItWorks";
import RequestForm from "./components/RequestForm";

import {auth} from "./actions";
import { Provider, connect } from "react-redux";
import takakoApp from "./reducers";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import Login from "./components/Login";
import Register from "./components/Register";

let store = createStore(takakoApp, applyMiddleware(thunk));


class RootContainerComponent extends Component {

    componentDidMount() {
        this.props.loadUser();
    }

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            console.log("this.props", this.props)
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            //} else if (!this.props.auth.isAuthenticated) {
            //    return <Redirect to="/login" />;
            } else {
                return <ChildComponent {...props} />
            }
        }} />
    }

    render() {
        let {PrivateRoute} = this;
        return (
            <BrowserRouter>
                <Switch>
                    <PrivateRoute exact path="/" component={Takako} />
                    <Route exact path="/note" component={Note} />
                    <Route exact path="/search" component={Search} />
                    <Route exact path="/how-it-works" component={HowItWorks} />
                    <Route exact path="/request/form" component={RequestForm} />
                    <Route exact path="/transaction/status" component={Transaction} />
                    <Route exact path="/profile/:userId" component={Profile} />
                    <Route exact path="/message" component={MessageBox} />
                    <Route exact path="/traveler/profile" component={TravelerProfile} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/login" component={Login} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadUser: () => {
            return dispatch(auth.loadUser());
        }
    }
}

let RootContainer = connect(mapStateToProps, mapDispatchToProps)(RootContainerComponent);

export default class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <RootContainer />
            </Provider>
        )
    }
}

