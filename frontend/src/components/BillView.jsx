import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BillView = ({ bill, onClose }) => {
  if (!bill) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '680px', padding: 0, background: 'transparent' }}>
        <div className="bill-paper">
          <div className="bill-header">
            <div>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Tax Invoice / Service Receipt
              </span>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginTop: '0.2rem', color: '#0f172a' }}>
                {bill.workshopName || 'Central Auto Care'}
              </h2>
              <p style={{ fontSize: '0.825rem', color: '#64748b', marginTop: '0.15rem' }}>
                Official GST-Registered Vehicle Maintenance Center
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>
                Invoice #{bill.billId}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Booking Ref: {bill.bookingId}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Date: {formatDate(bill.date)}
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Vehicle Details</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                {bill.vehicleRegNo}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>Customer Name</span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
                {bill.ownerName}
              </div>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left', fontSize: '0.8rem', color: '#475569', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0' }}>Service Description</th>
                <th style={{ padding: '0.5rem 0' }}>Assigned Mechanic</th>
                <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Price (INR)</th>
              </tr>
            </thead>
            <tbody>
              {bill.lines?.map((line, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #e2e8f0', fontSize: '0.9rem' }}>
                  <td style={{ padding: '0.65rem 0', fontWeight: 600, color: '#1e293b' }}>
                    {line.service}
                  </td>
                  <td style={{ padding: '0.65rem 0', color: '#64748b' }}>
                    {line.mechanic}
                  </td>
                  <td style={{ padding: '0.65rem 0', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(line.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1rem' }}>
            <div className="bill-total-row">
              <span style={{ color: '#64748b' }}>Subtotal</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(bill.subtotal)}</span>
            </div>
            <div className="bill-total-row">
              <span style={{ color: '#64748b' }}>Applicable GST (Flat 18%)</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)' }}>{formatCurrency(bill.gstAmount)}</span>
            </div>
            <div className="bill-total-row bill-grand-total">
              <span>Grand Total</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#4f46e5' }}>{formatCurrency(bill.grandTotal)}</span>
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Thank you for trusting AutoServe!</span>
            <button className="btn btn-secondary" onClick={onClose}>
              Close Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
