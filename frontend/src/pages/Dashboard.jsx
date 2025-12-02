import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptom, setSelectedSymptom] = useState(null);
  const [medicines, setMedicines] = useState([]);
  const [remedies, setRemedies] = useState([]);
  const [activeTab, setActiveTab] = useState('medicines');
  const [nearbyStores, setNearbyStores] = useState([]);
  const [selectedMedicine, setSelectedMedicine] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.role === 'pharmacist') {
        navigate('/pharmacist');
      } else if (user.role === 'doctor') {
        navigate('/doctor-dashboard');
      }
    }
  }, [user?.role]);

  const searchSymptoms = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/symptoms/search?query=${query}`);
      setSymptoms(res.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  const selectSymptom = async (symptom) => {
    setSelectedSymptom(symptom);
    setNearbyStores([]);
    setSelectedMedicine(null);
    
    // Save to search history if user is logged in
    if (user) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/history`, {
          symptomId: symptom.symptom_id,
          searchQuery: query
        });
      } catch (error) {
        console.error('Error saving history:', error);
      }
    }
    
    try {
      const [medRes, remRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/symptoms/${symptom.symptom_id}/medicines`),
        axios.get(`${import.meta.env.VITE_API_URL}/symptoms/${symptom.symptom_id}/remedies`)
      ]);
      setMedicines(medRes.data);
      setRemedies(remRes.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const findNearbyStores = async (medicine) => {
    if (!user) {
      alert('Please login to find nearby stores');
      window.location.href = '/login';
      return;
    }
    
    if (!user.location) {
      alert('Please update your city in profile to find nearby stores');
      return;
    }
    
    setSelectedMedicine(medicine);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stores/nearby`, {
        params: {
          location: user.location,
          medicineId: medicine.medicine_id
        }
      });
      
      if (res.data.length === 0) {
        alert(`No stores found in ${user.location} with this medicine`);
        return;
      }
      
      setNearbyStores(res.data);
      setActiveTab('stores');
    } catch (error) {
      console.error('Error finding stores:', error);
      alert('Error finding nearby stores');
    }
  };

  const addToCart = async (medicine) => {
    if (!user) {
      alert('Please login to add items to cart');
      window.location.href = '/login';
      return;
    }

    try {
      // First, get or create cart for user
      const cartRes = await axios.get(`${import.meta.env.VITE_API_URL}/cart`);
      let cartId = cartRes.data.cart_id;
      
      if (!cartId) {
        // Create cart if doesn't exist
        const newCartRes = await axios.post(`${import.meta.env.VITE_API_URL}/cart/create`);
        cartId = newCartRes.data.cart_id;
      }

      // Add item to cart
      await axios.post(`${import.meta.env.VITE_API_URL}/cart/items`, {
        medicineId: medicine.medicine_id,
        quantity: 1,
        price: medicine.price
      });

      alert(`${medicine.medicine_name} added to cart!`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding to cart. Please try again.');
    }
  };

  return (
    <div className="container dashboard">
      <h1>Search Your Symptoms</h1>
      
      <div className="search-box">
        <input
          type="text"
          placeholder="Enter symptoms (e.g., headache, सिरदर्द, डोकेदुखी)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && searchSymptoms()}
        />
        <button onClick={searchSymptoms} className="btn btn-primary">
          <Search size={20} />
        </button>
      </div>

      {symptoms.length > 0 && (
        <div className="symptoms-list">
          <h3>Select a symptom:</h3>
          {symptoms.map(symptom => (
            <div key={symptom.symptom_id} className="symptom-card" onClick={() => selectSymptom(symptom)}>
              <h4>{symptom.disease_name} / {symptom.marathi_name} / {symptom.minglish_name}</h4>
              <p>{symptom.symptom_desc}</p>
            </div>
          ))}
        </div>
      )}

      {selectedSymptom && (
        <div className="results">
          <h2>Results for: {selectedSymptom.disease_name}</h2>
          
          <div className="tabs">
            <button 
              className={activeTab === 'medicines' ? 'active' : ''} 
              onClick={() => setActiveTab('medicines')}
            >
              Medicines
            </button>
            <button 
              className={activeTab === 'remedies' ? 'active' : ''} 
              onClick={() => setActiveTab('remedies')}
            >
              Home Remedies
            </button>
            {nearbyStores.length > 0 && (
              <button 
                className={activeTab === 'stores' ? 'active' : ''} 
                onClick={() => setActiveTab('stores')}
              >
                Nearby Stores ({nearbyStores.length})
              </button>
            )}
          </div>

          {activeTab === 'medicines' && (
            <div className="medicines-grid">
              {medicines.map(med => (
                <div key={med.medicine_id} className="medicine-card">
                  <h4>{med.medicine_name}</h4>
                  <span className={`badge ${med.type || 'ayurvedic'}`}>{med.type || 'ayurvedic'}</span>
                  <p><strong>Company:</strong> {med.company_name}</p>
                  <p><strong>Composition:</strong> {med.composition}</p>
                  <p><strong>Price:</strong> ₹{med.price}</p>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => findNearbyStores(med)}
                      style={{ flex: 1 }}
                    >
                      <MapPin size={16} style={{ marginRight: '5px' }} />
                      Find Stores
                    </button>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => addToCart(med)}
                      style={{ flex: 1 }}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'remedies' && (
            <div className="remedies-list">
              {remedies.map(remedy => (
                <div key={remedy.remedy_id} className="remedy-card">
                  <h4>{remedy.remedy_name}</h4>
                  <p><strong>Ingredients:</strong> {remedy.ingredients}</p>
                  <p><strong>Dosage:</strong> {remedy.dosage}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stores' && nearbyStores.length > 0 && (
            <div>
              <h3 style={{ color: 'var(--primary)', marginBottom: '20px' }}>
                Stores with {selectedMedicine?.medicine_name}
              </h3>
              <div className="remedies-list">
                {nearbyStores.map(store => (
                  <div key={store.store_id} className="remedy-card" style={{
                    background: 'rgba(45, 212, 191, 0.1)',
                    border: '1px solid rgba(45, 212, 191, 0.3)'
                  }}>
                    <h4 style={{ color: 'var(--primary)' }}>{store.store_name}</h4>
                    <p><strong>📍 Address:</strong> {store.address}</p>
                    <p><strong>📞 Contact:</strong> {store.contact_no}</p>
                    <p><strong>📌 Location:</strong> {store.location}</p>
                    {store.has_medicine && (
                      <p style={{ color: '#10b981', fontWeight: 'bold' }}>
                        ✅ In Stock ({store.stock} units available)
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
