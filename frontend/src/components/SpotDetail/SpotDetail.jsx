import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import './SpotDetail.css'

const SpotDetail = () => {
  const { spotId } = useParams();
  const spotsObj = useSelector(state => state.spots);
  const spotsArr = Object.values(spotsObj);
  console.log("ALLSPOTS IN SPOTDETAIL COMP", spotsArr)
  const spot = spotsArr.find((spot) => spot.id == spotId);

  return (
    <div>
      <div>
        <p className="spot-title">{spot.name}</p>
        <span>{spot.city}, {spot.state}, {spot.country}</span>
      </div>
      <div>
        <img src={spot}/>
      </div>
    </div>
  )
}

export default SpotDetail;
