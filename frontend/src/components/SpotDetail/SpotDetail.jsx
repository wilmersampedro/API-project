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
  if (!spot || !spot.SpotImages) return null;
  const imagesArr = spot.SpotImages;
  console.log("🚀 ~ file: SpotDetail.jsx:24 ~ SpotDetail ~ imagesArr:", imagesArr)

  // const toggleReview = (e) => {
  //   e.stopPropagation();

  // }

  return (
    <div id="spot-detail-main-container">
      <div id="spotDetailHeadingInfoContainer">
        <p className="spot-title">{spot.name}</p>
        <span>{spot.city}, {spot.state}, {spot.country}</span>
      </div>
      <div className="spot-detail-all-images-container">
        <div className="spot-detail-image-container">
          <img className="spot-detail-main-img" src={imagesArr[0].url} />
        </div>
        <div className="small-images-container">
          {imagesArr[1] && <div className="indiv-small-img-boxes"><img className="spot-detail-small-image" src={imagesArr[1].url} /></div>}
          {imagesArr[2] && <div className="indiv-small-img-boxes"><img className="spot-detail-small-image" src={imagesArr[2].url} /></div>}
          {imagesArr[3] && <div className="indiv-small-img-boxes"><img className="spot-detail-small-image" src={imagesArr[3].url} /></div>}
          {imagesArr[4] && <div className="indiv-small-img-boxes"><img className="spot-detail-small-image" src={imagesArr[4].url} /></div>}
        </div>
      </div>
      <div id="spot-info-container">
        <div id="spot-info">
          <h2 id="hostedByNameHeader">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
        </div>
        <div id="reservation-section">
          <div id="reserveSectionTopSection">
            <div>
              <span id="spotPriceReserveSection">${spot.price}</span><span className="nightSpan" > night</span>
            </div>
            <div>
              {spot.numReviews ? (

                <span className="spotReviewsReserveSection" ><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}<span className="dotSpan"> ·</span> {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</span>
              ) : (
                <span className="spotReviewsReserveSection"><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(2) : 'New'}</span>
              )}
            </div>
          </div>
          <button id="reserve-button" onClick={() => alert("Feature coming soon")}>Reserve</button>
        </div>
      </div>
      <section id="spotDetailReviewSection">
        <div>
          <h2><i className="fa-solid fa-star"></i>{spot.avgRating ? spot.avgRating.toFixed(2) : 'New'} · {spot.numReviews} {spot.numReviews === 1 ? 'Review' : 'Reviews'}</h2>
        </div>
        {(sessionUser && spot.Owner.id !== sessionUser.id) && <OpenModalButton
          buttonText="Post Your Review"
          buttonId={"postYourReviewButton"}
          modalComponent={<PostReviewModal spotId={spotId} setRendered={setRendered} />}
        />}
        <div>
          <Reviews spotId={spotId} rendered={rendered} />
        </div>
      </section>
    </div>
  )
}

export default SpotDetail;
