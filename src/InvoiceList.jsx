import axios from 'axios';
import { SquareUser } from 'lucide-react';
import { SiTicktick } from "react-icons/si";
import React, { use, useEffect, useState } from 'react'

const InvoiceList = () => {
    const [invoices, setInvoices] = useState([]);
    const fetchInvoices = async () => {
    const response = await axios.get("http://localhost:3000/invoices");
    const data = response.data;
    setInvoices(data.map(inv => ({
    ...inv,
    paid: inv.PrivateNote === "Paid manually via external method"
  })));
    console.log(data);
  }
  const resendInvoice = async (invoiceId, email) => {
    try {
      const response = await axios.post(`http://localhost:3000/resend-invoice`, { invoiceId: invoiceId, email: email });
      const data = response.data;
      console.log("Invoice resent successfully:", data);
    } catch (error) {
      console.error('Error resending invoice:', error);
    }
  }

  const payment = async (invoiceId) => {
  try {
    const response = await axios.post("http://localhost:3000/mark-paid", {
      invoiceId
    });

    if (response.status === 201) {
      setInvoices(prev =>
        prev.map(inv =>
          String(inv.Id) === String(invoiceId)
            ? { ...inv, paid: true, PrivateNote: "Paid manually via external method" }
            : inv
        )
      );
    }

  } catch (error) {
    console.error("Error marking invoice as paid:", error);
  }
};

  useEffect(() => {
        fetchInvoices();
    }, []);
  return (
    <div className="bg-light rounded-4 shadow-lg p-4 p-md-5" style={{
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
    }}>
      <h2 className="text-center mb-4" style={{ color: '' }}>Invoice List</h2>
      {invoices.map((invoice) => 
      invoice.EmailStatus === "EmailSent" && (<div className="text-white rounded-2 d-flex px-4 mt-3" style={{ height: "110px", border: "1px solid #333", backgroundColor: '#001f14'}} key={invoice.Id}>

        <div className="col-8 d-flex align-items-center gap-3">
          <SquareUser size={60} style={{ color: '#9ca3af' }} />

          <div className="d-flex flex-column lh-sm">
            <span className="fw-semibold fs-5 text-capitalize">{invoice.CustomerRef.name}</span>
            <span className="text-secondary small">email : {invoice.BillEmail.Address}</span>
            <span className="text-secondary small">invoice number : {invoice.Id}</span>
            <span className="text-secondary small">amount : {invoice.TotalAmt}</span>
          </div>
        </div>

        <div className="col-4 d-flex align-items-center justify-content-end gap-3">
          <button
            onClick={() => resendInvoice(Number(invoice.Id),invoice.BillEmail.Address)}
            className="btn text-black px-3"
            style={{
              background: '#d4af37',
              borderRadius: '8px',
              padding: '10px 20px',
              fontWeight: '500'
            }}
          >
            Resend Invoice
          </button>

            <div style={{ width: "150px", display: "flex", justifyContent: "center" }}>
              {!invoice.paid ? (
                <button
                  onClick={() => payment(String(invoice.Id))}
                  className="btn btn-success text-white px-3"
                  style={{
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontWeight: '500',
                    width: "100%"
                  }}
                >
                  Make Payment
                </button>
              ) : (
                <SiTicktick size={45} style={{ color: 'limegreen' }} />
              )}
            </div>
        </div>
      </div>))}
    </div>
  )
}

export default InvoiceList