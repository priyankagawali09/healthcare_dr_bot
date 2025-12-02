import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ShoppingCart, User, LogOut } from 'lucide-react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="logo">
          🌿 Healthcare Dr. Bot
        </Link>
        
        <div className="nav-links">
          {user && user.role === 'user' && (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/doctors">Doctors</Link>
            </>
          )}
          
          {user ? (
            <>
              {user.role === 'user' && (
                <>
                  <Link to="/cart"><ShoppingCart size={20} /></Link>
                  <Link to="/orders">Orders</Link>
                  <Link to="/history">History</Link>
                  <Link to="/profile"><User size={20} /></Link>
                </>
              )}
              {user.role === 'pharmacist' && (
                <Link to="/pharmacist">My Pharmacy</Link>
              )}
              <span className="user-name">{user.name}</span>
              <button onClick={logout} className="btn-icon">
                <LogOut size={20} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
