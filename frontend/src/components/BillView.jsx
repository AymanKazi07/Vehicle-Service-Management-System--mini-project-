import React from 'react';
import { formatCurrency, formatDate } from '../utils/formatters';

export const BillView = ({ bill, onClose }) => {
  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card" style={{ maxWidth: '720px', padding: 0, background: 'transparent', border: 'none', boxShadow: 'none' }}>
        <div className="bill-paper">
          {/* Invoice Header */}
          <div className="bill-header">
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(99, 102, 241, 0.1)', color: '#4f46e5', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.725rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>
                Official Tax Invoice • GSTIN: 27AABCA1234F1Z5
              </div>
              <h2 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>
                {bill.workshopName || 'Apex SpeedWorks Central Hub'}
              </h2>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                Precision Automotive Maintenance & Mechanical Diagnostics
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                INV-{bill.billId || '7842'}
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.2rem' }}>
                Booking Ref: <strong style={{ color: '#334155' }}>{bill.bookingId}</strong>
              </div>
              <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                Issue Date: <strong style={{ color: '#334155' }}>{formatDate(bill.date)}</strong>
              </div>
            </div>
          </div>

          {/* Customer & Vehicle Metadata Strip */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '1.25rem',
            marginBottom: '1.75rem',
          }}>
            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Vehicle Details
              </span>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
                {bill.vehicleRegNo}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Billed To Customer
              </span>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginTop: '0.2rem' }}>
                {bill.ownerName || 'Valued Vehicle Owner'}
              </div>
            </div>

            <div>
              <span style={{ fontSize: '0.725rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                Payment Status
              </span>
              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#059669', display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.35rem' }}>
                <span>✓</span> PAID & SETTLED
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #cbd5e1', textAlign: 'left', fontSize: '0.775rem', color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                <th style={{ padding: '0.65rem 0' }}>Description of Service</th>
                <th style={{ padding: '0.65rem 0' }}>Certified Specialist</th>
                <th style={{ padding: '0.65rem 0', textAlign: 'right' }}>Amount (INR)</th>
              </tr>
            </thead>
            <tbody>
              {bill.lines?.map((line, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.925rem' }}>
                  <td style={{ padding: '0.85rem 0', fontWeight: 600, color: '#1e293b' }}>
                    {line.service || line.serviceName || 'Automotive Service'}
                  </td>
                  <td style={{ padding: '0.85rem 0', color: '#64748b', fontSize: '0.875rem' }}>
                    {line.mechanic || line.mechanicName || 'Assigned Specialist'}
                  </td>
                  <td style={{ padding: '0.85rem 0', textAlign: 'right', fontWeight: 700, color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                    {formatCurrency(line.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals Section */}
          <div style={{ borderTop: '2px solid #e2e8f0', paddingTop: '1.25rem', maxWidth: '340px', marginLeft: 'auto' }}>
            <div className="bill-total-row">
              <span style={{ color: '#64748b' }}>Taxable Value (Subtotal)</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#1e293b' }}>
                {formatCurrency(bill.subtotal)}
              </span>
            </div>
            <div className="bill-total-row">
              <span style={{ color: '#64748b' }}>Integrated GST (18.00%)</span>
              <span style={{ fontWeight: 700, fontFamily: 'var(--font-mono)', color: '#1e293b' }}>
                {formatCurrency(bill.gstAmount)}
              </span>
            </div>
            <div className="bill-total-row bill-grand-total">
              <span>Total Invoice Amount</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: '#4338ca' }}>
                {formatCurrency(bill.grandTotal)}
              </span>
            </div>
          </div>

          {/* Footer & Actions */}
          <div style={{ marginTop: '2.5rem', paddingTop: '1.25rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
              Computer-generated tax receipt • Valid for manufacturer warranty claims.
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={handlePrint}
                style={{ background: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1' }}
              >
                🖨️ Print Invoice
              </button>
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={onClose}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BillView;
