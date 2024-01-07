import '../style/Home.css';

import homeImage from '../assets/home-image.jpg'; // Adjust the path to your image

function Home() {
    return (
      <div className="home-container">
        <div className="home-text">
          <h1>Limosa</h1>
          <p>Create your itinerary...</p>
          {/* Add more text or components here as needed */}
        </div>
        {/* The image is set as a background in the CSS */}
      </div>
    );
  }
  
export default Home;