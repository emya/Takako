import React, { Component } from 'react';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'
import Header from './Header'
import Footer from './Footer'

library.add(faIgloo)

class HowItWorks extends Component {

  render() {
    return (
<div>
   <Header />
   <div class="menu">
     <a href="#">Request Item</a>
     <a href="#">About Us</a>
     <a href="/how-it-works">How it Works</a>
     <a href="#">FAQ</a>
     <a href="#">Contact</a>
   </div>
   <h2>How It Works</h2>
   <div class="wrapper-clearfix">
     <div class="wrapper-clearfix howto">
       <div class="how-to-requester">
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> search for Traveler by trip destinations and send an item request</p></div>
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> pay item price + transaction fee + commission to Traveler<a href="/how-it-works#whatscommision"><span class='suptext'>(?)</span></a></p><p>Dipity will release your payment only when your item is received.</p></div>
        <div class="how-box third"><p class="how-heading"><span class="requester">Requester</span> accept meetup request or suggest other meetup options</p><p>If you cannot agree on the meetup location/time within 3 days, please notify Dipity.</p></div>
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> confirm item receipt</p><p>If the item is not as requested or damaged, report Dipity for a full refund.</p></div>
       </div>
       <div class="how-to-arrow">
        <div class="arrow-box"><p>2 days</p></div>
        <div class="triangle"></div>
        <div class="arrow-box"><p>2 days</p></div>
        <div class="triangle"></div>
        <div class="arrow-box"></div>
        <div class="triangle"></div>
        <div class="arrow-box"><p>3 days</p></div>
        <div class="triangle"></div>
        <div class="arrow-box meetup"><p>Meetup Period<a href="/how-it-works#whatsmeetupperiod"><span class='suptext'>(?)</span></a></p></div>
        <div class="triangle meetup"></div>
        <div class="arrow-box"><p>1 day</p></div>
        <div class="triangle"></div>
       </div>
       <div class="how-to-traveler">
        <div class="how-box traveler">
          <p class="how-heading"><span class="traveler-name">Traveler</span> accept, decline, or clarify the request</p>
          <p>There is no limit to how many times Traveler can clarify.</p>
        </div>
        <div class="how-box traveler"><p class="how-heading">Upon purchase of the item, <span class="traveler-name">Traveler</span> notify and send Requester a meetup request</p><p>Choose 3 meetup options to take place during pre-specified meetup period.<br />If Traveler cannot purchase for any reason, this offer would be cancelled and Dipity refunds Requester.</p></div>
        <div class="how-box traveler last"><p class="how-heading"><span class="traveler-name">Traveler</span> gets paid!</p><p>Payment is released 1 day after the item receipt.</p></div>
       </div>
       </div>

       <h2>Important Notes</h2>

     <div class="how-detail">
      <h3 id="whatsmeetupperiod">Meetup Period</h3>
      <ul>
        <li>Pre-determined based on Traveler's residence and trip schedule.</li>
        <li>If Traveler live in NYC and are traveling overseas, meetup takes place within 1 week after returning to NYC.</li>
        <li>If Traveler live overseas and traveling to NYC, meetup takes place during their stay in NYC.</li>
      </ul>
      <h3 id="whatscommision">Commision to Traveler</h3>
      <ul>
        <li>Commision to Traveler is minimum of $10 and varries depending on size, weight and difficulty to purchase the item.</li>
        <li>Transaction fee is 5% of the item price.</li>
      </ul>
      <h3>Cancelation</h3>
      <ul>
        <li>Requester can cancel request until Traveler accepts the offer.</li>
        <li>Traveler can cancel request anytime and this would not hurt their rating.</li>
      </ul>
      <h3>Deadline/Cutoff</h3>
      <ul>
        <li>Item request cancels automatically if no action was taken by Traveler sooner of 1) 2 days after it was made or 2) trip begin date.</li>
        <li>Payment needs to be made within 2 days after the request was accepted, or item request automatically cancels.</li>
        <li>Notification of the purchase and meetup request need to be made 3 days before the meetup period. If you cannot agree on the meetup location/time before the meetup period, please notify Dipity.</li>
        <li>Confirmation of item receipt needs to be made where Traveler is present during meetup.</li>
      </ul>
      <h3>Damaged or Wrong Item</h3>
      <ul>
        <li>In case of any wrong or damaged item, Traveler will be accountable, and Requester will be refunded in full.</li>
        <li>In order for the item to be determined as a "wrong item", both item image and URL need to be included in the original request form.</li>
        <li>Any personal reasons such as an item being different from a picture, or a size issue, payments are not refundable.</li>
      </ul>
    </div>


    <Footer />
  </div>
</div>

    )
  }
}

export default HowItWorks;
