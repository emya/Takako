import React, {Component} from 'react';

import {connect} from 'react-redux';

/*
class SearchResults extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return(
      <div>
        {this.props.results.length}
        {this.props.results.map((result, key) => (
            <input type="text" key={key}>{result.title}</input>
          ))}
      </div>
    )
  }
}
*/

const SearchResults = ({profiles}) => {
    console.log("searchResults", {profiles});
    return(
      <div>
        {profiles.map((profile, key) => (
          <div class="profile-card">
            <img class="profile-card-img" src="./img/woman3.jpg"/>
            <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
            <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
            <div class="profile-card-contents">
              <p class="profile-card-name">{profile.user.username}</p>
              <div class="profile-card-data subject">Residence:</div><div class="profile-card-data">{profile.residence}</div>
              <div class="profile-card-data subject">Occupation:</div><div class="profile-card-data">{profile.occupation}</div>
              <div class="profile-card-data subject">Next Trip:</div><div class="profile-card-data">9/2019 Spain</div>
            </div>
          </div>
        ))}
      </div>
    )
};

function mapStateToProps(state) {
  console.log("state", state);
  return {
    results: state.results
  };
}

export default SearchResults;
//export default connect(mapStateToProps, null)(SearchResults);
