import { useEffect, useState } from "react";
import { Mail, User, Menu, Settings, Phone, House, MapPinHouse, CheckCircle, IndianRupee, SquarePen } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showError } from "./commonFunctions";

function CustomerAndOrders() {

  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [customerData, setCustomerData] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: ''
  });

  const [orderData, setOrderData] = useState({
    itemId: "",
    amount: ""
  });

  const navigate = useNavigate();

  const handleCustomerChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleOrderChange = (e) => {
    setOrderData({
      ...orderData,
      [e.target.name]: e.target.value
    });
  };

  const checkConnection = async () => {
    try {
      const response = await axios.get("http://localhost:3000/auth-status");
      setIsConnected(response.data.connected);
    } catch (err) {
      console.error("Error checking QuickBooks status:", err);
    }
  };

  const connectQuickBooks = async () => {
    const res = await fetch("http://localhost:3000/auth-url");
    const data = await res.json();
    window.location.href = data.url;
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

  // Create Customer
  const createCustomer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/qb/customer", formData);
      const data = response.data;

      if (response.status === 201) {
        setShowSuccess(true);
        setCustomerData(data);
        await fetchCustomers();
        setSelectedCustomer(data.customer);
        setShowCustomerForm(false);
      }else{
        setErrorMessage("Failed to create customer");
      }
    } catch (error) {
        const errorDetail = error?.response.data.error?.Fault?.Error[0].Message || error.response.data.error?.fault?.error[0]?.detail || "Unknown error occurred";
        console.log("error message :", errorDetail)
        setErrorMessage(errorDetail);
    }finally{
      setIsLoading(false); 
    }
  };

  // Create Order
  const createOrder = async (withInvoice) => {
    const finalCustomer = selectedCustomer || customerData?.customer;
    const requestBody = {
      qbCustomerId: selectedCustomer ? selectedCustomer.Id : null,
      customerName: selectedCustomer ? selectedCustomer.DisplayName : null,
      customerEmail: selectedCustomer ? selectedCustomer.PrimaryEmailAddr?.Address : null,
      itemId: orderData.itemId,
      amount: Number(orderData.amount)
    };

    let responseStatus;
    setIsLoading(true);

    try {
      const url = withInvoice ? "http://localhost:3000/create-order-and-invoice" : "http://localhost:3000/create-order";

      const response = await axios.post(url, requestBody);
      responseStatus = response.status;
      if (responseStatus === 201) {
        navigate("/order-list");
      }
    } catch (error) {
      setIsLoading(false);
      const errorDetail = error?.response.data.error?.message || error?.response.data.error?.Fault?.Error[0].Message || "Unknown error occurred";
      setErrorMessage(errorDetail);
    }finally{
      setIsLoading(false); 
    }
  };

  const closeModal = () => {
    setShowSuccess(false);
  };

  useEffect(() => {
    checkConnection();
    fetchCustomers();
  }, []);

  return (
    <div className="bg-light rounded-4 shadow-lg p-4 p-md-5" style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)' }}>
      {errorMessage && showError(errorMessage, () => setErrorMessage(""))}
      {isLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}
        >
          <div
            style={{
              background: "white",
              padding: "40px",
              borderRadius: "10px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <div className="spinner-border" style={{ borderColor: "darkgreen", borderRightColor: "transparent", borderBottomColor: "transparent" }} role="status" />
          </div>
        </div>
      )}

      {showSuccess && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.5)', display: 'flex',
          alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white', borderRadius: '20px', padding: '40px',
            maxWidth: '400px', width: '90%', textAlign: 'center'
          }}>
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 20px',
              background: 'linear-gradient(135deg,#003000,#007b00)',
              borderRadius: '50%', display: 'flex', alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={50} color="white" />
            </div>

            <h3>Success!</h3>
            <p>Customer has been created successfully.</p>

            <button onClick={closeModal} style={{
              background: 'linear-gradient(135deg,#003000,#001a00)',
              border: 'none', padding: '12px 40px', borderRadius: '15px',
              color: 'white'
            }}>
              OK
            </button>
          </div>
        </div>
      )}

      {!isConnected ? <button
        onClick={connectQuickBooks}
        disabled={isConnected}
        className="btn w-100 text-white mb-4"
        style={{ background: 'black', borderRadius: '15px', padding: '15px' }}
      >
        Connect QuickBooks
      </button> :
        <div className="btn w-100 text-white mb-4" style={{ background: 'green', borderRadius: '10px', padding: '15px' }}>
          Connected to QuickBooks!
          </div>
          }

      <div className="d-flex mb-4 gap-3">
        <select
          className="form-select"
          disabled={!isConnected || showCustomerForm}
          value={selectedCustomer?.Id || ""}
          onChange={(e) => {
            const selectedId = e.target.value;
            const cust = customers.find(c => c.Id === selectedId);
            setSelectedCustomer(cust || null);
          }}
        >
          <option value="">Select Customer</option>
          {customers.map(customer => (
            <option key={customer.Id} value={customer.Id}>
              {customer.DisplayName}
            </option>
          ))}
        </select>

        {!showCustomerForm ? <button
          className="btn btn-success"
          disabled={!isConnected}
          style={{ whiteSpace: "nowrap" }}
          onClick={() => {setShowCustomerForm(!showCustomerForm); setSelectedCustomer(null);}}
        >
          + Add Customer
        </button> :
        <button
          className="btn btn-success"
          disabled={!isConnected}
          style={{ whiteSpace: "nowrap" }}
          onClick={() => {setShowCustomerForm(!showCustomerForm); setSelectedCustomer(null);}}
        >
          Select Customer
        </button>}
      </div>

      {showCustomerForm && (
        <div className="mb-5 p-3 rounded-4" style={{ background: "#f8f9fa", border: "1px solid #ddd" }}>
          <h4 className="mb-3">Create Customer</h4>
          <form onSubmit={createCustomer}>
          <div className="mb-3 position-relative">
            <User size={18} style={iconStyle} />
            <input type="text" name="name" placeholder="Customer Name" className="form-control"
              value={formData.name} onChange={handleCustomerChange} style={inputStyle} required />
          </div>

          <div className="mb-3 position-relative">
            <Mail size={18} style={iconStyle} />
            <input type="email" name="email" placeholder="Email" className="form-control"
              value={formData.email} onChange={handleCustomerChange} style={inputStyle} required/>
          </div>

          <div className="mb-3 position-relative">
            <Phone size={18} style={iconStyle} />
            <input type="text" name="phone" placeholder="Phone" className="form-control"
              value={formData.phone} onChange={handleCustomerChange} style={inputStyle} required/>
          </div>

          <div className="mb-3 position-relative">
            <House size={18} style={iconStyle} />
            <input type="text" name="companyName" placeholder="Company Name" className="form-control"
              value={formData.companyName} onChange={handleCustomerChange} style={inputStyle} required />
          </div>

          <div className="mb-3 position-relative">
            <MapPinHouse size={18} style={iconStyle} />
            <input type="text" name="address" placeholder="Address" className="form-control"
              value={formData.address} onChange={handleCustomerChange} style={inputStyle} required/>
          </div>

          <button
            type="submit"
            disabled={!isConnected || isLoading}
            className="btn w-100 text-white"
            style={{ background: "black", borderRadius: "15px", padding: "12px" }}
          >
            Create Customer
          </button>
          </form>
        </div>
      )}

      <h4 className="mb-3 mt-4">Create Order</h4>

      <div className="mb-3 position-relative">
        <SquarePen size={18} style={iconStyle} />
        <input type="text" name="itemId" placeholder="Item ID" className="form-control" disabled={!selectedCustomer}
          value={orderData.itemId} onChange={handleOrderChange} style={inputStyle} />
      </div>

      <div className="mb-3 position-relative">
        <IndianRupee size={18} style={iconStyle} />
        <input type="text" name="amount" placeholder="Amount" className="form-control" disabled={!selectedCustomer}
          value={orderData.amount} onChange={handleOrderChange} style={inputStyle} />
      </div>

      <div className="d-flex gap-3">
        <button className="btn w-100 text-white mt-4" disabled={!selectedCustomer} onClick={() => createOrder(false)} style={{ background: "black" }}>
          Create Order
        </button>

        <button className="btn w-100 text-white mt-4" disabled={!selectedCustomer} onClick={() => createOrder(true)} style={{ background: "black" }}>
          Create Order with Invoice
        </button>
      </div>

    </div>
  );
}

const iconStyle = {
  position: 'absolute',
  left: '20px',
  top: '50%',
  transform: 'translateY(-50%)',
  color: '#9ca3af'
};

const inputStyle = {
  background: '#e8ecf1',
  border: 'none',
  borderRadius: '15px',
  padding: '15px 20px 15px 45px',
  fontSize: '14px'
};

export default CustomerAndOrders;
