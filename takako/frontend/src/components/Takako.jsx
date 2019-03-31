import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
//import '../css/style_LP.scss';

class Takako extends Component {
  /*
  componentDidMount() {
    this.props.fetchNotes();
  }

  state = {
    text: "",
    updateNoteId: null,
  }


  resetForm = () => {
    this.setState({text: "", updateNoteId: null});
  }

  selectForEdit = (id) => {
    let note = this.props.notes[id];
    this.setState({text: note.text, updateNoteId: id});
  }

  submitNote = (e) => {
    e.preventDefault();
    if (this.state.updateNoteId === null) {
      this.props.addNote(this.state.text).then(this.resetForm)
    } else {
      this.props.updateNote(this.state.updateNoteId, this.state.text).then(this.resetForm);
    }
    //this.resetForm();
  }
  */

  render() {
    return (
      <body>
        <header class="header">
          <div class="topbar">
            <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
            <a class="register" href="#">Get Started</a>
            <a class="signin" href="#">Sign in</a>
          </div>
          <div class="catchcopy clearfix">
            <div class="content">
              <h1 class="site-title">Find Someone who Can Bring Back Whatever You Want.
              </h1>
              <p class="site-description">Request world traveler to buy and bring back whatever from wherever, just like how you ask your friend.
              </p>
            </div>
            <image class="lpimage" src="img/woman-3373637_960_720.jpg"/>
          </div>
          </header>

        <section class="how">
          <h2 class="heading">How It Works</h2>
          <div class="how-wrapper">
            <div class="how-box">
              <div class="how-title">Request Item</div>
              <div class="how-description">Find someone near you, who are traveling for where you want an item from.
              </div>
            </div>
            <div class="how-box">
              <div class="how-title">Let Traveler Get It</div>
              <div class="how-description">Requested traveler can get your item at agreed price.
              </div>
            </div>
            <div class="how-box">
              <div class="how-title">Receive It</div>
              <div class="how-description">your item will be shipped domestically or handed in person to minimize cost!
              </div>
            </div>
          </div>
        </section>

        <section class="use">
          <h2 class="heading">Best for Someone Who Are ...</h2>
          <div class="wrapper-shopper">
            <div class="use-box">
              <div class="person-title">"Shopper"</div>
              <p class="shopper-description">Looking for Item Overseas</p>
            </div>
              <div class="use-box clearfix">
                  <div class="use-example">“I want to buy duty-free cosmetics”
                  <img class="use-image" src="img/woman2.jpg"/>
                  </div>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“I Can’t find my favorite brand from home”
                <img class="use-image" src="img/woman2.jpg"/>
              </div>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“TBU”
                <img class="use-image" src="img/woman2.jpg"/>
              </div>
            </div>
          </div>
          <div class="wrapper-shopper">
            <div class="use-box">
              <div class="person-title">"Traveller"</div>
              <p class="shopper-description">Looking to Make Money</p>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“I found rare item I could sell”
                <img class="use-image" src="img/woman.jpg"/>
              </div>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">"I wanna make money to bump up trip budget”
                <img class="use-image" src="img/woman.jpg"/>
              </div>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“TBU”
                <img class="use-image" src="img/woman.jpg"/>
              </div>
            </div>
          </div>
          <a class="button" href="#">GET STARTED</a>
        </section>

        <section class="service">
          <h2 class="heading s">Our Services</h2>
          <div class="wrapper-service">
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o"></i>
              <div class="service-title">Cheaper Shopping</div>
              <p class="service-text">Just Pay agreed price. No excessive premium or international shipping!</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o"></i>
              <div class="service-title">Easy Selling</div>
              <p class="service-text">Make extra money on your trip without having to find customer on your own.</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o"></i>
              <div class="service-title">Safe Transaction</div>
              <p class="service-text">We keep money until transaction completes, and anonymous shipping is available.</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o"></i>
              <div class="service-title">Free</div>
              <p class="service-text">Free to register or post!</p>
            </div>
          </div>
        </section>

        <section class="latest">
          <h2 class="heading">Latest Requests</h2>
          <a class="request-box">
            <img class="request-img" src="img/makeup.jpg"/>
            <div class="request-title">Kimono<br/>Japan</div>
            <time class="date" datetime="2019-02-14">02.14.2019</time>
          </a>
          <a class="request-box">
            <img class="request-img" src="img/makeup.jpg"/>
            <div class="request-title">Eyeshadow<br/>UK</div>
            <time class="date" datetime="2019-02-15">02.15.2019</time>
          </a>
          <a class="request-box">
            <img class="request-img" src="img/makeup.jpg"/>
            <div class="request-title">Facial Cream<br/>India</div>
            <time class="date" datetime="2019-02-10">02.10.2019</time>
          </a>
          <br/>
          <a class="button" href="#">GET STARTED</a>
        </section>

      <footer>
        <div class="footer"></div>
      </footer>

      </body>
    )
  }
}


const mapStateToProps = state => {
  return {
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    /*
    fetchNotes: () => {
      dispatch(notes.fetchNotes());
    },
    addNote: (text) => {
      return dispatch(notes.addNote(text));
    },
    //addNote: (text) => {
    //  dispatch(notes.addNote(text));
    //},
    updateNote: (id, text) => {
      return dispatch(notes.updateNote(id, text));
      //dispatch(notes.updateNote(id, text));
    },
    deleteNote: (id) => {
      dispatch(notes.deleteNote(id));
    },
    */
    logout: () => dispatch(auth.logout()),
  }
}

//export default Takako;
export default connect(mapStateToProps, mapDispatchToProps)(Takako);
