import { csrfFetch } from "./csrf"

//types
const GET_CURR_USER_REVIEWS = 'reviews/getCurrUserReviews'
const GET_REVIEWS_SPOT_ID = 'reviews/getReviewsSpotId'
const CREATE_NEW_REVIEW = 'reviews/createNewReview'
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

const actionCreateNewReview = (newReview) => {
  return {
    type: CREATE_NEW_REVIEW,
    newReview
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

export const thunkCreateNewReview = (review, spotId, currUser) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}/reviews`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(review)
  })

  if(response.ok) {
    const newReview = await response.json();
    dispatch(actionCreateNewReview({...newReview, ...currUser}))

    console.log("🚀 ~ file: reviews.js:84 ~ thunkCreateNewReview ~ newReview:", newReview)
    return newReview;
  } else {
    const errors = await response.json();
    console.log("🚀 ~ file: reviews.js:84 ~ thunkCreateNewReview ~ newReview:", errors)
    return errors;
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
    case CREATE_NEW_REVIEW: {
      return {...state, [action.newReview.id]: action.newReview};
    }
    default:
    return state;
  }
}
