import { useSelector, useDispatch } from "react-redux";
import { thunkGetReviewsBySpotId } from "../../store/reviews";
import { useEffect } from "react";

const Reviews = (spotId) => {
  const dispatch = useDispatch();
  const reviewsObj = useSelector(state => state.reviews)
  const reviewsArr = Object.values(reviewsObj);
  console.log(reviewsArr)
  useEffect(() => {
    dispatch(thunkGetReviewsBySpotId(1))
  }, [dispatch, spotId]);

  if(!reviewsObj) return null

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
      </div>
    ))}
    </>
  )
}

export default Reviews;
