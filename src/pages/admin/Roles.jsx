import React, { useState } from 'react';
import Button from '../../components/common/Button.jsx';
import './roles.css';

const Roles = () => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://canteen.fardindev.me/api/v1/users/roles-update?email=${email.toLowerCase()}&role=${role.toLowerCase()}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const result = await response.json();
        setMessage(`${result.data.name}'s Role has updated to: ${result.data.role}`);
      } else {
        setMessage('Failed to update role');
      }
    } catch (error) {
      setMessage('Error: ' + error.message);
    }
  };

  return (
    <div className="roles-container">
      <div className="roles-wrapper">
        <form className="roles-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="role">Role:</label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
            </select>
          </div>
          <Button label="Update Role" type="submit" className="form-button" />
        </form>
        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
};

export default Roles;
