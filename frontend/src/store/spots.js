import { csrfFetch } from "./csrf"

//types
const GET_ALL_SPOTS  = "spots/getAllSpots"
const GET_SPOTS_CURR_USER = "spots/current"
const GET_ONE_SPOT = "spots/getOneSpot"
const CREATE_SPOT = "spots/createSpot"
const DELETE_SPOT = "spots/deleteSpot"
const EDIT_SPOT = "spots/editSpot"
//action creators
const actionGetAllSpots = (spots) => {
  return {
    type: GET_ALL_SPOTS,
    spots
  }
}

const actionGetSpotsCurrent = (spots) => {
  return {
    type: GET_SPOTS_CURR_USER,
    spots
  }
}

const actionGetOneSpot = (spot) => {
  return {
    type: GET_ONE_SPOT,
    spot
  }
}

const actionCreateSpot = (newSpot) => {
  return {
    type: CREATE_SPOT,
    newSpot
  }
}

const actionDeleteSpot = (spotId) => {
  return {
    type: DELETE_SPOT,
    spotId
  }
}

const actionEditSpot = (updatedSpot) => {
  return {
    type: EDIT_SPOT,
    updatedSpot
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

export const thunkGetSpotsCurrUser = () => async (dispatch) => {
  const response = await fetch('/api/spots/current', {
    method: "GET",
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if(response.ok) {
    const spots = await response.json();
    dispatch(actionGetSpotsCurrent(spots))
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

export const thunkCreateSpot = (spot) => async (dispatch) => {
  try {
    const response = await csrfFetch ('/api/spots', {
          method: "POST",
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(spot)
        })

    if(response.ok) {
      const newSpot = await response.json();
      return newSpot
    }
  } catch (error) {
    const errors = error.json();

    return errors;
  }


}

export const thunkAddImageToSpot = (spotId, images) => async (dispatch) => {
try {
  const newImgArr = [];
  for(let image of images) {
    const response = await csrfFetch(`/api/spots/${spotId}/images`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        url: image,
        preview: true
      })
    })
    if(response.ok) {
      const newImg = await response.json();
      newImgArr.push(newImg)
    }

  }
  return newImgArr;

} catch (error) {
  const errors = await error.json();
  return errors
}

}

export const thunkAddNewSpotToStore = (newSpot) => (dispatch) => {
  dispatch(actionCreateSpot(newSpot))
}

export const thunkDeleteSpot = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: "DELETE",
    headers: {
      'Content-Type': 'application/json'
    }
  })

  if (response.ok) {
    const successMsg = await response.json();
    dispatch(actionDeleteSpot(spotId))
    return successMsg
  } else {
    const error = await response.json();
    return error;
  }
}

export const thunkEditSpot = (editedSpot, spotId) => async (dispatch) => {

  try {
    const response = await csrfFetch(`/api/spots/${spotId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(editedSpot)
    });

    if (response.ok) {
      const updatedSpot = await response.json();
      dispatch(actionEditSpot(updatedSpot))
      return updatedSpot;
    }
  } catch (error) {
      const errors = await error.json();
      return errors;
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
    case GET_SPOTS_CURR_USER: {
      const newState = {...state};


      action.spots.Spots.map((spot) => newState[spot.id] = spot)
      
      return newState;
    }
    case GET_ONE_SPOT: {
      const newState = {...state};
      newState[action.spot.id]= action.spot
      return newState
    }
    case CREATE_SPOT: {
      return {...state, [action.newSpot.id]: action.newSpot};
    }
    case DELETE_SPOT: {
      const newState = {...state};
      delete newState[action.spotId]
      return newState
    }
    case EDIT_SPOT: {
      const newState = {...state};
      newState[action.updatedSpot.id] = action.updatedSpot
      return newState;
    }
    default:
      return state;
  }
}
