import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import '../css/style_LP.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDollarSign, faLightbulb, faGift } from '@fortawesome/free-solid-svg-icons'


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
          <div class="topbar-contents">
            {/*
              <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
            */}
            <a href="#"><img class="logo" src={require('../img/torimo-logo.png')} /></a>
            <div class="login">
              <a class="register" href="/register">Get Started</a>
              <a class="signin" href="/login">Sign in</a>
              <a class="signin" onClick={this.props.logout}>Logout</a>
            </div>
          </div>

          <div class="mobile-topbar-contents">
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
            <a href="#"><img class="logo" src={require('../img/Souvenir_logo.png')} /></a>
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
          </div>

          <div class="catchcopy clearfix">
            <img class="lpimage" src={require('../img/top4.png')}/>
            <div class="content">
              <div class="catch">
                <h1 class="site-title">Use the extra space in your suitcase to earn money.</h1>
              </div>
              <div class="catch2">
                <h1 class="site-title2">Shop abroad without leaving your couch.</h1>
              </div>
            </div>
          </div>
          </header>

          <div class="menu">
          <a href="/how-it-works">How It Works</a>
            <a href="#">Find Traveler</a>
            <a href="#">About Us</a>
            <a href="#">Contact Us</a>
          </div>

        <section class="how">
          <h2 class="heading-h">How It Works</h2>
          {/*
          <div class="how-wrapper">
            <div class="how-box">
              <div class="how-title">Request Item</div>
              <div class="how-description">Find someone near you, who are traveling to where you want your item from.
              </div>
            </div>
            <div class="how-box">
              <div class="how-title">Let Traveler Get It</div>
              <div class="how-description">The traveler can get your item at an agreed price.
              </div>
            </div>
            <div class="how-box">
              <div class="how-title">Receive It</div>
              <div class="how-description">You can choose your item to be shipped domestically or handed to you to minimize cost.
              </div>
            </div>
          </div>
          */}
          <p class="how-intro">Torimo matches NY-based users who want to purchase item from abroad (“Requester”)<br/>with someone traveling to or from the destination where the items can be purchased (“Traveler”).
</p>
          <img class="lp-how" src={require('../img/how-steps.png')}/>
          <div class="how-container">
            <p class="how-1">Requester requests item & pays</p>
            <p class="how-2">Traveler purchases item</p>
            <p class="how-3">Requester meets Traveler & receives item</p>
            <p class="how-4">Traveler gets paid!</p>
          </div>
          <a class="button" href="#">Get Started</a>
        </section>

        <section class="service">
        <h2 class="heading s">Our Services</h2>
        <div class="wrapper-service">
        <div class="service-box">
        <img class="service-icon" src={require('../img/shopping-cart.png')} />
        <div class="service-title">Propose<br/>Price of Item</div>
        <p class="service-text">Requester proposes item(s) price. If Traveler agrees to the price, Requester pays for the item(s) + a negotiated commission to Traveler.</p>
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
        <p class="service-text">No cumbersome negotiation. Torimo will release the payment when the item is delivered.</p>
        </div>
        </div>
        </section>

       <section class="why-use">
        <h2 class="heading w">Why Use Torimo?</h2>
        <div class="use-case">
          <div class="item-image">
            <p class="item-title">Cosmetics from Japan</p>
            <img src={require('../img/cosme.png')}/>
          </div>
          <div class="saving-container">
            <div class="saving">
              <div class="user-pic"><img src={require('../img/requester1.png')}/></div>
              <p>Requester</p>
              <p class="amount">Save $50<span class="ast">*</span></p>
            </div>
            <div class="saving">
              <div class="user-pic"><img src={require('../img/traveler1.png')}/></div>
              <p>Traveler</p>
              <p class="amount">Earn $30<span class="ast">*</span></p>
            </div>
          </div>
          <p class="use-disclaimer">*Simulated data</p>
        </div>
        <div class="use-case">
        <div class="item-image">
          <p class="item-title">Select Clothing from South Korea</p>
          <img src={require('../img/clothes.png')}/>
        </div>
        <div class="saving-container">
          <div class="saving">
            <div class="user-pic"><img src={require('../img/requester2.png')}/></div>
            <p>Requester</p>
            <p class="amount s">Item Unavailable in NY</p>
          </div>
          <div class="saving">
            <div class="user-pic"><img src={require('../img/traveler2.png')}/></div>
            <p>Traveler</p>
            <p class="amount">Earn $45<span class="ast">*</span></p>
          </div>
        </div>
        <p class="use-disclaimer">*Simulated data</p>
        </div>
        <a class="button" href="#">Get Started</a>
       </section>

      <footer>
        <div class="footer-item">
          <ul>
            <li>About Us</li>
            <li>Terms of Services</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        <div class="footer-item">
          <ul>
            <li>How It Works</li>
            <li>FAQ</li>
            <li>Contact Us</li>
          </ul>
        </div>
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
