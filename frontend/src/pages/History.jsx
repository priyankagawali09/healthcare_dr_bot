import { useState, useEffect } from 'react';
import axios from 'axios';
import { Clock, Trash2 } from 'lucide-react';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_URL}/history`);
      setHistory(res.data);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHistory = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/history/${id}`);
      fetchHistory();
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  const clearAllHistory = async () => {
    if (!confirm('Are you sure you want to clear all search history?')) {
      return;
    }
    
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/history/all`);
      fetchHistory();
    } catch (error) {
      console.error('Error clearing history:', error);
    }
  };

  const submitFeedback = async (historyId, rating) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/history/${historyId}/feedback`, {
        rating
      });
      fetchHistory();
      alert('Thank you for your feedback!');
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Error submitting feedback');
    }
  };

  if (loading) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1>
          <Clock size={32} style={{ verticalAlign: 'middle', marginRight: '10px' }} />
          Search History
        </h1>
        {history.length > 0 && (
          <button 
            onClick={clearAllHistory}
            className="btn"
            style={{ background: 'var(--error)', color: 'white' }}
          >
            Clear All
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <p>No search history yet</p>
      ) : (
        history.map(item => (
          <div key={item.history_id} className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '15px' }}>
              <div style={{ flex: 1 }}>
                <h3>{item.disease_name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                  Searched: "{item.search_query}"
                </p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                  {new Date(item.searched_at).toLocaleString()}
                </p>
              </div>
              <button 
                onClick={() => deleteHistory(item.history_id)}
                className="btn"
                style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '8px' }}
              >
                <Trash2 size={20} />
              </button>
            </div>

            {/* Feedback Section */}
            {!item.feedback_rating ? (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <p style={{ marginBottom: '10px', color: 'rgba(255,255,255,0.8)' }}>
                  How helpful was this search?
                </p>
                <div style={{ display: 'flex', gap: '10px' }}>
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      onClick={() => submitFeedback(item.history_id, rating)}
                      className="btn"
                      style={{ 
                        padding: '8px 16px',
                        background: 'rgba(45, 212, 191, 0.1)',
                        border: '1px solid rgba(45, 212, 191, 0.3)'
                      }}
                    >
                      ⭐ {rating}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' }}>
                <p style={{ color: 'var(--primary)', fontWeight: 'bold' }}>
                  Your Rating: {'⭐'.repeat(item.feedback_rating)}
                </p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default History;
