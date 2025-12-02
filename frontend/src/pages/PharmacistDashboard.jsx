import { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const PharmacistDashboard = () => {
  const { user } = useContext(AuthContext);
  const [medicines, setMedicines] = useState([]);
  const [stores, setStores] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [pharmacyId, setPharmacyId] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    type: 'ayurvedic',
    company: '',
    composition: '',
    price: ''
  });
  const [formData, setFormData] = useState({
    medicineId: '',
    stockQuantity: '',
    expiryDate: '',
    price: ''
  });

  useEffect(() => {
    fetchMedicines();
    fetchUserStore();
  }, []);

  useEffect(() => {
    if (pharmacyId) {
      fetchInventory();
    }
  }, [pharmacyId]);

  const fetchMedicines = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/medicines`);
      setMedicines(res.data);
    } catch (error) {
      console.error('Error fetching medicines:', error);
    }
  };

  const fetchUserStore = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stores/my-store`);
      if (res.data) {
        setStores([res.data]);
        setPharmacyId(res.data.store_id);
      }
    } catch (error) {
      console.error('Error fetching store:', error);
    }
  };

  const addNewMedicine = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/medicines`, newMedicine);
      alert('New medicine added successfully!');
      setAddingNew(false);
      setNewMedicine({ name: '', type: 'ayurvedic', company: '', composition: '', price: '' });
      fetchMedicines();
      // Auto-select the new medicine
      setFormData({ ...formData, medicineId: res.data.medicineId });
    } catch (error) {
      alert('Error adding medicine: ' + (error.response?.data?.message || error.message));
    }
  };

  const fetchInventory = async () => {
    if (!pharmacyId) return;
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/stores/${pharmacyId}/inventory`);
      setInventory(res.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  useEffect(() => {
    if (pharmacyId) {
      fetchInventory();
    }
  }, [pharmacyId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!pharmacyId) {
      alert('Please select your store first');
      return;
    }
    try {
      if (editingItem) {
        // Update existing inventory
        await axios.put(`${import.meta.env.VITE_API_URL}/stores/inventory/${editingItem.inventory_id}`, {
          stockQuantity: formData.stockQuantity,
          expiryDate: formData.expiryDate,
          price: formData.price,
          isAvailable: formData.isAvailable
        });
        alert('Inventory updated successfully');
        setEditingItem(null);
      } else {
        // Add new inventory
        await axios.post(`${import.meta.env.VITE_API_URL}/stores/inventory`, {
          ...formData,
          storeId: pharmacyId
        });
        alert('Medicine added to inventory successfully');
      }
      setFormData({ medicineId: '', stockQuantity: '', expiryDate: '', price: '', isAvailable: true });
      fetchInventory();
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message));
    }
  };

  const editInventory = (item) => {
    setEditingItem(item);
    setFormData({
      medicineId: item.medicine_id,
      stockQuantity: item.stock_quantity,
      expiryDate: item.expiry_date.split('T')[0],
      price: item.price || '',
      isAvailable: item.is_available
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setFormData({ medicineId: '', stockQuantity: '', expiryDate: '', price: '', isAvailable: true });
  };

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h1>Pharmacist Dashboard</h1>
      <p style={{ textAlign: 'center', marginBottom: '30px', color: 'rgba(255,255,255,0.7)' }}>
        Welcome, {user?.name}!
      </p>
      
      {stores.length > 0 ? (
        <div className="card">
          <h2>Your Store</h2>
          <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '15px', borderRadius: '12px' }}>
            <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>
              {stores[0].store_name}
            </h3>
            <p><strong>Location:</strong> {stores[0].location}</p>
            <p><strong>Contact:</strong> {stores[0].contact_no}</p>
            <p><strong>Address:</strong> {stores[0].address}</p>
          </div>
        </div>
      ) : (
        <div className="card">
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            No store found. Please contact admin to create your store.
          </p>
        </div>
      )}

      {pharmacyId && (
        <>
          {/* Add New Medicine Section */}
          {addingNew && (
            <div className="card">
              <h2>Add New Medicine to Database</h2>
              <form onSubmit={addNewMedicine}>
                <input
                  type="text"
                  placeholder="Medicine Name *"
                  value={newMedicine.name}
                  onChange={(e) => setNewMedicine({ ...newMedicine, name: e.target.value })}
                  required
                />
                <select
                  value={newMedicine.type}
                  onChange={(e) => setNewMedicine({ ...newMedicine, type: e.target.value })}
                  required
                >
                  <option value="ayurvedic">Ayurvedic</option>
                  <option value="allopathic">Allopathic</option>
                </select>
                <input
                  type="text"
                  placeholder="Company Name *"
                  value={newMedicine.company}
                  onChange={(e) => setNewMedicine({ ...newMedicine, company: e.target.value })}
                  required
                />
                <textarea
                  placeholder="Composition/Ingredients"
                  value={newMedicine.composition}
                  onChange={(e) => setNewMedicine({ ...newMedicine, composition: e.target.value })}
                  rows="3"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="MRP Price (₹)"
                  value={newMedicine.price}
                  onChange={(e) => setNewMedicine({ ...newMedicine, price: e.target.value })}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                    Add Medicine
                  </button>
                  <button 
                    type="button" 
                    onClick={() => setAddingNew(false)}
                    className="btn"
                    style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="card">
            <h2>{editingItem ? 'Edit Inventory' : 'Add Medicine to Inventory'}</h2>
            {editingItem && (
              <div style={{ background: 'rgba(45, 212, 191, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                  Editing: {editingItem.medicine_name}
                </p>
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <select
                    value={formData.medicineId}
                    onChange={(e) => setFormData({ ...formData, medicineId: e.target.value })}
                    required
                    disabled={editingItem}
                  >
                    <option value="">Select Medicine</option>
                    {medicines.map(med => (
                      <option key={med.medicine_id} value={med.medicine_id}>
                        {med.medicine_name} - {med.type} ({med.company_name})
                      </option>
                    ))}
                  </select>
                </div>
                {!editingItem && (
                  <button
                    type="button"
                    onClick={() => setAddingNew(true)}
                    className="btn btn-secondary"
                    style={{ marginBottom: '15px', whiteSpace: 'nowrap' }}
                  >
                    + New Medicine
                  </button>
                )}
              </div>
              <input
                type="number"
                placeholder="Stock Quantity"
                value={formData.stockQuantity}
                onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                required
              />
              <input
                type="date"
                placeholder="Expiry Date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
              <input
                type="number"
                step="0.01"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
              
              {editingItem && (
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'rgba(255,255,255,0.8)' }}>
                    <input
                      type="checkbox"
                      checked={formData.isAvailable}
                      onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                      style={{ width: 'auto' }}
                    />
                    Available for Sale
                  </label>
                </div>
              )}

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                  {editingItem ? 'Update Inventory' : 'Add to Inventory'}
                </button>
                {editingItem && (
                  <button 
                    type="button" 
                    onClick={cancelEdit}
                    className="btn"
                    style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="card">
            <h2>Active Medicines ({inventory.filter(i => i.is_available).length})</h2>
            {inventory.filter(i => i.is_available).length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>No active medicines</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {inventory.filter(i => i.is_available).map(item => (
                  <div key={item.inventory_id} style={{ 
                    background: 'rgba(45, 212, 191, 0.1)', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{item.medicine_name}</h3>
                      <p>Type: <span style={{ color: 'var(--accent)' }}>{item.type}</span></p>
                      <p>Company: {item.company_name}</p>
                      <p>Stock: <strong>{item.stock_quantity}</strong> units</p>
                      <p>Price: <strong>₹{item.price || 'N/A'}</strong></p>
                      <p>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
                    </div>
                    <button
                      onClick={() => editInventory(item)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px' }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {inventory.filter(i => !i.is_available).length > 0 && (
            <div className="card">
              <h2>Inactive Medicines ({inventory.filter(i => !i.is_available).length})</h2>
              <div style={{ display: 'grid', gap: '15px' }}>
                {inventory.filter(i => !i.is_available).map(item => (
                  <div key={item.inventory_id} style={{ 
                    background: 'rgba(239, 68, 68, 0.1)', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: '#ef4444', marginBottom: '8px' }}>{item.medicine_name}</h3>
                      <p>Type: {item.type}</p>
                      <p>Company: {item.company_name}</p>
                      <p>Stock: <strong>{item.stock_quantity}</strong> units</p>
                      <p>Price: <strong>₹{item.price || 'N/A'}</strong></p>
                      <p>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
                      <p style={{ color: '#ef4444', fontWeight: 'bold' }}>❌ Out of Stock</p>
                    </div>
                    <button
                      onClick={() => editInventory(item)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px' }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card" style={{ display: 'none' }}>
            <h2>All Inventory</h2>
            {inventory.length === 0 ? (
              <p style={{ color: 'rgba(255,255,255,0.6)' }}>No medicines in inventory yet</p>
            ) : (
              <div style={{ display: 'grid', gap: '15px' }}>
                {inventory.map(item => (
                  <div key={item.inventory_id} style={{ 
                    background: 'rgba(45, 212, 191, 0.1)', 
                    padding: '15px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(45, 212, 191, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ color: 'var(--primary)', marginBottom: '8px' }}>{item.medicine_name}</h3>
                      <p>Type: <span style={{ color: 'var(--accent)' }}>{item.type}</span></p>
                      <p>Company: {item.company_name}</p>
                      <p>Stock: <strong>{item.stock_quantity}</strong> units</p>
                      <p>Price: <strong>₹{item.price || 'N/A'}</strong></p>
                      <p>Expiry: {new Date(item.expiry_date).toLocaleDateString()}</p>
                      <p>Status: <span style={{ 
                        color: item.is_available ? '#10b981' : '#ef4444',
                        fontWeight: 'bold'
                      }}>
                        {item.is_available ? 'Available' : 'Out of Stock'}
                      </span></p>
                    </div>
                    <button
                      onClick={() => editInventory(item)}
                      className="btn btn-secondary"
                      style={{ padding: '8px 16px' }}
                    >
                      Edit
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default PharmacistDashboard;
