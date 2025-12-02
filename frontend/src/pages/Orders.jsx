import { useState, useEffect } from 'react';
import axios from 'axios';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
    fetchAppointments();
  }, []);

  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState('orders');

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAppointments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/consultations`);
      setAppointments(res.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const cancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/orders/${orderId}/cancel`);
      alert('Order cancelled successfully');
      fetchOrders();
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert('Error cancelling order. Please try again.');
    }
  };

  const cancelAppointment = async (appointmentId) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) {
      return;
    }

    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/consultations/${appointmentId}/cancel`);
      alert('Appointment cancelled successfully');
      fetchAppointments();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      alert('Error cancelling appointment. Please try again.');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1>My Orders & Appointments</h1>
      
      <div style={{ display: 'flex', gap: '15px', marginBottom: '30px' }}>
        <button 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('orders')}
          style={{ padding: '12px 30px' }}
        >
          Medicine Orders ({orders.length})
        </button>
        <button 
          className={`btn ${activeTab === 'appointments' ? 'btn-primary' : ''}`}
          onClick={() => setActiveTab('appointments')}
          style={{ padding: '12px 30px' }}
        >
          Doctor Appointments ({appointments.length})
        </button>
      </div>

      {activeTab === 'orders' && (
        <>
          {orders.length === 0 ? (
            <p>No orders yet</p>
          ) : (
        orders.map(order => (
          <div key={order.order_id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3>Order #{order.order_id}</h3>
                <p>Amount: ₹{order.total_amount}</p>
                <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                {order.delivery_address && (
                  <p><strong>Delivery Address:</strong> {order.delivery_address}</p>
                )}
                {order.contact_number && (
                  <p><strong>Contact:</strong> {order.contact_number}</p>
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                <span className="badge" style={{ 
                  background: order.status === 'delivered' ? '#10b981' : 
                             order.status === 'cancelled' ? '#ef4444' : 
                             'var(--warning)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '20px'
                }}>
                  {order.status}
                </span>
                
                {order.status === 'pending' && (
                  <button 
                    onClick={() => cancelOrder(order.order_id)}
                    className="btn"
                    style={{ background: 'var(--error)', color: 'white', padding: '8px 16px' }}
                  >
                    Cancel Order
                  </button>
                )}
              </div>
            </div>
            
            {order.items && order.items.length > 0 && (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <h4 style={{ marginBottom: '10px', color: 'var(--primary)' }}>Items:</h4>
                {order.items.map(item => (
                  <div key={item.order_item_id} style={{ 
                    padding: '8px', 
                    background: 'rgba(45, 212, 191, 0.05)',
                    borderRadius: '8px',
                    marginBottom: '8px'
                  }}>
                    <p><strong>{item.medicine_name}</strong> ({item.company_name})</p>
                    <p>Quantity: {item.quantity} × ₹{item.price} = ₹{item.quantity * item.price}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))
          )}
        </>
      )}

      {activeTab === 'appointments' && (
        <>
          {appointments.length === 0 ? (
            <p>No appointments yet</p>
          ) : (
            appointments.map(appointment => (
              <div key={appointment.consultation_id} className="card">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                  <div style={{ flex: 1 }}>
                    <h3>Appointment #{appointment.consultation_id}</h3>
                    <p><strong>Doctor:</strong> {appointment.doctor_name}</p>
                    <p><strong>Specialization:</strong> {appointment.specialization}</p>
                    <p><strong>Date:</strong> {new Date(appointment.appointment_date).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {appointment.appointment_time}</p>
                    <p><strong>Symptoms:</strong> {appointment.symptoms}</p>
                    <p><strong>Fee:</strong> ₹{appointment.consultation_fee}</p>
                    <p><strong>Contact:</strong> {appointment.doctor_phone}</p>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'flex-end' }}>
                    <span className="badge" style={{ 
                      background: appointment.status === 'completed' ? '#10b981' : 
                                 appointment.status === 'cancelled' ? '#ef4444' : 
                                 appointment.status === 'confirmed' ? '#3b82f6' :
                                 'var(--warning)',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '20px'
                    }}>
                      {appointment.status}
                    </span>
                    
                    {appointment.status === 'pending' && (
                      <button 
                        onClick={() => cancelAppointment(appointment.consultation_id)}
                        className="btn"
                        style={{ background: 'var(--error)', color: 'white', padding: '8px 16px' }}
                      >
                        Cancel Appointment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default Orders;
