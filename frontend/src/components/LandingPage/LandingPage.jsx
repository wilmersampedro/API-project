import { useDispatch, useSelector } from "react-redux";
import { thunkGetSpots } from "../../store/spots"
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'
const LandingPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots)
  const spotsArr = Object.values(spots);


  useEffect(() => {
    dispatch(thunkGetSpots())
  }, [dispatch])

  if(!spots) return null;

  return (
    <div id="tilesContainer">
    {spotsArr.map((spot) => (
      <div key={spot.id} className="spotTile" title={spot.name} onClick={() => navigate(`/spots/${spot.id}`)}>
        <img src={"https://a0.muscache.com/im/pictures/b7c9264d-73c9-45c3-882e-6e9577d63d68.jpg?im_w=1200"} className="tileImage"/>
      <div>
        <div className="location-container">
          {spot.city}, {spot.state}
          <div>
          <i className="fa-solid fa-star"></i>
            {spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</div>
          </div>
        <span>${spot.price} night</span>
        </div>
      </div>
    ))}
    </div>
  )
}

export default LandingPage;
