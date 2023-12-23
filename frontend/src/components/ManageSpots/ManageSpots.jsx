import { useDispatch, useSelector } from "react-redux";
import { thunkGetSpotsCurrUser } from "../../store/spots";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteSpotModal from "../DeleteSpotModal/DeleteSpotModal";
import { useNavigate } from "react-router-dom";
import './ManageSpots.css'
const ManageSpots = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const spots = useSelector(state => state.spots)
  console.log("🚀 ~ file: ManageSpots.jsx:9 ~ ManageSpots ~ spots:", spots)
  const spotsArr = Object.values(spots);
  console.log("🚀 ~ file: ManageSpots.jsx:11 ~ ManageSpots ~ spotsArr:", spotsArr)

  useEffect(() => {
    dispatch(thunkGetSpotsCurrUser())
  }, [dispatch])

  // const updateClick = (id, e) => {
  //   e.stopPropagation()
  //   navigate(`/spots/`)
  // }

  if(!spots) return null;
  return (
    <div id="manageSpotsContainer">
      <div id="manageSpotHeader">
        <h2 id="manageSpotsTitle">Manage Spots</h2>
        <button id="manageSpotsCreateButton" onClick={() => navigate('/spots/new')}>Create a New Spot</button>
      </div>
    <div id="manageSpotsTilesContainer">
      
      {spotsArr.map((spot) => (
      <div key={spot.id} className="spotTile" title={spot.name} onClick={() => navigate(`/spots/${spot.id}`)}>
        <img src={spot.previewImage} className="tileImage"/>
      <div>
        <div className="location-container">
          {spot.city}, {spot.state}
          <div>
          <i className="fa-solid fa-star"></i>
            {typeof spot.avgRating === "number" ? spot.avgRating.toFixed(2) : 'New'}</div>
          </div>
        <span>${spot.price} night</span>
        </div>
        <div>
          <button className="manageSpotsButtons" onClick={() => navigate(`/spots/${spot.id}/edit`)}>Update</button>
          <OpenModalButton
          buttonText="Delete"
          buttonId={"manageDeleteButton"}
          modalComponent={<DeleteSpotModal spot={spot}  />}
          />
        </div>
      </div>
    ))}
    </div>
    </div>
  )
}

export default ManageSpots;
