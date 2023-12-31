import { useSelector, useDispatch } from "react-redux";
import { thunkGetReviewsBySpotId } from "../../store/reviews";
import { useEffect } from "react";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import DeleteReviewModal from "../DeleteReviewModal/DeleteReviewModal";
import './Reviews.css'

const Reviews = ({ spot, rendered }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(thunkGetReviewsBySpotId(spot.id))
  }, [dispatch, spot.id, rendered]);
  const reviewsObj = useSelector(state => state.reviews)
  const reviewsArr = Object.values(reviewsObj);
  const sessionUser = useSelector(state => state.session.user)
  console.log("SPOT", spot)
  // console.log("🚀 ~ file: Reviews.jsx:10 ~ Reviews ~ sessionUser:", sessionUser.id, spot.id)
  console.log(reviewsArr)

  // if(!reviewsObj) return null

  const sortedArr = reviewsArr.sort((rev1, rev2) => {
    const date1 = new Date(rev1.createdAt);
    const date2 = new Date(rev2.createdAt);
    if (date1 < date2) {
      return 1
    } else if (date1 > date2) {
      return -1
    } else {
      return 0
    }
  })
  console.log("🚀 ~ file: Reviews.jsx:34 ~ sortedArr ~ sortedArr:", sortedArr)


  for (let rev of sortedArr) {
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
      {sortedArr.length ? (
        <>
          {sortedArr.map((review) => (
            <div key={review.id} className="reviewListIndivContainer">
              <p id="reviewListFirstName">{review.User.firstName}</p>
              <p id="reviewListDate">{getMonth(review.createdAt)} {readableDate(review.createdAt)}</p>
              <p id="reviewListText">{review.review}</p>
              {sessionUser ? (
                <>
                  {sessionUser.id === review.User.id && <OpenModalButton
                    buttonText="Delete"
                    buttonId={"ReviewListDeleteButton"}
                    modalComponent={<DeleteReviewModal id={review.id} />}
                  />}
                </>
              ) : (
                <></>
              )}
              {/* {sessionUser.id === review.User.id && <OpenModalButton
        buttonText="Delete"
        buttonId={"manageDeleteButton"}
        modalComponent={<DeleteReviewModal id={review.id}/>}
        />} */}
            </div>
          ))}
        </>
      ) : (
        <>
          {(sessionUser && sessionUser.id !== spot.Owner.id) ? (
            <p id="firstToPostReview">Be the first to post a review!</p>

          ) : (
            <></>
          )}
        </>
      )}
    </>
  )
}

export default Reviews;
