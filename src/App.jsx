import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Orders from "./Orders";
import Home from "./Home";
import OrderList from "./OrderList";
import InvoiceList from "./InvoiceList";
function App() {

  const [customerId, setCustomerId] = useState("");
  const [itemId, setItemId] = useState("");
  const [amount, setAmount] = useState("");
  const [invoice, setInvoice] = useState(null);
  const [email, setEmail] = useState("");
  const [emailStatus, setEmailStatus] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [resendEmail, setResendEmail] = useState({});

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

  const connectQuickBooks = async () => {
    const res = await fetch("http://localhost:3000/auth-url");
    const data = await res.json();

    window.location.href = data.url;
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
    // <div style={{ padding: "40px", maxWidth: "500px" }}>
    //   <button
    //     onClick={connectQuickBooks}
    //     style={{
    //       width: "100%",
    //       padding: "10px",
    //       backgroundColor: "purple",
    //       color: "white",
    //       fontWeight: "bold",
    //       border: "none",
    //       cursor: "pointer",
    //       marginBottom: "20px"
    //     }}
    //   >
    //     Connect QuickBooks
    //   </button>

    //   <button
    //     onClick={fetchInvoices}
    //     style={{
    //       marginTop: "20px",
    //       width: "100%",
    //       padding: "10px",
    //       backgroundColor: "purple",
    //       color: "white",
    //       border: "none",
    //       fontWeight: "bold",
    //       cursor: "pointer"
    //     }}
    //   >
    //     Load All Invoices
    //   </button>

    //   <h2>Create QuickBooks Invoice</h2>
    //   <input
    //     placeholder="Customer ID"
    //     value={customerId}
    //     onChange={(e) => setCustomerId(e.target.value)}
    //     style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //   />
    //   <input
    //     placeholder="Item ID"
    //     value={itemId}
    //     onChange={(e) => setItemId(e.target.value)}
    //     style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //   />
    //   <input
    //     placeholder="Amount"
    //     value={amount}
    //     onChange={(e) => setAmount(e.target.value)}
    //     style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
    //   />
    //   <button
    //     onClick={createInvoice}
    //     style={{
    //       width: "100%",
    //       padding: "10px",
    //       backgroundColor: "purple",
    //       color: "white",
    //       fontWeight: "bold",
    //       border: "none",
    //       cursor: "pointer"
    //     }}
    //   >

    //     Generate Invoice
    //   </button>

    //   {invoice && (
    //     <div
    //       style={{
    //         marginTop: "20px",
    //         padding: "20px",
    //         border: "1px solid #ccc"
    //       }}
    //     >
    //       <h3>Invoice Created 🎉</h3>
    //       <p>
    //         <b>Invoice ID:</b> {invoice.Invoice.Id}
    //       </p>
    //       <p>
    //         <b>Total Amount:</b> {invoice.Invoice.TotalAmt}
    //       </p>
    //       <p>
    //         <b>Status:</b>{" "}
    //         {invoice.Invoice.Balance === 0 ? "Paid" : "Unpaid"}
    //       </p>

    //       <input
    //         placeholder="Recipient Email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         style={{
    //           width: "100%",
    //           padding: "8px",
    //           marginTop: "15px",
    //           marginBottom: "10px"
    //         }}
    //       />

    //       <button
    //         onClick={sendInvoiceEmail}
    //         style={{
    //           width: "100%",
    //           padding: "10px",
    //           backgroundColor: "green",
    //           color: "white",
    //           border: "none",
    //           fontWeight: "bold",
    //           cursor: "pointer"
    //         }}
    //       >
    //         Send Invoice Email
    //       </button>

    //       {emailStatus && (
    //         <p
    //           style={{
    //             marginTop: "10px",
    //             color: "green",
    //             fontWeight: "bold"
    //           }}
    //         >
    //           {emailStatus}
    //         </p>
    //       )}
    //     </div>
    //   )}
    //   {invoices.length > 0 && (
    //     <div style={{ marginTop: "30px" }}>
    //       <h2>All Invoices</h2>

    //       {invoices.map(inv => (
    //         <div
    //           key={inv.Id}
    //           style={{
    //             padding: "15px",
    //             border: "1px solid #ccc",
    //             marginBottom: "10px"
    //           }}
    //         >
    //           <p><b>ID:</b> {inv.Id}</p>
    //           <p><b>Customer:</b> {inv.CustomerRef?.name}</p>
    //           <p><b>Total:</b> {inv.TotalAmt}</p>
    //           <p><b>Status:</b> {inv.Balance === 0 ? "Paid" : "Unpaid"}</p>

    //           <input
    //             placeholder="Email"
    //             value={resendEmail[inv.Id] || ""}
    //             onChange={(e) =>
    //               setResendEmail({ ...resendEmail, [inv.Id]: e.target.value })
    //             }
    //             style={{ width: "100%", padding: "8px", marginTop: "10px" }}
    //           />

    //           <button
    //             onClick={() => resendInvoice(inv.Id, resendEmail[inv.Id])}
    //             style={{
    //               width: "100%",
    //               padding: "10px",
    //               backgroundColor: "purple",
    //               color: "white",
    //               border: "none",
    //               marginTop: "10px",
    //               cursor: "pointer"
    //             }}
    //           >
    //             Resend Invoice Email
    //           </button>
    //         </div>

    //       ))}
    //     </div>
    //   )}

    // </div>

    <div className="min-vh-100 d-flex align-items-center justify-content-center p-4" style={{
      background: 'linear-gradient(135deg, #003000 0%, #001a00 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Wave decorations on sides */}
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
              <Route path="/" element={<Home />} />
              <Route path="/create-order" element={<Orders />} />
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

