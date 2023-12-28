import { thunkEditSpot } from "../../store/spots"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { thunkGetOneSpot } from "../../store/spots";
// import './CreateNewSpotForm.css'

const EditSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const existingSpot = useSelector(state => state.spots[id])
  
  useEffect(() => {
    dispatch(thunkGetOneSpot(id))
    setCountry(existingSpot?.country)
    setAddress(existingSpot?.address)
    setCity(existingSpot?.city)
    setState(existingSpot?.state)
    setDescription(existingSpot?.description)
    setName(existingSpot?.name)
    setPrice(existingSpot?.price)
  }, [dispatch, id, existingSpot?.address, existingSpot?.country, existingSpot?.city, existingSpot?.state, existingSpot?.description, existingSpot?.name, existingSpot?.price])

  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)



  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true)
    // setErrors({});
    const spot = {
      address,
      city,
      state,
      country,
      lat: 0,
      lng: 0,
      name,
      description,
      price
    }

    const updatedSpot = await dispatch(thunkEditSpot(spot, id))

    if (updatedSpot.errors) {
      setErrors({ ...updatedSpot.errors, ...errors })
      console.log("ERROR IN COMPONENT", errors)
    } else {
      navigate(`/spots/${updatedSpot.id}`)
    }
  }

  useEffect(() => {
    const validationErrors = {}

    if (description?.length < 30) validationErrors.description = "Description needs a minimum of 30 characters"

    setErrors(validationErrors)
  }, [description?.length, submitted])


  if(!existingSpot) return null;

  return (
    <div id="create-spot-container">

      <form onSubmit={handleSubmit} id="create-spot-form">
        <h2 id="create-spot-header">Update your Spot</h2>
        <h3 id="create-spot-located-header">Where&apos;s your place located?</h3>
        <h4 id="create-spot-guests-header">Guests will only get your exact address once they booked a reservation</h4>
        <label id="country-label">
          <div>
            Country {"country" in errors && <span style={{ color: "red" }}>{errors.country}</span>}
          </div>
          <input
            id="country-input"
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label id="address-label">
          <div>
            Street Address {"address" in errors && <span style={{ color: "red" }}>{errors.address}</span>}
          </div>
          <input
            id="address-input"
            type="text"
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <div id="city-state-div">
          <label id="city-label">
            <div>
              City {"city" in errors && <span style={{ color: "red" }}>{errors.city}</span>}
            </div>
            <input
              id="city-input"
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <span id="comma-city-state">,</span>
          <label id="state-label">
            <div>
              State {"state" in errors && <span style={{ color: "red" }}>{errors.state}</span>}
            </div>
            <input
              id="state-input"
              type="text"
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>

        </div>
        <label className="create-border-bottom">
          <h2 id="describe-place-header">Describe your place to guests</h2>
          <h4 className="create-form-subheader">Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood</h4>
          <textarea
            id="create-text-area"
            value={description}
            placeholder="Please write at least 30 characters"
            onChange={(e) => setDescription(e.target.value)}
          />
          {submitted && <span style={{ color: "red" }}>{errors.description}</span>}
        </label>
        <label className="create-border-bottom">
          <h2>Create a title for your spot</h2>
          <h4 className="create-form-subheader">Catch guests&apos; attention with a spot title that highlights what makes your place special</h4>
          <input
            id="spot-name-input"
            type="text"
            value={name}
            placeholder="Name of your spot"
            onChange={(e) => setName(e.target.value)}
          />
          {"name" in errors && <span style={{ color: "red" }}>{errors.name}</span>}
        </label>
        <label className="create-border-bottom">
          <h2>Set a base price for your spot</h2>
          <h4>Competitive pricing can help your listing stand out and rank higher in search results.</h4>
          <span id="money">$ </span>
          <input
            id="price-input"
            type="number"
            value={price}
            step={1}
            min={1}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          {"price" in errors && <span style={{ color: "red" }}>{errors.price}</span>}
        </label>

        <button id="submit-create-spot" type="submit">Update your Spot</button>
      </form>
    </div>
  )
}

export default EditSpot;
