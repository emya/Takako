import React, { Component } from 'react';
//import logo from './logo.svg';
import './App.css';

import {Route, Switch, BrowserRouter, Redirect} from 'react-router-dom';
import Takako from "./components/Takako";
import Note from "./components/Note";
import Test from "./components/Test";
import PurchaseNotification from "./components/PurchaseNotification";
import NewMeetupRequest from "./components/NewMeetupRequest";
import ShareContact from "./components/ShareContact";
import Transaction from "./components/Transaction";
import TransactionHistory from "./components/TransactionHistory";
import Search from "./components/Search";
import MyProfile from "./components/MyProfile";
import Profile from "./components/Profile";
import MessageBox from "./components/MessageBox";
import TravelerProfile from "./components/TravelerProfile";
import NotFound from "./components/NotFound";
import HowItWorks from "./components/HowItWorks";
import ContactUs from "./components/ContactUs";
import AboutUs from "./components/AboutUs";
import RequestForm from "./components/RequestForm";
import ConnectStripe from "./components/ConnectStripe";
import ReceivePayment from "./components/ReceivePayment";

import {auth} from "./actions";
import { Provider, connect } from "react-redux";
import takakoApp from "./reducers";

import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import Login from "./components/Login";
import Register from "./components/Register";
import TermsUse from "./components/TermsUse";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

let store = createStore(takakoApp, applyMiddleware(thunk));


class RootContainerComponent extends Component {

    componentDidMount() {
        this.props.loadUser();
    }

    PrivateRoute = ({component: ChildComponent, ...rest}) => {
        return <Route {...rest} render={props => {
            if (this.props.auth.isLoading) {
                return <em>Loading...</em>;
            } else if (!this.props.auth.isAuthenticated) {
                return <Redirect to="/" />;
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
                    <Route exact path="/" component={Takako} />
                    <Route exact path="/note" component={Note} />
                    <PrivateRoute exact path="/search" component={Search} />
                    <Route exact path="/how-it-works" component={HowItWorks} />
                    <PrivateRoute exact path="/test" component={Test} />
                    <PrivateRoute exact path="/request/form/:userId/:tripId" component={RequestForm} />
                    <PrivateRoute exact path="/notification/purchase/form/:requestId" component={PurchaseNotification} />
                    <PrivateRoute exact path="/request/meetup/form" component={NewMeetupRequest} />
                    <PrivateRoute exact path="/share/contact" component={ShareContact} />
                    <PrivateRoute exact path="/transaction/status" component={Transaction} />
                    <PrivateRoute exact path="/transaction/history/:requestId" component={TransactionHistory} />
                    <PrivateRoute exact path="/myprofile" component={MyProfile} />
                    <PrivateRoute exact path="/profile/:userId" component={Profile} />
                    <PrivateRoute exact path="/message" component={MessageBox} />
                    <PrivateRoute exact path="/traveler/profile" component={TravelerProfile} />
                    <PrivateRoute exact path="/connect/stripe/:requestId" component={ConnectStripe} />
                    <PrivateRoute exact path="/receive/payment" component={ReceivePayment} />

                    <Route exact path="/about" component={AboutUs} />
                    <Route exact path="/contact-us" component={ContactUs} />
                    <Route exact path="/register" component={Register} />
                    <Route exact path="/terms-conditions" component={TermsUse} />
                    <Route exact path="/login" component={Login} />
                    <Route exact path="/reset/password" component={ForgotPassword} />
                    <Route exact path="/reset/password/:token" component={ResetPassword} />
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

