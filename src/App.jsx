import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Orders from "./Orders";
import Home from "./Home";
import OrderList from "./OrderList";
import InvoiceList from "./InvoiceList";
import CustomerAndOrders from "./Customerorders";
function App() {
  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{
      background: 'linear-gradient(135deg, #003000 0%, #001a00 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        left: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0 50px 50px 0'
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        top: '30%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0 50px 50px 0'
      }} />
      <div style={{
        position: 'absolute',
        left: 0,
        top: '70%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '80px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '0 50px 50px 0'
      }} />

      <div style={{
        position: 'absolute',
        right: 0,
        top: '40%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '150px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50px 0 0 50px'
      }} />
      <div style={{
        position: 'absolute',
        right: 0,
        top: '60%',
        transform: 'translateY(-50%)',
        width: '50px',
        height: '100px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '50px 0 0 50px'
      }} />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            <Routes>
              <Route path="/" element={<CustomerAndOrders />} />
              {/* <Route path="/create-order" element={<Orders />} /> */}
              <Route path="/order-list" element={<OrderList />} />
              <Route path="/invoices" element={<InvoiceList/>} />
              {/* <Route path="*" element={<NotFound />} /> */}
            </Routes>
          </div>
        </div>
      </div>
    </div>
    
  );

}

export default App;

