import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Calendar, User, Clock, Phone, Mail } from 'lucide-react';

const DoctorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, pending, completed, cancelled

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/doctors/my-appointments`);
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (id, status) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/doctors/appointments/${id}/status`, { status });
      alert(`Appointment ${status} successfully!`);
      fetchAppointments();
    } catch (error) {
      alert('Error updating appointment: ' + (error.response?.data?.message || error.message));
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    return apt.status === filter;
  });

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1>
        <Calendar size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
        My Appointments
      </h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
        Welcome, Dr. {user?.name}!
      </p>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilter('all')}
          className="btn"
          style={{
            background: filter === 'all' ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
            color: filter === 'all' ? 'var(--dark)' : 'white'
          }}
        >
          All ({appointments.length})
        </button>
        <button
          onClick={() => setFilter('pending')}
          className="btn"
          style={{
            background: filter === 'pending' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
            color: filter === 'pending' ? 'var(--dark)' : 'white'
          }}
        >
          Pending ({appointments.filter(a => a.status === 'pending').length})
        </button>
        <button
          onClick={() => setFilter('completed')}
          className="btn"
          style={{
            background: filter === 'completed' ? '#10b981' : 'rgba(255,255,255,0.1)',
            color: filter === 'completed' ? 'white' : 'white'
          }}
        >
          Completed ({appointments.filter(a => a.status === 'completed').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className="btn"
          style={{
            background: filter === 'cancelled' ? '#ef4444' : 'rgba(255,255,255,0.1)',
            color: filter === 'cancelled' ? 'white' : 'white'
          }}
        >
          Cancelled ({appointments.filter(a => a.status === 'cancelled').length})
        </button>
      </div>

      {/* Appointments List */}
      {filteredAppointments.length === 0 ? (
        <div className="card">
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
            No {filter !== 'all' ? filter : ''} appointments found
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '20px' }}>
          {filteredAppointments.map(apt => (
            <div key={apt.consultation_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>
                    <User size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
                    {apt.patient_name}
                  </h3>
                  <p style={{ marginBottom: '5px' }}>
                    <Mail size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    {apt.patient_email}
                  </p>
                  {apt.patient_phone && (
                    <p style={{ marginBottom: '5px' }}>
                      <Phone size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                      {apt.patient_phone}
                    </p>
                  )}
                </div>
                <div style={{
                  padding: '5px 15px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  background: apt.status === 'pending' ? 'rgba(251, 191, 36, 0.2)' :
                             apt.status === 'completed' ? 'rgba(16, 185, 129, 0.2)' :
                             'rgba(239, 68, 68, 0.2)',
                  color: apt.status === 'pending' ? '#fbbf24' :
                        apt.status === 'completed' ? '#10b981' :
                        '#ef4444'
                }}>
                  {apt.status.toUpperCase()}
                </div>
              </div>

              <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '15px', borderRadius: '12px', marginBottom: '15px' }}>
                <p style={{ marginBottom: '8px' }}>
                  <Calendar size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  <strong>Date:</strong> {new Date(apt.appointment_date).toLocaleDateString('en-IN')}
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <Clock size={16} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                  <strong>Time:</strong> {apt.appointment_time}
                </p>
                <p style={{ marginBottom: '8px' }}>
                  <strong>Consultation Fee:</strong> ₹{apt.consultation_fee}
                </p>
                <p>
                  <strong>Symptoms:</strong> {apt.symptoms}
                </p>
              </div>

              {apt.status === 'pending' && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => updateAppointmentStatus(apt.consultation_id, 'completed')}
                    className="btn"
                    style={{ flex: 1, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}
                  >
                    Mark Completed
                  </button>
                  <button
                    onClick={() => updateAppointmentStatus(apt.consultation_id, 'cancelled')}
                    className="btn"
                    style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
