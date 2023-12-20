//types
const GET_CURR_USER_REVIEWS = 'reviews/getCurrUserReviews'
const GET_REVIEWS_SPOT_ID = 'reviews/getReviewsSpotId'
//action creators
const actionGetCurrUserReviews = (reviews) => {
  return {
    type: GET_CURR_USER_REVIEWS,
    reviews
  }
}

const actionGetReviewsSpotId = (reviews) => {
  return {
    type: GET_REVIEWS_SPOT_ID,
    reviews
  }
}
// thunks
export const thunkGetUserReviews = () => async (dispatch) => {
  const response = await fetch('/api/reviews/current', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if(response.ok) {
    const reviews = await response.json();
    dispatch(actionGetCurrUserReviews(reviews));
    return reviews;
  } else {
    const error = await response.json();
    return error;
  }
}

export const thunkGetReviewsBySpotId = (spotId) => async (dispatch) => {
  const response = await fetch (`/api/spots/${spotId}/reviews`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if(response.ok) {
    const reviews = await response.json();
    dispatch(actionGetReviewsSpotId(reviews));
    return reviews;
  } else {
    const error = await response.json();
    return error;
  }
}
//reducer
export default function reviewsReducer(state = {}, action) {
  switch(action.type) {
    case GET_CURR_USER_REVIEWS: {
      const newState = {...state};
      action.reviews.Reviews.map((review) => newState[review.id] = review)
      return newState
    }
    case GET_REVIEWS_SPOT_ID: {
      const newState = {};
      action.reviews.Reviews.map((review) => newState[review.id] = review)
      console.log(newState)
      return newState
    }
    default:
    return state;
  }
}
