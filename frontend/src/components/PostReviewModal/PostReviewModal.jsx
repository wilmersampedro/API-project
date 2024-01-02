import { useState } from "react"
import './PostReviewModal.css'
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateNewReview, thunkGetReviewsBySpotId } from "../../store/reviews";
import { useModal } from "../../context/Modal";

function PostReviewModal ({spotId, setRendered}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(0)
  const [activeRating, setActiveRating] = useState(rating);
  const [error, setError] = useState({})
  const { closeModal } = useModal();

  const onChange = (number) => {
    setRating(parseInt(number));
  };


  const currUser = useSelector(state => state.session.user)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {}

    const newReview = {
      review,
      stars: rating
    }

    const newlyCreatedReview = await dispatch(thunkCreateNewReview(newReview, spotId, currUser))
    // .then(closeModal).then(setRendered(true))
    if(newlyCreatedReview.errors) {
      errors.message = "Review already exists for this spot"
      setError(errors)
      return error
    }
    closeModal()
    setRendered(true)

    dispatch(thunkGetReviewsBySpotId(spotId))
    // return newlyCreatedReview
  }

  return (
    <div id="review-modal-container">
    <h1>How was your stay?</h1>
    {"message" in error && <p>{error.message}</p>}
    <form id="review-modal-form" onSubmit={handleSubmit}>
      <label id="new-review-modal-label">
        <textarea
          id="newReviewText"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Leave your review here..."
        />
      </label>
      <div id="stars-container" onMouseLeave={() => {setActiveRating(rating)}}>
        <div value={1} onClick={() => onChange(1)} onMouseEnter={() => setActiveRating(1)} className={activeRating >= 1 ? 'filled' : 'empty'}>
        <i className="fa-solid fa-star"></i>
        </div>
        <div value={2} onClick={() => onChange(2)} onMouseEnter={() => setActiveRating(2)} className={activeRating >= 2 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={3} onClick={() => onChange(3)} onMouseEnter={() => setActiveRating(3)} className={activeRating >= 3 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={4} onClick={() => onChange(4)} onMouseEnter={() => setActiveRating(4)} className={activeRating >= 4 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={5} onClick={() => onChange(5)} onMouseEnter={() => setActiveRating(5)} className={activeRating >= 5 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>

      <span id="starsSpanPostReview">Stars</span>
      </div>
      <button id={(review.length < 10 || rating < 1) ? "disabledButton" : "postReviewButtonConfirmation"} type="submit" disabled={review.length < 10 || rating < 1}>Submit Your Review</button>
    </form>
    </div>
  )
}

export default PostReviewModal
