import { useEffect, useState } from "react";
import { Mail, User, Menu, Settings, Phone, House, MapPinHouse, CheckCircle } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import axios from "axios";
function Home() {

  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [resendEmail, setResendEmail] = useState({});
  const [customerData, setCustomerData] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  
  const [isConnected, setIsConnected] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    companyName: '',
    address: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
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

  const createCustomer = async(e) => {
    e.preventDefault();
    console.log("form data :", formData)
    try {
    const response = await axios.post("http://localhost:3000/qb/customer", formData )
    const data = response.data;
    console.log("response data :", response , "data ",data)
    if (data.customer.Active === true) {
      setShowSuccess(true);
      // setTimeout(() => setShowSuccess(false), 3000);
    }
    console.log("result :", data)
    setCustomerData(data);
  } catch (error) {
    console.error('Error creating customer:', error); 
  }
  };

   const closeModal = () => {
    setShowSuccess(false);
    navigate("/create-order")
  };

  useEffect(() => {
    checkConnection();
  }, []);

  const createInvoice = async () => {
    const res = await fetch("http://localhost:3000/create-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        customerId,
        itemId,
        amount: Number(amount)
      })
    });
    const data = await res.json();
    setInvoice(data);
  };

  const sendInvoiceEmail = async () => {
    const res = await fetch("http://localhost:3000/send-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        invoiceId: invoice.Invoice.Id,
        email: email
      })
    });

    const data = await res.json();
    setEmailStatus(data.message || "Email sent!");
  };

  const fetchInvoices = async () => {
    const res = await fetch("http://localhost:3000/invoices");
    const data = await res.json();
    setInvoices(data);
  };

  const resendInvoice = async (invoiceId, email) => {
    const res = await fetch("http://localhost:3000/resend-invoice", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ invoiceId, email })
    });

    const data = await res.json();
    alert(data.message);
  };

  return (
    <div className="bg-light rounded-4 shadow-lg p-4 p-md-5" style={{
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(5px)'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '40px',
            maxWidth: '400px',
            width: '90%',
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}>
            {/* Success Icon */}
            <div style={{
              width: '80px',
              height: '80px',
              margin: '0 auto 20px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #003000 0%, #007b00 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CheckCircle size={50} color="white" strokeWidth={2.5} />
            </div>

            {/* Success Message */}
            <h3 style={{
              color: '#5a5a5a',
              fontWeight: '600',
              fontSize: '24px',
              marginBottom: '10px'
            }}>
              Success!
            </h3>

            <p style={{
              color: '#9ca3af',
              fontSize: '16px',
              marginBottom: '25px'
            }}>
              Customer has been created successfully.
            </p>

            {/* OK Button */}
            <button
              onClick={closeModal}
              style={{
                background: 'linear-gradient(135deg, #003000 0%, #001a00 100%)',
                border: 'none',
                borderRadius: '15px',
                color: 'white',
                padding: '12px 40px',
                fontSize: '16px',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              OK
            </button>
          </div>
        </div>
      )
      }
      <div className="row align-items-center">
        {/* Illustration Section */}
        <div className="col-md-5 mb-4 mb-md-0">
          <button className="btn w-100 text-white"
            onClick={connectQuickBooks}
            disabled={isConnected}
            style={{
              background: 'black',
              border: 'none',
              borderRadius: '15px',
              padding: '15px 40px',
              fontSize: '16px',
              transition: 'all 0.3s',

            }}
          >
            Connect QuickBooks
          </button>
          <div className="position-relative d-flex align-items-center justify-content-center" style={{
            padding: '40px',
            minHeight: '300px'
          }}>
            {/* Decorative elements */}
            <div style={{ position: 'absolute', top: '10%', left: '15%', color: '#4fc3f7', fontSize: '20px', fontWeight: 'bold' }}>+</div>
            <div style={{ position: 'absolute', top: '15%', right: '20%', color: '#66bb6a', fontSize: '20px', fontWeight: 'bold' }}>+</div>
            <div style={{ position: 'absolute', top: '20%', left: '30%', width: '10px', height: '10px', border: '2px solid #ff6b9d', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '35%', left: '10%', width: '10px', height: '10px', border: '2px solid #ff6b9d', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '20%', right: '15%', width: '10px', height: '10px', border: '2px solid #66bb6a', borderRadius: '50%' }} />
            <div style={{ position: 'absolute', bottom: '10%', left: '25%', color: '#ffd54f', fontSize: '20px', fontWeight: 'bold' }}>+</div>
            <div style={{ position: 'absolute', bottom: '45%', right: '10%', color: '#4fc3f7', fontSize: '20px', fontWeight: 'bold' }}>+</div>

            {/* Phone Illustration */}
            <div style={{ position: 'relative', width: '200px', height: '200px' }}>
              {/* Chat bubble */}
              <div style={{
                position: 'absolute',
                top: '15%',
                left: '-10%',
                width: '60px',
                height: '50px',
                background: '#4fc3f7',
                borderRadius: '50% 50% 50% 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                zIndex: 3
              }}>
                <Menu size={20} />
              </div>

              {/* Yellow circle */}
              <div style={{
                position: 'absolute',
                top: '20%',
                left: '10%',
                width: '40px',
                height: '40px',
                background: '#ffd54f',
                borderRadius: '50%',
                zIndex: 1
              }} />

              {/* Email icon */}
              <div style={{
                position: 'absolute',
                top: '25%',
                right: '-5%',
                width: '50px',
                height: '35px',
                background: '#ffd54f',
                borderRadius: '8px',
                zIndex: 3
              }}>
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: 0,
                  height: 0,
                  borderLeft: '25px solid transparent',
                  borderRight: '25px solid transparent',
                  borderTop: '20px solid #ffab40'
                }} />
              </div>

              {/* Phone base */}
              <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '120px',
                height: '100px',
                background: 'linear-gradient(180deg, #667eea 0%, #5a67d8 100%)',
                borderRadius: '15px 15px 20px 20px',
                zIndex: 2
              }}>
                {/* Phone top */}
                <div style={{
                  position: 'absolute',
                  top: '-15px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '100px',
                  height: '30px',
                  background: 'linear-gradient(90deg, #ff6b9d 0%, #ff4d7d 100%)',
                  borderRadius: '20px 20px 0 0'
                }} />

                {/* Phone circle */}
                <div style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '30px',
                  height: '30px',
                  background: 'white',
                  borderRadius: '50%',
                  marginTop: '5px'
                }} />

                {/* Phone line */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '60px',
                  height: '4px',
                  background: 'rgba(255, 255, 255, 0.3)',
                  borderRadius: '2px'
                }} />
              </div>

              {/* Gears */}
              <Settings size={35} style={{
                position: 'absolute',
                bottom: '15%',
                left: '10%',
                color: '#ff6b9d',
                zIndex: 3
              }} />
              <Settings size={28} style={{
                position: 'absolute',
                bottom: '20%',
                left: '25%',
                color: '#66bb6a',
                zIndex: 3
              }} />
            </div>
          </div>
        </div>

        {/* Form Section */}
        <div className="col-md-7">
          <div className="px-md-3">
            <h2 className="text-center mb-4" style={{ color: '#5a5a5a', fontWeight: '600' }}>
              Customer Details
            </h2>

            <div>
              <div className="mb-3 position-relative">
                <User size={18} style={{
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
                  name="name"
                  placeholder="Customer Name"
                  value={formData.name}
                  onChange={handleChange}
                  style={{
                    background: '#e8ecf1',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 20px 15px 45px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div className="mb-3 position-relative">
                <Mail size={18} style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 10
                }} />
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  style={{
                    background: '#e8ecf1',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 20px 15px 45px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div className="mb-3 position-relative">
                <Phone size={18} style={{
                  position: 'absolute',
                  left: '20px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#9ca3af',
                  zIndex: 10
                }} />
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleChange}
                  style={{
                    background: '#e8ecf1',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 20px 15px 45px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div className="mb-3 position-relative">
                <House size={18} style={{
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
                  name="companyName"
                  placeholder='Company Name'
                  value={formData.companyName}
                  onChange={handleChange}
                  style={{
                    background: '#e8ecf1',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 20px 15px 45px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div className="mb-3 position-relative">
                <MapPinHouse size={18} style={{
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
                  name="address"
                  placeholder='Address'
                  value={formData.address}
                  onChange={handleChange}
                  style={{
                    background: '#e8ecf1',
                    border: 'none',
                    borderRadius: '15px',
                    padding: '15px 20px 15px 45px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <button
                onClick={createCustomer}
                disabled={!isConnected}
                className="btn w-100 text-white"
                style={{
                  background: 'black',
                  border: 'none',
                  borderRadius: '15px',
                  padding: '15px 40px',
                  fontSize: '16px',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Create Customer
              </button>

              <div className="text-center my-3" style={{ color: '#9ca3af', fontSize: '14px' }}>
                Or
              </div>

              <div className="d-flex justify-content-center gap-3">
                <button
                  type="button"
                  className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', background: '#3b5998', border: 'none' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize: '20px' }}>f</span>
                </button>
                <button
                  type="button"
                  className="btn rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', background: '#1da1f2', border: 'none', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize: '20px' }}>𝕏</span>
                </button>
                <button
                  type="button"
                  className="btn rounded-circle d-flex align-items-center justify-content-center"
                  style={{ width: '50px', height: '50px', background: '#db4437', border: 'none', color: 'white' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <span style={{ fontSize: '20px' }}>G+</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default Home;

