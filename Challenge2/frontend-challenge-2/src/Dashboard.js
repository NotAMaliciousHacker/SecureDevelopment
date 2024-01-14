// src/Dashboard.js
import React, { useState, useEffect } from 'react';

const Dashboard = () => {
  const [searchString, setSearchString] = useState('');
  const [orders, setOrders] = useState([]);

  const handleSearchChange = (e) => {
    setSearchString(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:8080/orders/search?productName=${searchString}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const getAllOrders = async () => {
    try {
      const response = await fetch(`http://localhost:8080/orders`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    if(orders.length === 0 && searchString === '') {
      getAllOrders()
    }
  }, [orders])
  

  return (
    <div style={{position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%)`}}>
      <h1>Order Dashboard</h1>
      <input 
        type="text" 
        value={searchString} 
        onChange={handleSearchChange} 
        placeholder="Search for orders"
      />
      <button onClick={handleSearch}>Search</button>

      <div>
        {orders.length > 0 ? (
          <ul>
            {orders.map(order => (
              <li key={order.id}>Product: {order.productName}, Price: {order.price}</li>
            ))}
          </ul>
        ) : (
          <p>No orders to display</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
