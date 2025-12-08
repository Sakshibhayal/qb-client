import axios from 'axios';
import { SquareUser } from 'lucide-react';
import React, { useEffect, useState } from 'react'

const OrderList = () => {

  const [orders, setOrders] = useState([])
  const fetchOrders = async () => {
    const response = await axios.get("http://localhost:3000/orders");
    const data = response.data;
    setOrders(data.orders || []);
    console.log(data);
  }

  const createInvoice = async(orderId) => {
    try {
      const response = await axios.post(`http://localhost:3000/create-invoices`, orderId );
      const data = response.data;
      console.log("Invoice created successfully:", data);
    } catch (error) {
      console.error('Error creating invoice:', error);
    }
  }

  useEffect(() => {
      fetchOrders();
  }, []);
    
  return (
    <div className="bg-light rounded-4 shadow-lg p-4 p-md-5" style={{
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 className="text-center mb-4" style={{ color: '' }}>Order List</h2>
      {orders.map((order) => (
      <div className="text-white rounded-2 d-flex px-4" style={{ height: "110px", border: "1px solid #333", backgroundColor: '#001f14'}}>

        <div className="col-8 d-flex align-items-center gap-3">
          <SquareUser size={60} style={{ color: '#9ca3af' }} />

          <div className="d-flex flex-column lh-sm">
            <span className="fw-semibold fs-5 text-capitalize">{order.customer_name}</span>
            <span className="text-secondary small">{order.customer_email}</span>
            <span className="text-secondary small">{order.item_id}</span>
            <span className="text-secondary small">{order.amount}</span>
          </div>
        </div>

        <div className="col-4 d-flex align-items-center justify-content-end">
          <button
            onClick={() => createInvoice(order.id)}
            disabled={order.status !== 'pending'}
            className="btn text-black px-4"
            style={{
              background: '#d4af37',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '500'
            }}
          >
            Create Invoice
          </button>
        </div>
      </div>))}

    </div>
  )
}

export default OrderList