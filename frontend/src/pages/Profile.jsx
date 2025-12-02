import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { User, MapPin, Mail, Phone, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const { user, login } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        location: user.location || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/profile`, formData);
      
      // Update user in context
      const updatedUser = { ...user, ...formData };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      login(localStorage.getItem('token'), updatedUser);
      
      alert('Profile updated successfully!');
      setEditing(false);
    } catch (error) {
      alert('Error updating profile: ' + (error.response?.data?.message || error.message));
    }
  };

  if (!user) {
    return (
      <div className="container" style={{ marginTop: '60px', textAlign: 'center' }}>
        <h2>Please login to view profile</h2>
      </div>
    );
  }

  return (
    <div className="container" style={{ marginTop: '60px', maxWidth: '600px' }}>
      <button 
        onClick={() => navigate('/dashboard')} 
        className="btn" 
        style={{ marginBottom: '20px', background: 'rgba(45, 212, 191, 0.1)', color: 'var(--primary)' }}
      >
        <ArrowLeft size={18} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
        Back to Dashboard
      </button>
      
      <div className="card">
        <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>
          <User size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          My Profile
        </h1>

        {!editing ? (
          <div>
            <div style={{ marginBottom: '20px', padding: '15px', background: 'rgba(45, 212, 191, 0.1)', borderRadius: '12px' }}>
              <p style={{ marginBottom: '10px' }}>
                <User size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>Name:</strong> {user.name}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <Mail size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>Email:</strong> {user.email}
              </p>
              <p style={{ marginBottom: '10px' }}>
                <MapPin size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>City:</strong> {user.location || 'Not set'}
              </p>
              <p>
                <Phone size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                <strong>Phone:</strong> {user.phone || 'Not set'}
              </p>
            </div>
            
            <button 
              onClick={() => setEditing(true)} 
              className="btn btn-primary" 
              style={{ width: '100%' }}
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
              Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />

            <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
              City
            </label>
            <select
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            >
              <option value="">Select City</option>
              <option value="Dhule">Dhule</option>
              <option value="Pune">Pune</option>
              <option value="Nashik">Nashik</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Nagpur">Nagpur</option>
            </select>

            <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
              Phone Number
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="Enter phone number"
            />

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setEditing(false)} 
                className="btn" 
                style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
