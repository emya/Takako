import React, { Component } from 'react';
import {connect} from 'react-redux';
import {auth} from "../actions";
import {Link, Redirect} from "react-router-dom";
import MediaQuery from 'react-responsive';
import '../css/style_LP.scss';
import Header from './Header'

class Takako extends Component {

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
            <a href="#"><img class="logo" src={require('../img/Souvenir_logo.png')} /></a>
            <div class="login">
              <a class="register" href="/register">Get Started</a>
              <a class="signin" href="/login">Sign in</a>
            </div>
          </div>

          <div class="mobile-topbar-contents">
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
            <a href="#"><img class="logo" src={require('../img/Souvenir_logo.png')} /></a>
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
          </div>

        <div class="menu">
          <a href="/search">Search</a>
          <a href="/how-it-works">How it Works</a>
        </div>


          <div class="catchcopy clearfix">
            <div class="content">
              <h1 class="site-title">Find Someone Who Can Get You an Item That You Can't.
              </h1>
              <p class="site-description">Request nearest traveler to buy and bring back whatever from wherever, just like how you ask your friend.
              </p>
            </div>
            <img class="lpimage" src={require('../img/LP.png')}/>
          </div>
          </header>

        <section class="how">
          <h2 class="heading">How It Works</h2>
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
        </section>

        <section class="use">
          <h2 class="heading">Great for Someone Who..</h2>
          <div class="wrapper-shopper">
            <div class="use-box clearfix">
                <div class="use-example">“I want to buy cosmetics at duty-free prices”
                </div>
                <img class="use-image" src={require('../img/LP.png')}/>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“I can’t find my favorite brand from home”
              </div>
                <img class="use-image" src={require("../img/clothing.png")}/>
            </div>
            <div class="use-box clearfix">
              <div class="use-example">“Imported items are too expensive.”
              </div>
                <img class="use-image" src={require("../img/electronics.png")}/>
            </div>
          </div>

          <a class="button" href="#">GET STARTED</a>
        </section>

        <section class="service">
          <h2 class="heading s">Our Services</h2>
          <div class="wrapper-service">
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o">★</i>
              <div class="service-title">Affordable</div>
              <p class="service-text">Just pay agreed price. No excessive premium or international shipping!</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o">★</i>
              <div class="service-title">Reachable</div>
              <p class="service-text">You can reach ANY items that are not available domestically.</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o">★</i>
              <div class="service-title">Safe</div>
              <p class="service-text">Otsukai will handle and dispatch your payment when item is received.</p>
            </div>
            <div class="service-box">
              <i class="service-icon fa fa-lightbulb-o">★</i>
              <div class="service-title">Free</div>
              <p class="service-text">Join our community and enjoy NO transaction fee!</p>
            </div>
          </div>
        </section>

        <section class="latest">
          <h2 class="heading">Latest Requests</h2>
          <a class="request-box">
            <img class="request-img" src={require("../img/books.png")}/>
            <div class="request-title">Kimono<br/>Japan</div>
            <time class="date" datetime="2019-02-14">02.14.2019</time>
          </a>
          <a class="request-box">
            <img class="request-img" src={require("../img/books.png")}/>
            <div class="request-title">Eyeshadow<br/>UK</div>
            <time class="date" datetime="2019-02-15">02.15.2019</time>
          </a>
          <a class="request-box">
            <img class="request-img" src={require("../img/books.png")}/>
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

export default Takako;
