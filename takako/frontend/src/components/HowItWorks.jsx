import React, { Component } from 'react';
import {connect} from 'react-redux';
import {profile, auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import SideMenu from './SideMenu'

library.add(faIgloo)

class HowItWorks extends Component {

  render() {
    return (
<div>
   <Header />

    <div class="wrapper clearfix">
      <SideMenu />

      <div class="how-it-works">
         <h2>How It Works</h2>
         <h3>...If You Want to Request an Item</h3>
         <div class="step">
           <div class="step-number">1</div>
           <p>On "Search" page, search for a user by "Travel destination" and "Residence City" to find someone who lives near you, and is traveling to the city where you want your item from.</p>
         </div>
         <div class="step">
           <div class="step-number">2</div>
           <p>From that user's "Profile" page, fill out and send a request form with the description of the item and proposed price.</p>
         </div>
         <div class="step">
           <div class="step-number">3</div>
           <p>If the requested user approves your request, Souvenir will notify you through an e-mail.</p>
         </div>
         <div class="step">
           <div class="step-number">4</div>
           <p>Through the link on the e-mail, make a payment for the agreed price. Souvenir will keep your payment until your item is received :)</p>
         </div>
         <div class="step">
           <div class="step-number">5</div>
           <p>Please notify Souvenir once you receive the item. Enjoy!</p>
         </div>

         <h3>...If You Receive a Request</h3>
         <div class="step">
           <div class="step-number">1</div>
             <p>Check the request either from the link on the notification e-mail or on "Transaction Status" page.</p>
           </div>
         <div class="step">
           <div class="step-number">2</div>
           <p>If you are ok with getting the item for the proposed price, click "Accept".</p>
         </div>
         <div class="step">
           <div class="step-number">3</div>
           <p>The requesting user will make a payment, and Souvenir will notify you for the receipt of the payment through an e-mail.</p>
         </div>
         <div class="step">
           <div class="step-number">4</div>
           <p>Buy the requested item on your trip. Ship it or hand it to the user in person once you get back from the trip.</p>
         </div>
         <div class="step">
           <div class="step-number">5</div>
           <p>Once the item is received by the requesting user, Souvrnir will send you the payment.</p>
         </div>
       </div>
    </div>

    <div class="sidemenu-mobile">
    <ul>
    <li><a href="#">My Profile<span>></span></a></li>
    <li><a href="#">Transaction Status<span>></span></a></li>
    <li><a href="#">Message Box<span>></span></a></li>
    <li><a href="#">Edit Profile<span>></span></a></li>
    <li><a href="#">Edit Account<span>></span></a></li>
    <li><a href="#">Logout<span>></span></a></li>
    <li><a href="#">Help<span>></span></a></li>
    </ul>
    </div>

  <footer>
  FOOTER CONTENTS TO BE DETERMINED
  <FontAwesomeIcon icon="igloo" />
  </footer>
</div>

    )
  }
}

export default HowItWorks;
