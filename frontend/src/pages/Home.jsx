import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="container">
          <h1>🌿 Welcome to Healthcare Dr. Bot</h1>
          <p className="tagline">
            Your trusted companion for Ayurvedic & Allopathic medicines
          </p>
          <p className="subtitle">
            Search symptoms in any language • Find medicines • Locate nearby pharmacies
          </p>
          <Link to="/dashboard" className="btn btn-primary btn-large">
            Get Started
          </Link>
        </div>
      </div>

      <div className="container features">
        <div className="feature-card">
          <div className="feature-icon">🔍</div>
          <h3>Multi-Language Search</h3>
          <p>Search symptoms in English, Hindi, Marathi, or Hinglish</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">💊</div>
          <h3>Ayurvedic & Allopathic</h3>
          <p>Get both traditional and modern medicine options</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">📍</div>
          <h3>Nearby Pharmacies</h3>
          <p>Find medical stores near you with stock availability</p>
        </div>
        
        <div className="feature-card">
          <div className="feature-icon">🏠</div>
          <h3>Home Remedies</h3>
          <p>Natural remedies for common ailments</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
