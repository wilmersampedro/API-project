import { thunkCreateSpot, thunkAddImageToSpot, thunkAddNewSpotToStore } from "../../store/spots"
import { useDispatch } from "react-redux"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './CreateNewSpotForm.css'

const CreateNewSpot = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image1, setImage1] = useState('');
  const [image2, setImage2] = useState('');
  const [image3, setImage3] = useState('');
  const [image4, setImage4] = useState('');
  const [image5, setImage5] = useState('');
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const imagesArr = [];

  const handleSubmit = async (e) => {
    e.preventDefault();
    const error = {};
    setSubmitted(true)
    if(!image1) {
      error.image1 = "Preview Image required"
      setErrors(errors)
      return errors
    }

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

    const newSpot = await dispatch(thunkCreateSpot(spot))

    if (newSpot.errors) {

      setErrors({ ...newSpot.errors, ...errors })

    } else {
      if (image1) imagesArr.push(image1)
      if (image2) imagesArr.push(image2)
      if (image3) imagesArr.push(image3)
      if (image4) imagesArr.push(image4)
      if (image5) imagesArr.push(image5)

      

      const newImg = dispatch(thunkAddImageToSpot(newSpot.id, imagesArr))

      const validNewSpot = {
        ...newSpot,
        newImg
      }

      dispatch(thunkAddNewSpotToStore(validNewSpot));

      setCountry('')
      setAddress('')
      setCity('')
      setState('')
      setDescription('')
      setName('')
      setPrice('')
      setImage1('')
      setImage2('')
      setImage3('')
      setImage4('')
      setImage5('')

      navigate(`/spots/${validNewSpot.id}`)
    }
  }

  useEffect(() => {
    const validationErrors = {}

    if(submitted && !country) {
      validationErrors.country = "Country is required"
    }

    if(submitted && !address) {
      validationErrors.address = "Address is required"
    }

    if(submitted && !city) {
      validationErrors.city = "City is required"
    }

    if(submitted && !state) {
      validationErrors.state = "State is required"
    }

    if(submitted && description.length < 30) {
      validationErrors.description = "Description needs a minimum of 30 characters"
    }

    if(submitted && !name) {
      validationErrors.name = "Name is required"
    }

    if(submitted && !price) {
      validationErrors.price = "Price is required"
    }

    if (submitted && !image1) {
      validationErrors.image1 = "Preview Image is required"
    }

    setErrors(validationErrors)
  }, [image1, description.length, submitted, address, city, country, name, price, state])

  return (
    <div id="create-spot-container">

      <form onSubmit={handleSubmit} id="create-spot-form">
        <h2 id="create-spot-header">Create a new Spot</h2>
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
            placeholder="Street Address"
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
            step={.01}
            min={1}
            placeholder="Price per night (USD)"
            onChange={(e) => setPrice(e.target.value)}
          />
          {"price" in errors && <p style={{ color: "red" }}>{errors.price}</p>}
        </label>
        <label className="create-border-bottom" id="photo-inputs">
          <h2 id="photo-header-form">Liven up your spot with photos</h2>
          <h4 className="create-form-subheader">Submit a link to at least one photo to publish your spot</h4>
          <input
            id="preview-image-url"
            placeholder="Preview Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
          {(submitted && "image1" in errors) && <span style={{ color: "red" }}>{errors.image1}</span>}
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
          <input
            className="image-url-input"
            placeholder="Image URL"
            type="text"
            value={image5}
            onChange={(e) => setImage5(e.target.value)}
          />
        </label>
        <button id="submit-create-spot" type="submit">Create Spot</button>
      </form>
    </div>
  )
}

export default CreateNewSpot;
