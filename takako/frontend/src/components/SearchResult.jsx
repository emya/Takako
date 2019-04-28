import React, { Component } from 'react';
import {connect} from 'react-redux';
import {search_result, auth} from "../actions";
import MediaQuery from 'react-responsive';
import '../css/style.scss';
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faIgloo } from '@fortawesome/free-solid-svg-icons'

class SearchResult extends Component {
  componentDidMount() {
    this.props.fetchUsers();
  }

  state = {
    text: "",
    updateNoteId: null,
  }

  render() {
    return (
    <div>
      <header class="header">
          <div class="topbar-contents">
            <form class="search">
              <input type="search" name="search" placeholder="Search"/>
              <input class="search-button" type="submit" value="Search"/>
            </form>
            <a href="#"><p>APP<br/>LOGO</p></a>
            <div class="login">
              <a class="register" href="#">Get Started</a>
              <a class="signin" href="#">Sign in</a>
            </div>
          </div>

          <div class="mobile-topbar-contents">
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">三</i></a>
            <a href="#"><p>APP<br/>LOGO</p></a>
            <a href="#" class="mobile-menu-icon"><i class="fa fa-bars">★</i></a>
          </div>

        <div class="menu">
          <a href="#">HOME</a>
          <a href="#">Request Item</a>
          <a href="#">Find Request</a>
          <a href="#">Mypage</a>
        </div>
      </header>

      <div class="wrapper clearfix">
        <div class="filter">
          <h2>Filter</h2>
          <div class="filter-field">
            <div class="filter-item">
              <h3>Keyword</h3>
              <input type="text" placeholder="Enter a keyword"/>
            </div>
          <div class="filter-item">
            <h3>Residence</h3>
              <select>
                <option>NY</option>
                <option>CA</option>
              </select>
          </div>
          <div class="filter-item">
            <h3>Trip Destination</h3>
              <select>
                <option>Japan</option>
                <option>UK</option>
              </select>
          </div>
          <div class="filter-item">
            <h3>Trip Return</h3>
              <select>
                <option>in 1 week</option>
                <option>in 1 month</option>
              </select>
          </div>
        </div>
      </div>

      <div class="search-result">
        <h2>Results for "Travellers"</h2>
        <div class="sort-by">Sort by:<select><option>Trip Return</option></select></div>
        <div class="profile-card">
            <img class="profile-card-img" src="./img/woman3.jpg"/>
            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <div class="profile-card-contents">
              <p class="profile-card-name">Megan Bakken</p>
              <div class="profile-card-data">Since 03/2019<br/>Last login 1 day ago</div>
              <div class="profile-card-data subject">Residence:</div><div class="profile-card-data">New York</div>
              <div class="profile-card-data subject">Occupation:</div><div class="profile-card-data">Employee</div>
              <div class="profile-card-data subject">Next Trip:</div><div class="profile-card-data">9/2019 Spain</div>
            </div>
        </div>
        <div class="profile-card">
            <img class="profile-card-img" src="./img/woman3.jpg"/>
            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <div class="profile-card-contents">
              <p class="profile-card-name">Megan Bakken</p>
              <div class="profile-card-data">Since 03/2019<br/>Last login 1 day ago</div>
              <div class="profile-card-data subject">Residence:</div><div class="profile-card-data">New York</div>
              <div class="profile-card-data subject">Occupation:</div><div class="profile-card-data">Employee</div>
              <div class="profile-card-data subject">Next Trip:</div><div class="profile-card-data">9/2019 Spain</div>
            </div>
        </div>
      </div>
    </div>

    <div class="sidemenu-mobile">
        xxx
    </div>

    <footer>
    FOOTER CONTENTS TO BE DETERMINED
    <FontAwesomeIcon icon="igloo" />
    </footer>
  </div>
    )
  }
}


const mapStateToProps = state => {
  console.log("state.auth.user", state.auth);
  return {
    search_result: state.search_result,
    user: state.auth.user,
  }
}


const mapDispatchToProps = dispatch => {
  return {
    fetchUsers: () => {
      dispatch(search_result.fetchUsers());
    },
    logout: () => dispatch(auth.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchResult);
