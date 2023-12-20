//types
const GET_ALL_SPOTS  = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"
//action creators
const actionGetAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

const actionGetOneSpot = (spot) => {
  return {
    type: GET_ONE_SPOT,
    spot
  }
}
//thunks
export const thunkGetSpots = () => async (dispatch) => {
  const response = await fetch('/api/spots', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const spots = await response.json();
    dispatch(actionGetAllSpots(spots));
    return spots;
  } else {
    const error = await response.json();
    return error;
  }
}

export const thunkGetOneSpot = (spotId) => async (dispatch) => {
  const response = await fetch(`/api/spots/${spotId}`, {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (response.ok) {
    const spot = await response.json()
    dispatch(actionGetOneSpot(spot))
    return spot
  } else {
    const error = await response.json()
    return error
  }
}



//reducers
export default function spotsReducer(state = {}, action) {
  switch(action.type) {
    case GET_ALL_SPOTS: {
      const allSpots = {...state};
      const spotsArr = Object.values(action.spots.Spots)
      spotsArr.map((spot) => allSpots[spot.id] = spot)
      // const allSpots = {...state, ...action.spots.Spots}
      return allSpots
    }
    case GET_ONE_SPOT: {
      const newState = {};
      newState[action.spot.id]= action.spot
      

      return newState
    }
    default:
      return state;
  }
}
