import React, { Component } from 'react';
import '../css/style.scss';

import Header from './Header'
import MobileSideMenu from './MobileSideMenu'
import Footer from './Footer'

class Test extends Component {
  render() {
    return (
    <div>
      <Header />

      <h2>About Us</h2>

<div class="about-us">


<h3>Story Behind Torimo</h3>

<p>Torimo is a web platform which matches NY-based users who want to purchase items from abroad (“Requester”), with someone traveling to or from the destination where the items can be purchased (“Traveler”).
<br/><br/>Our goal is to lower cost for international shopping and make world's best products accessible to everyone, while helping travelers cover their trip cost by making extra money with Torimo.
<br/><br/>Our cofounders met in high school in Japan and moved to the United States around the same time, which was when they started building the app.
<br/>Both living away from their home country, they always felt frustrated how all the imported items are with ridiculous price premiums, not to mention a lot of their favorites brands that are unreachable on existing marketplaces. They wanted to build a platform to solve this problem, and to create a win-win situation where travelers can use just a corner of their suitcases and subsidize their costly international trips.</p>


<h3>Our Team</h3>


<div class="member">
  <img class="us-picture" src={require('../img/Chiaki.png')}/>
  <p><strong>Chiaki Ikuyama</strong></p>
  <p class="member-title">Cofounder & CEO</p>
  <p>Chiaki is originally from Japan and studied in Minnesota, the United States. Prior to Torimo, she worked as a USCPA at Deloitte as well as an investment banker at Citigroup. She is passionate about web design and digital art, fashion and traveling.
  <br/></p>
</div>

<div class="member">
  <img class="us-picture" src={require('../img/Emi.png')}/>
  <p><strong>Emi Ayada</strong></p>
  <p class="member-title">Cofounder & CTO</p>
  <p>Emi completed her MSc degree in Computer Science at the University of Tokyo. She loves bridging machine learning engineering and data science to solve challenging problems. When she is not working, Emi enjoys playing tennis, joins coding competitions, and travels!</p>
  </div>
</div>

      <MobileSideMenu />

      <Footer />
    </div>
    )
  }
}


export default Test;
