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
      <div class="how-it-works">
           <h2 class>How It Works</h2>
           <h3>To Get Started</h3>
           <p class="to-get-started">First, register from  <a class="details" href="/register">here</a>. Registration is absolutely FREE! <br/><br/>Once you are registered, update your profile from "My Profile".</p>

           <div class="wrapper clearfix">
            <div class="how-it-works-left">
             <h3>...If You Are "Requesting User" Who Wants to Request an Item</h3>
             <div class="step">
               <div class="step-number">1</div>
               <p>Search for a user by "Travel destination" and "Residence City" to find someone who lives near you, and is traveling to the city where you want your item from.</p>
             </div>
             <div class="step">
               <div class="step-number">2</div>
               <p>Once you find a good match, fill out and send a request form with descriptions of the item, a date that you want the item by, and a proposed price <a class="details" href="/how-it-works#proposed-price">*What's Proposed Price?</a></p>
             </div>
             <div class="step">
               <div class="step-number">3</div>
               <p>If the purchasing user approves your request, Souvenir will notify you through an e-mail.</p>
             </div>
             <div class="step">
               <div class="step-number">4</div>
               <p>Make a payment for the proposed price plus 3% transaction fee.  <a class="details" href="/how-it-works#transaction-fee">*What's transaction fee?</a> <br/> Souvenir will release your payment only when your item is received :)</p>
             </div>
             <div class="step">
               <div class="step-number">5</div>
               <p>Wait to receive a notification that the purchasing user purchased your item. Agree to the meet-up details if you chose "meet-up" as the means of delivery.</p>
             </div>
             <div class="step">
               <div class="step-number">6</div>
               <p>Please notify Souvenir once you receive the item. Enjoy!</p>
             </div>
           </div>

           <div class="how-it-works-right">
             <h3>...If You Are "Purchasing User" Who Receives a Request to Buy an Item</h3>
             <div class="step">
               <div class="step-number">1</div>
                 <p>Check the request either from the link on the notification e-mail or on "Transaction Status" page.</p>
               </div>
             <div class="step">
               <div class="step-number">2</div>
               <p>If you are willing to purchase the item for the proposed price by the specified date, click "Accept" in the request form.<br/><a class="details" href="/how-it-works#proposed-price">*What's proposed price?</a> </p>
             </div>
             <div class="step">
               <div class="step-number">3</div>
               <p>The requesting user will make a payment, and Souvenir will notify you for the receipt of the payment through an e-mail.</p>
             </div>
             <div class="step">
               <div class="step-number">4</div>
               <p>Purchase the requested item on your trip. Notify the requesting user with any meet-up details.</p>
             </div>
             <div class="step">
               <div class="step-number">5</div>
               <p>Ship it or meet up with the user before the date specified in the request form.</p>
             </div>
             <div class="step">
               <div class="step-number">6</div>
               <p>Once the item is received by the requesting user, Souvenir will send you the payment.</p>
             </div>
             <div class="step">
               <div class="step-number">7</div>
               <p>Congraturations! When you want to request an item, your next transaction fee will be waived. <a class="details" href="/how-it-works#proposed-price">*What's transaction fee?</a> </p>
             </div>
           </div>
          </div>

          <h3>Transaction Fee</h3>
          <p class="to-get-started">For each request, the requesting user will be charged 3% transaction fee.
          <br/><br/>This transaction fee will be waived one-time if you have completed someone's request previously.</p>
          <h3 id="proposed-price">Proposed Price</h3>
          <p class="to-get-started">
            The proposed price should include a price of an item and commission to the purchasing user.
            <br/>Attaching an item URL will give a better idea for both users!
            <br/><br/>The requesting user will be paying this proposed price including the commission, PLUS 3% transaction fee.
            <br/><br/>The full proposed price will be paid to the purchasing user when the transaction is complete.
          </p>
          <h3>Item Delivery</h3>
          <p class="to-get-started">
            An item can be delivered either by shipping or by meet-up. The requesting user will choose either option when sending a request.
            <br/><br/> Contact information necessary for the delivery will be provided to each party once the request was approved by the purchasing user.
          </p>
          <h3>Returns</h3>
          <p class="to-get-started">
            The purchasing user will be accountable for any wrong or damaged item, and the requesting user will be refunded in full.
            <br/><br/>In order for the item to be a "wrong item", the requesting user should include an item ID/SKU and item URL in a request form.
            <br/><br/><br/>Any personal reasons such as an item being different from a picture, or a size issue, payments are not refundable.
          </p>
    </div>
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
