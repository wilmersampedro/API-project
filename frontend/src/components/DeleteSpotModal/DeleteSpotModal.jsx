import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import './DeleteSpotModal.css'
import { thunkDeleteSpot } from "../../store/spots";

function DeleteSpotModal ({spot}) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const handleDelete = () => {
    dispatch(thunkDeleteSpot(spot.id)).then(closeModal())
  }
  return (
    <div id="deleteModalContainer">
      <h1>Confirm Delete</h1>
      <h3 id="confirmDeleteQuestion">Are you sure you want to remove this spot from the listings?</h3>
      <div id="deleteButtonContainer">
      <button id="deleteButton" onClick={handleDelete}>Yes (Delete Spot)</button>
      <button id="cancelDeleteButton" onClick={() => closeModal()}>No (Keep Spot)</button>
      </div>
    </div>
  )
}

export default DeleteSpotModal;
