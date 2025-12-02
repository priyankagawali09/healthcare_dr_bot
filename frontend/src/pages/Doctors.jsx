import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Stethoscope, Star, Calendar } from 'lucide-react';

const Doctors = () => {
  const { user } = useContext(AuthContext);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    symptoms: '',
    date: '',
    time: ''
  });
  const [feedbackDoctor, setFeedbackDoctor] = useState(null);
  const [feedback, setFeedback] = useState({ rating: 5, review: '' });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors`);
      setDoctors(res.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBookingForm = (doctor) => {
    setSelectedDoctor(doctor);
    setBookingForm({ symptoms: '', date: '', time: '' });
  };

  const closeBookingForm = () => {
    setSelectedDoctor(null);
    setBookingForm({ symptoms: '', date: '', time: '' });
  };

  const bookConsultation = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/doctors/consultations`, {
        doctorId: selectedDoctor.doctor_id,
        appointmentDate: bookingForm.date,
        appointmentTime: bookingForm.time,
        symptoms: bookingForm.symptoms,
        consultationFee: selectedDoctor.consultation_fee
      });

      alert(`Consultation booked successfully!\nBooking ID: ${res.data.consultationId}\nDoctor: ${selectedDoctor.name}\nFor more enquiry contact: ${selectedDoctor.phone}`);
      closeBookingForm();
    } catch (error) {
      console.error('Error booking consultation:', error);
      alert('Error booking consultation: ' + (error.response?.data?.message || error.message));
    }
  };

  const openFeedbackForm = (doctor) => {
    setFeedbackDoctor(doctor);
    setFeedback({ rating: 5, review: '' });
  };

  const closeFeedbackForm = () => {
    setFeedbackDoctor(null);
    setFeedback({ rating: 5, review: '' });
  };

  const submitFeedback = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/doctors/${feedbackDoctor.doctor_id}/feedback`, {
        rating: feedback.rating,
        reviewText: feedback.review
      });

      alert('Thank you for your feedback!');
      closeFeedbackForm();
      fetchDoctors(); // Refresh to show updated rating
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback. Please try again.');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1>
        <Stethoscope size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
        Consult Doctors
      </h1>
      <p style={{ marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
        Book online consultation with experienced doctors
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {doctors.map(doctor => (
          <div key={doctor.doctor_id} className="card">
            <div style={{ marginBottom: '15px' }}>
              <h3 style={{ color: 'var(--primary)', marginBottom: '5px' }}>{doctor.name}</h3>
              <p style={{ color: 'var(--accent)', fontWeight: 'bold' }}>{doctor.specialization}</p>
              <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.7)' }}>{doctor.qualification}</p>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <p><strong>Experience:</strong> {doctor.experience_years} years</p>
              <p><strong>City:</strong> {doctor.city}</p>
              <p><strong>Available:</strong> {doctor.available_days}</p>
              <p><strong>Timing:</strong> {doctor.available_time}</p>
              <p style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <Star size={16} fill="gold" color="gold" />
                <strong>{doctor.rating}</strong>
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
              <p style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '10px' }}>
                ₹{doctor.consultation_fee}
              </p>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => openBookingForm(doctor)}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  <Calendar size={16} style={{ marginRight: '5px' }} />
                  Book
                </button>
                <button 
                  onClick={() => openFeedbackForm(doctor)}
                  className="btn btn-secondary"
                  style={{ flex: 1 }}
                >
                  ⭐ Rate
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking Modal */}
      {selectedDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Book Consultation</h2>
            
            <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary)' }}>{selectedDoctor.name}</h3>
              <p>{selectedDoctor.specialization}</p>
              <p><strong>Fee:</strong> ₹{selectedDoctor.consultation_fee}</p>
              <p><strong>Available:</strong> {selectedDoctor.available_days}</p>
              <p><strong>Timing:</strong> {selectedDoctor.available_time}</p>
              <p><strong>Contact:</strong> {selectedDoctor.phone}</p>
            </div>

            <form onSubmit={bookConsultation}>
              <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
                Describe your symptoms *
              </label>
              <textarea
                value={bookingForm.symptoms}
                onChange={(e) => setBookingForm({ ...bookingForm, symptoms: e.target.value })}
                placeholder="Please describe your symptoms in detail..."
                rows="4"
                required
                style={{ resize: 'vertical' }}
              />

              <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
                Preferred Date *
              </label>
              <input
                type="date"
                value={bookingForm.date}
                onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                required
              />

              <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
                Preferred Time *
              </label>
              <input
                type="time"
                value={bookingForm.time}
                onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })}
                required
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Confirm Booking
                </button>
                <button 
                  type="button" 
                  onClick={closeBookingForm}
                  className="btn"
                  style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackDoctor && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h2 style={{ marginBottom: '20px' }}>Rate Doctor</h2>
            
            <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3 style={{ color: 'var(--primary)' }}>{feedbackDoctor.name}</h3>
              <p>{feedbackDoctor.specialization}</p>
            </div>

            <form onSubmit={submitFeedback}>
              <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '10px', display: 'block' }}>
                Rating *
              </label>
              <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFeedback({ ...feedback, rating: star })}
                    style={{
                      padding: '10px 20px',
                      background: feedback.rating >= star ? 'linear-gradient(135deg, #f59e0b, #d97706)' : 'rgba(255,255,255,0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '24px'
                    }}
                  >
                    ⭐
                  </button>
                ))}
              </div>

              <label style={{ color: 'rgba(255,255,255,0.8)', marginBottom: '5px', display: 'block' }}>
                Review (Optional)
              </label>
              <textarea
                value={feedback.review}
                onChange={(e) => setFeedback({ ...feedback, review: e.target.value })}
                placeholder="Share your experience..."
                rows="4"
                style={{ resize: 'vertical' }}
              />

              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  Submit Feedback
                </button>
                <button 
                  type="button" 
                  onClick={closeFeedbackForm}
                  className="btn"
                  style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
