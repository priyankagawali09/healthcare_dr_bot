import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/cart`);
      setCartItems(res.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
      setCartItems({ items: [] });
    } finally {
      setLoading(false);
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/cart/items/${id}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/cart/items/${itemId}`, {
        quantity: newQuantity
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = async () => {
    if (!cartItems.items || cartItems.items.length === 0) {
      alert('Your cart is empty');
      return;
    }

    // Ask for delivery address
    const address = prompt('Enter your delivery address:');
    if (!address || address.trim() === '') {
      alert('Please enter a valid delivery address');
      return;
    }

    const phone = prompt('Enter your contact number:');
    if (!phone || phone.trim() === '') {
      alert('Please enter a valid phone number');
      return;
    }

    try {
      // Create order
      const orderData = {
        items: cartItems.items.map(item => ({
          medicineId: item.medicine_id,
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: total,
        deliveryAddress: address,
        contactNumber: phone,
        paymentMethod: 'cod'
      };

      const res = await axios.post(`${import.meta.env.VITE_API_URL}/orders`, orderData);
      
      alert('Order placed successfully! Order ID: ' + res.data.orderId);
      
      // Clear cart and redirect to orders
      fetchCart();
      window.location.href = '/orders';
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again.');
    }
  };

  const total = cartItems.items?.reduce((sum, item) => sum + (item.price * item.quantity), 0) || 0;

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1>Shopping Cart</h1>
      
      {!cartItems.items || cartItems.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          {cartItems.items.map(item => (
            <div key={item.item_id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h3>{item.medicine_name}</h3>
                  <p>Company: {item.company_name}</p>
                  <p>Price: ₹{item.price}</p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                    <button 
                      onClick={() => updateQuantity(item.item_id, item.quantity - 1)}
                      className="btn"
                      style={{ padding: '5px 12px', background: 'rgba(45, 212, 191, 0.2)' }}
                    >
                      -
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', minWidth: '30px', textAlign: 'center' }}>
                      {item.quantity}
                    </span>
                    <button 
                      onClick={() => updateQuantity(item.item_id, item.quantity + 1)}
                      className="btn"
                      style={{ padding: '5px 12px', background: 'rgba(45, 212, 191, 0.2)' }}
                    >
                      +
                    </button>
                  </div>
                  
                  <p style={{ marginTop: '10px', fontSize: '20px' }}>
                    <strong>Subtotal: ₹{item.price * item.quantity}</strong>
                  </p>
                </div>
                
                <button 
                  onClick={() => removeItem(item.item_id)} 
                  className="btn" 
                  style={{ background: 'var(--error)', color: 'white', padding: '10px' }}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
          ))}
          
          <div className="card" style={{ background: 'var(--light)' }}>
            <h2>Total: ₹{total.toFixed(2)}</h2>
            <button 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '10px' }}
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
