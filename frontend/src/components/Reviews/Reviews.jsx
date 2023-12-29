import { useSelector, useDispatch } from "react-redux";
import { thunkGetReviewsBySpotId } from "../../store/reviews";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
const Reviews = ({spotId, rendered}) => {
  const dispatch = useDispatch();
  const reviewsObj = useSelector(state => state.reviews)
  const reviewsArr = Object.values(reviewsObj);
  const sessionUser = useSelector(state => state.session.user)
  console.log("🚀 ~ file: Reviews.jsx:10 ~ Reviews ~ sessionUser:", sessionUser)
  console.log(reviewsArr)
  useEffect(() => {
    dispatch(thunkGetReviewsBySpotId(spotId))
  }, [dispatch, spotId, rendered]);

  if(!reviewsObj) return null

  for(let rev of reviewsArr) {
    if (!rev.User) return null
  }

  const readableDate = (date) => {
    const newDate = new Date(date);
    return newDate.getFullYear()
  }

  const getMonth = (date) => {
    const newDate = new Date(date);
    return newDate.toString().split(' ')[1]
  }
  return (
    <>
    {reviewsArr.map((review) => (
      <div key={review.id}>
        <p>{review.User.firstName}</p>
        <p>{getMonth(review.createdAt)} {readableDate(review.createdAt)}</p>
        <p>{review.review}</p>
        {sessionUser.id === review.User.id && <OpenModalButton
        buttonText="Delete"
        buttonId={"manageDeleteButton"}
        modalComponent={<DeleteReviewModal id={review.id}/>}
        />}
      </div>
    ))}
    </>
  )
}

export default Reviews;
