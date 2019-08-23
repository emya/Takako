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
   <a href="/how-it-works">How It Works</a>
     <a href="#">Find Traveler</a>
     <a href="#">About Us</a>
     <a href="#">Contact Us</a>
   </div>
   <h2>How It Works</h2>
   <div class="wrapper-clearfix">
     <div class="wrapper-clearfix howto">
       <div class="how-to-requester">
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> searches for Traveler by trip destinations, and sends the item request</p></div>
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> pays for the item(s) + a negotiated commission to Traveler, and transaction fee<a href="/how-it-works#whatscommision"><span class='suptext'>(?)</span></a></p><p>Torimo will release Requester's payment only when the item is received.</p></div>
        <div class="how-box third"><p class="how-heading"><span class="requester">Requester</span> accepts the meetup request or suggests other meetup options</p><p>If Requester & Traveler cannot agree on the meetup location/time within 3 days, please notify Torimo.</p></div>
        <div class="how-box"><p class="how-heading"><span class="requester">Requester</span> confirms the item receipt</p><p>If the item is not as requested or damaged, report Torimo for a full refund.</p></div>
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
          <p class="how-heading"><span class="traveler-name">Traveler</span> accepts, declines, or clarifies the request</p>
          <p>There is no limit to how many times Traveler can clarify.</p>
        </div>
        <div class="how-box traveler"><p class="how-heading">Upon purchase of the item, <span class="traveler-name">Traveler</span> notifies and sends Requester the meetup request</p><p>Traveler chooses 3 meetup options to take place during the pre-specified meetup period.<br />If Traveler cannot purchase for any reason, the offer would be cancelled and Torimo refunds Requester in full.</p></div>
        <div class="how-box traveler last"><p class="how-heading"><span class="traveler-name">Traveler</span> gets paid!</p><p>Payment is released 1 day after the item receipt.</p></div>
       </div>
       </div>

       <h2>Important Notes</h2>

     <div class="how-detail">
      <h3 id="whatsmeetupperiod">Meetup Period</h3>
      <ul>
        <li>It is pre-determined based on Traveler's residence and trip schedule.</li>
        <li>If Traveler lives in NYC and is traveling overseas, the meetup takes place within <strong>1 week</strong> after returning to NYC.</li>
        <li>If Traveler lives overseas and is traveling to NYC, the meetup takes place during their stay in NYC.</li>
      </ul>
      <h3 id="whatscommision">Commission to Traveler</h3>
      <ul>
        <li>Commission to Traveler is a minimum of <strong>$10</strong> and should vary depending on size, weight and difficulty to purchase the item.</li>
        <li>Transaction fee is <strong>5%</strong> of the total transaction excluding Requester's commission.</li>
      </ul>
      <h3>Cancelation</h3>
      <ul>
        <li>Requester can cancel the request up until Traveler accepts the offer.</li>
        <li>Traveler can cancel the request anytime, and it would not hurt their user rating.</li>
      </ul>
      <h3>Deadline/Cutoff</h3>
      <ul>
        <li>Item request cancels automatically if no action was taken by Traveler sooner of 1) <strong>2 days</strong> after it was made or 2) trip begin date.</li>
        <li>Payment needs to be made within <strong>2 days</strong> after the request was accepted, or the item request automatically cancels.</li>
        <li>Notification of the purchase and meetup request needs to be made <strong>3 days</strong> before the meetup period begins. If you cannot agree on the meetup location/time before the meetup period, please notify Torimo.</li>
        <li>Confirmation of the item receipt needs to be made during the meetup where Traveler is present.</li>
      </ul>
      <h3>Damaged or Wrong Item</h3>
      <ul>
        <li>In case of any wrong or damaged item, Traveler will be accountable, and Requester will be refunded in full.</li>
        <li>In order for the item to be determined as a "wrong item", both item images and item URL need to be included in the original request form.</li>
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
