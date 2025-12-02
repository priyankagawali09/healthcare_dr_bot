import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', 
    city: '', role: 'user',
    // Doctor fields
    specialization: '', qualification: '', experience: '', consultationFee: '',
    availableDays: '', availableTime: '',
    // Pharmacist fields
    storeName: '', storeAddress: '', licenseNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Register user
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, formData);
      
      // Auto login after registration
      const loginRes = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      // Save token and user data
      localStorage.setItem('token', loginRes.data.token);
      localStorage.setItem('user', JSON.stringify(loginRes.data.user));
      
      // Redirect to dashboard
      alert('Registration successful! Welcome to Healthcare Dr. Bot!');
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '40px' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', color: 'var(--primary)' }}>Create New Account</h2>
        {error && <p style={{ color: 'var(--error)' }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Full Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password (min 6 characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <input
            type="tel"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required={formData.role === 'doctor' || formData.role === 'pharmacist'}
          />
          <select
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            required
          >
            <option value="">Select City</option>
            <option value="Dhule">Dhule</option>
            <option value="Pune">Pune</option>
            <option value="Nashik">Nashik</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Nagpur">Nagpur</option>
          </select>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          >
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="pharmacist">Pharmacist</option>
          </select>

          {/* Doctor specific fields */}
          {formData.role === 'doctor' && (
            <>
              <input
                type="text"
                placeholder="Specialization (e.g., Ayurvedic Physician)"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Qualification (e.g., BAMS, MD)"
                value={formData.qualification}
                onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Years of Experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Consultation Fee (₹)"
                value={formData.consultationFee}
                onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Available Days (e.g., Mon-Sat)"
                value={formData.availableDays}
                onChange={(e) => setFormData({ ...formData, availableDays: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Available Time (e.g., 10:00 AM - 6:00 PM)"
                value={formData.availableTime}
                onChange={(e) => setFormData({ ...formData, availableTime: e.target.value })}
                required
              />
            </>
          )}

          {/* Pharmacist specific fields */}
          {formData.role === 'pharmacist' && (
            <>
              <input
                type="text"
                placeholder="Medical Store Name"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                required
              />
              <textarea
                placeholder="Store Address"
                value={formData.storeAddress}
                onChange={(e) => setFormData({ ...formData, storeAddress: e.target.value })}
                rows="3"
                required
              />
              <input
                type="text"
                placeholder="License Number"
                value={formData.licenseNumber}
                onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
                required
              />
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
            Sign Up
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
