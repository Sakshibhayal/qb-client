import React, { use, useEffect, useState } from 'react'
import axios from 'axios';
import { IndianRupee, SquarePen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Orders() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [formData, setFormData] = useState({
    itemId: '',
    amount: ''
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/qb/customers");
      const data = response.data;
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const createOrder = async (withInvoice) => {
    const requestBody = {
      qbCustomerId: selectedCustomer ? selectedCustomer.Id : null,
      customerName: selectedCustomer ? selectedCustomer.DisplayName : null,
      customerEmail: selectedCustomer ? selectedCustomer.PrimaryEmailAddr?.Address : null,
      itemId: formData.itemId,
      amount: Number(formData.amount),
    };
    let responseStatus;
    if (withInvoice) {
      try {
        const response = await axios.post("http://localhost:3000/create-order-and-invoice", requestBody);
        const data = response.data;
        responseStatus = response.status;
        console.log("Order created successfully:", data);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
    else {
      try {
        const response = await axios.post("http://localhost:3000/create-order", requestBody);
        const data = response.data;
        responseStatus = response.status;
        console.log("Order created successfully:", data);
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
    if (responseStatus == 201) {
      navigate("/order-list");
    }
  }
  return (
    <div className="bg-light rounded-4 shadow-lg p-4 p-md-5" style={{
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <select
        className="form-select mb-4"
        value={selectedCustomer ? selectedCustomer.Id : ""}
        onChange={(e) => {
          const customer = customers.find(c => c.Id === e.target.value);
          setSelectedCustomer(customer || null);
        }}
      >
        <option value="">Select Customer</option>

        {customers.map((customer) => (
          <option key={customer.Id} value={customer.Id}>
            {customer.DisplayName}
          </option>
        ))}
      </select>

      <div className="mb-3 position-relative">
        <SquarePen size={18} style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          zIndex: 10
        }} />
        <input
          type="text"
          className="form-control"
          name="itemId"
          placeholder="Item ID"
          value={formData.itemId}
          onChange={handleChange}
          style={{
            background: '#e8ecf1',
            border: 'none',
            borderRadius: '10px',
            padding: '15px 20px 15px 45px',
            fontSize: '15px'
          }}
        />
      </div>
      <div className="mb-3 position-relative">
        <IndianRupee size={18} style={{
          position: 'absolute',
          left: '20px',
          top: '50%',
          transform: 'translateY(-50%)',
          color: '#9ca3af',
          zIndex: 10
        }} />
        <input
          type="text"
          className="form-control"
          name="amount"
          placeholder="Amount"
          value={formData.amount}
          onChange={handleChange}
          style={{
            background: '#e8ecf1',
            border: 'none',
            borderRadius: '10px',
            padding: '15px 20px 15px 45px',
            fontSize: '15px'
          }}
        />
      </div>
      <div className="d-flex gap-3">
        <button className="btn w-100 text-white mt-4" onClick={() => createOrder()} style={{ background: 'black', }}>Create Order</button>

            <button className="btn w-100 text-white mt-4" onClick={() => createOrder(true)} style={{ background: 'black'}}>Create Order with Invoice</button>
            </div>
      </div>
  )
}

export default Orders