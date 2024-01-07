import { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../style/EditProfile.css'
import user_icon from '../assets/person.png'
import birthdate_icon from '../assets/birthdate_icon.png'

function EditProfile() {

  const [name, setName] = useState("");
  const [birthdate, setBirthdate] = useState('');
  const [gender, setGender] = useState('');
  const [error, setError] = useState("");
  
  const handleProfileRedirect = () => {
    navigate('/profile');
  }

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name ) {
        setError("Name fields must be filled in");
        return; // Form gönderimini engelle
      }

    axios.post("http://localhost:3001/editprofile", {name})
    .then(res => {
      console.log(res)
      navigate('/profile')
    })
    .catch(err => {
      console.log(err)
    });
  }

  return (
 
    <form className="container-1" onSubmit={handleSubmit}>
    <div className="header">
      <div className="text">Edit Profile</div>
      <div className="underline"></div>
    </div>
    <div className="inputs">
        <div className="input">
          <img className="name" src={user_icon} alt="" />
          <input type="text" placeholder="Name" autoComplete="off" onChange={(e) => setName(e.target.value)} />        
        </div>
       
        <div className="input">
  <img className="birthdate" src={birthdate_icon} alt="Birthdate"  />
  <input type="date" placeholder="Birthdate" autoComplete="off" 
    onChange={(e) => setBirthdate(e.target.value)} 
  />
</div>
<div className="input gender-input">
        <p>Gender:</p>
        <label>
          <input 
            type="radio" 
            name="gender" 
            value="male" 
            checked={gender === 'male'} 
            onChange={(e) => setGender(e.target.value)}
          />
          Male
        </label>
        <label>
          <input 
            type="radio" 
            name="gender" 
            value="female" 
            checked={gender === 'female'} 
            onChange={(e) => setGender(e.target.value)}
          />
          Female
        </label>
        <label>
          <input 
            type="radio" 
            name="gender" 
            value="other" 
            checked={gender === 'other'} 
            onChange={(e) => setGender(e.target.value)}
          />
          Other
        </label>
      </div>
      {error && <div className="error-message">{error}</div>}
    </div>
    <div className="submit-container">
      <button type="submit" className="submit" onClick={handleProfileRedirect}>Save</button>
      
    </div>
  </form>

  );
}

export default EditProfile;
