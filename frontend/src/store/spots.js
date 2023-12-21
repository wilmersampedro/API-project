import { csrfFetch } from "./csrf"

//types
const GET_ALL_SPOTS  = "spots/getAllSpots"
const GET_ONE_SPOT = "spots/getOneSpot"
const CREATE_SPOT = "spots/createSpot"
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

const actionCreateSpot = (newSpot) => {
  return {
    type: CREATE_SPOT,
    newSpot
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
    console.log("ERRORS IN THUNK", errors)
    return errors;
  }
//   // console.log("SPOT IN THUNK 1", spot)
//   const response = await csrfFetch ('/api/spots', {
//     method: "POST",
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(spot)
//   })
// console.log("RESPONSE IN THUNK", response)

//   try {
//     if(response.ok) {
//       const newSpot = await response.json();
//     console.log("RESPONSE OK", newSpot)
//     return newSpot
//     }
//   } catch (error) {
//     const errors = error.json();
//     console.log("ERROR IN THUNK", errors)
//     return errors
//   }
//   // if(response.ok) {
//   //   const newSpot = await response.json();
//   //   console.log("RESPONSE OK", newSpot)
//   //   // dispatch(actionCreateSpot(newSpot));
//   //   return newSpot;
//   // } else {
//   //   const error = await response.json();
//   //   console.log("IN THE THUNK RESPONSE NOT OK", error)
//   //   return error;
//   // }
}

export const thunkAddImageToSpot = (spotId, images) => async (dispatch) => {
try {
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
      return newImg
    }

  }

} catch (error) {
  const errors = await error.json();
  return errors
}

}

export const thunkAddNewSpotToStore = (newSpot) => (dispatch) => {
  dispatch(actionCreateSpot(newSpot))
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
    case CREATE_SPOT: {
      return {...state, [action.newSpot.id]: action.newSpot};
    }
    default:
      return state;
  }
}
