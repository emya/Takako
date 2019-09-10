import React from 'react';

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

const SearchResults = ({travelers}) => {
    console.log("searchResults", {travelers});
    return(
      <div>
        <div class="search-user-wrapper">
          {travelers.map((traveler, key) => (
            <a href={`/profile/${traveler.id}`} style={{color: "black"}}>
            <div class="profile-card">
              <img class="profile-card-img" src={require('../img/default.png')}/>
              <a href="#" class="sns"><i class="fab fa-facebook"></i></a>
              <a href="#" class="sns"><i class="fab fa-instagram"></i></a>
              <div class="profile-card-contents">
                <p class="profile-card-name">{traveler.first_name} {traveler.last_name}</p>
                {traveler.trip && traveler.trip.length > 0 && (
                  <div>
                    <div class="profile-card-data subject">Next Trip:</div>
                    <div class="profile-card-data">{traveler.trip[0].departure_date} - {traveler.trip[0].arrival_date} {traveler.trip[0].destination}</div>
                  </div>
                )}
              </div>
            </div>
            </a>
        ))}
      </div>
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
