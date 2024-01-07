import '../style/Home.css';
import TripForm from './TripForm'; // Adjust the path to where your TripForm component is located

function Home() {
  return (
    <div>
      <div className="home-container">
        <div className="home-text">
          <h1>Limosa</h1>
          <p>Create your itinerary...</p>
          {/* The text overlay on the background image */}
        </div>
        {/* The image is set as a background in the CSS */}
      </div>
      <TripForm />
      {/* The TripForm component is rendered below the image container */}
    </div>
  );
}

export default Home;
