import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { thunkDeleteReview } from "../../store/reviews";
import './DeleteReviewModal.css'
function DeleteReviewModal({ id }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(thunkDeleteReview(id)).then(closeModal())
  }

  return (
    <div id="deleteReviewModalContainer">
      <h1>Confirm Delete</h1>
      <h3 id="confirmDeleteQuestionReview">Are you sure you want to delete this review?</h3>
      <div id="deleteReviewButtonContainer">
        <button id="deleteReviewButton" onClick={handleDelete}>Yes (Delete Review)</button>
        <button id="cancelDeleteReview" onClick={() => closeModal()}>No (Keep Review)</button>
      </div>
    </div>
  )
}

export default DeleteReviewModal;
