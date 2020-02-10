import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import '../css/style_LP.scss';

import Header from './Header';
import Footer from './Footer';

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
        { !this.props.user && (
          <div class="topbar-contents">
            {/*
              <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
            */}
            <a href="#" class="logo-link"><img class="logo" src={require('../img/Torimo_new.png')} /></a>
            <div class="login">
              <a class="register" href="/register">Get Started</a>
              <a class="signin" href="/login">Sign in</a>
            </div>
          </div>
        )}
        { this.props.user && (
          <div class="topbar-contents">
            {/*
              <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
            */}
            <a href="#" class="logo-link"><img class="logo" src={require('../img/Torimo_new.png')} /></a>
            <div class="login">
              <a class="signin" href="/myprofile">My Page</a>
            </div>
          </div>
        )}

          <div class="mobile-topbar-contents">
            <a href="#"><img class="logo-mobile" src={require('../img/Torimo_new.png')} /></a>
            <a href="/register" class="mobile-signin" onClick="ga('send', 'event', 'link', 'click', 'register3')">
              <p class="mobile-header-link">Register</p>
            </a>
            <a href="/login" class="mobile-signin" onClick="ga('send', 'event', 'link', 'click', 'signin')">
              <p class="mobile-header-link">Sign in</p>
            </a>
          </div>

          <div class="catchcopy clearfix">
            <img class="lpimage" src={require('../img/top4.png')}/>
            <img class="lpimage-mobile" src={require('../img/lp-mobile.png')}/>
              <div class="catch">
                <h1 class="site-title">Use the extra space in your suitcase to earn money.</h1>
              </div>
              <div class="catch2">
                <h1 class="site-title2">Shop abroad without leaving your couch.</h1>
              </div>
          </div>
        </header>

        <div class="menu">
          <a href="/how-it-works">How It Works</a>
          <a href="/trips">See Trips</a>
          <a href="/blog/">Blog</a>
          <a href="/about">About Us</a>
          <a href="/contact-us">Contact Us</a>
        </div>

        <section class="how">
          <p class="how-intro">Torimo matches shoppers searching for <span class="bold">locally unavailable products</span> <br/> with travelers looking to earn some <span class="bold">cash while traveling.</span></p>
          <h2 class="heading-h">How It Works</h2>
          <img class="lp-how" src={require('../img/how-steps.png')}/>
          <div class="how-container">
            <p class="how-1">Requester requests item<br/> & pays</p>
            <p class="how-2">Traveler purchases item</p>
            <p class="how-3">Requester meets Traveler<br/> & receives item</p>
            <p class="how-4">Traveler gets paid!</p>
          </div>
          <div class="how-container-mobile">
          <img class="lp-how-mobile" src={require('../img/how-mobile.png')}/>
          <div class="how-description">
            <p class="how-1">Requester requests item<br/> & pays</p>
            <p class="how-2">Traveler purchases item</p>
            <p class="how-3">Requester meets Traveler<br/> & receives item</p>
            <p class="how-4">Traveler gets paid!</p>
          </div>
          </div>
          <a class="button" href="/register" onClick="ga(‘send’, ‘event’, ‘link’, ‘click’,'register2'">Get Started</a>
        </section>

       <section class="why-use">
        <h2 class="heading w">Past Transactions</h2>
        <div class="case-one">
          <div class="lisa-pic"><img class="lisa" src={require('../img/traveler1.png')}/></div>
          <p class="lisa-total">Traveler Lisa <span class="italic bold">earned $30</span><br/>from her Japan Trip in 2 transactions:</p>
        </div>
        <div class="use-case">
          <div class="item-image">
            <p class="item-title">Face serum from Japan</p>
            <img src={require('../img/sk2.png')}/>
          </div>
          <div class="saving-container">
            <div class="saving">
              <div class="user-pic"><img src={require('../img/requester1.png')}/></div>
              <p>Requester</p>
              <p class="amount">Saved $20</p>
            </div>
            <div class="saving">
              <div class="user-pic"><img src={require('../img/traveler1.png')}/></div>
              <p>Traveler</p>
              <p class="amount">Earned $20</p>
            </div>
          </div>
          {/*<p class="use-disclaimer">*Simulated data</p>*/}
        </div>
        <div class="use-case">
        <div class="item-image">
          <p class="item-title">Bento box from Japan</p>
          <img src={require('../img/bento.png')}/>
        </div>
        <div class="saving-container">
          <div class="saving">
            <div class="user-pic"><img src={require('../img/requester2.png')}/></div>
            <p>Requester</p>
            <p class="amount">Saved $15</p>
          </div>
          <div class="saving">
            <div class="user-pic"><img src={require('../img/traveler1.png')}/></div>
            <p>Traveler</p>
            <p class="amount">Earned $10</p>
          </div>
        </div>
        {/*<p class="use-disclaimer">*Simulated data</p>*/}
        </div>
        <a class="button" href="/register" onClick="ga(‘send’, ‘event’, ‘link’, ‘click’,'register2'">Get Started</a>


        <section class="snapwidget">
        <script src="https://snapwidget.com/js/snapwidget.js"></script>
        <link rel="stylesheet" href="https://snapwidget.com/stylesheets/snapwidget-lightbox.css" />
        <script src="https://snapwidget.com/js/snapwidget-lightbox.js"></script>
        <iframe src="https://snapwidget.com/embed/772909" class="snapwidget-widget"
        allowtransparency="true" frameborder="0" scrolling="no" style={{border:'none', overflow:'hidden',  width:'100%', height:'300px'}}>
        </iframe>
        </section>

       </section>

       <section class="service">
       <h2 class="heading s">Our Services</h2>
       <div class="wrapper-service">
       <div class="service-box">
       <img class="service-icon" src={require('../img/shopping-cart.png')} />
       <div class="service-title">Propose<br/>Price of Item</div>
       <p class="service-text">Requester proposes price of item(s). If Traveler agrees to the price, Requester pays for the item(s) + a negotiated commission to Traveler.</p>
       </div>
       <div class="service-box">
       <img class="service-icon" src={require('../img/globe.png')} />
       <div class="service-title">Access to<br/>Unique Item</div>
       <p class="service-text">Requester can reach ANY items that are not available locally or online.</p>
       </div>
       <div class="service-box">
       <img class="service-icon" src={require('../img/traveler.png')} />
       <div class="service-title">Travel &<br/>Make Money</div>
       <p class="service-text">Traveler can subsidize their costly international trips by sparing just a corner of their suitcase.</p>
       </div>
       <div class="service-box">
       <img class="service-icon" src={require('../img/pay.png')} />
       <div class="service-title">Easy and Safe<br/>Transaction</div>
       <p class="service-text">No cumbersome negotiation. Torimo will release the payment upon the delivery of the item(s).</p>
       </div>
       </div>
       </section>


      <Footer />

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
