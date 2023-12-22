import { useState } from "react"
import './PostReviewModal.css'
import { useDispatch, useSelector } from "react-redux"
import { thunkCreateNewReview } from "../../store/reviews";
import { useModal } from "../../context/Modal";

function PostReviewModal ({spotId, setDispatched}) {
  const dispatch = useDispatch();
  const [review, setReview] = useState('')
  const [rating, setRating] = useState(0)
  const [activeRating, setActiveRating] = useState(rating);
  const { closeModal } = useModal();

  const onChange = (number) => {
    setRating(parseInt(number));
  };


  const currUser = useSelector(state => state.session.user)

  const handleSubmit = (e) => {
    e.preventDefault();
    const newReview = {
      review,
      stars: rating
    }

    dispatch(thunkCreateNewReview(newReview, spotId, currUser)).then(closeModal).then(setDispatched(true))
  }

  return (
    <div id="review-modal-container">
    <h1>How was your stay?</h1>
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
        <div value={1} onClick={() => onChange(1)} onMouseEnter={() => setActiveRating(1)} className={rating >= 1 ? 'filled' : 'empty'}>
        <i className="fa-solid fa-star"></i>
        </div>
        <div value={2} onClick={() => onChange(2)} onMouseEnter={() => setActiveRating(2)} className={rating >= 2 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={3} onClick={() => onChange(3)} onMouseEnter={() => setActiveRating(3)} className={rating >= 3 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={4} onClick={() => onChange(4)} onMouseEnter={() => setActiveRating(4)} className={rating >= 4 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>
        <div value={5} onClick={() => onChange(5)} onMouseEnter={() => setActiveRating(5)} className={rating >= 5 ? 'filled' : 'empty'}>
          <i className="fa-solid fa-star"></i>
        </div>

      <span>Stars</span>
      </div>
      <button type="submit">Submit Your Review</button>
    </form>
    </div>
  )
}

export default PostReviewModal
