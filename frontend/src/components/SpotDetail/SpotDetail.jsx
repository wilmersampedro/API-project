import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import './SpotDetail.css'
import { useEffect, useState } from "react";
import { thunkGetOneSpot } from "../../store/spots";
import Reviews from "../Reviews/Reviews";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import PostReviewModal from "../PostReviewModal/PostReviewModal";

const SpotDetail = () => {
  const { spotId } = useParams();
  const dispatch = useDispatch();
  const [rendered, setRendered] = useState(false);
  const sessionUser = useSelector(state => state.session.user);
  const reviews = useSelector(state => state.reviews);

  useEffect(() => {
    dispatch(thunkGetOneSpot(spotId))
  }, [dispatch, spotId, reviews, rendered])

  const spot = useSelector(state => state.spots[spotId]);
  if(!spot || !spot.SpotImages) return null;
  const imagesArr = spot.SpotImages;

  // const toggleReview = (e) => {
  //   e.stopPropagation();

  // }

  return (
    <div id="spot-detail-main-container">
      <div>
        <p className="spot-title">{spot.name}</p>
        <span>{spot.city}, {spot.state}, {spot.country}</span>
      </div>
      <div className="spot-detail-all-images-container">
        <div className="spot-detail-image-container">
          <img className="spot-detail-main-img"src={imagesArr[0].url}/>
        </div>
        <div className="small-images-container">
          <div className="spot-detail-small-image"><img src="."/> </div>
          <div className="spot-detail-small-image"><img src="."/></div>
          <div className="spot-detail-small-image"><img src="."/></div>
          <div className="spot-detail-small-image"><img src="."/></div>
        </div>
      </div>
      <div id="spot-info-container">
        <div id="spot-info">
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
        </div>
        <div id="reservation-section">
          <span>${spot.price}</span><span>night</span>
          <span><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(2) : 'New'} <i className="fa-solid fa-circle fa-2xs"></i>{spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
          <button id="reserve-button" onClick={() => alert("Feature coming soon")}>Reserve</button>
        </div>
      </div>
      <section>
        <div>
        <h2><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(2) : 'New'} <i className="fa-solid fa-circle fa-2xs"></i> {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</h2>
        </div>
          {(sessionUser && spot.Owner.id !== sessionUser.id) && <OpenModalButton
            buttonText="Post Your Review"
            modalComponent={<PostReviewModal spotId={spotId} setRendered={setRendered}/>}
          />}
        <div>
          <Reviews spotId={spotId} rendered={rendered}/>
        </div>
      </section>
    </div>
  )
}

export default SpotDetail;
