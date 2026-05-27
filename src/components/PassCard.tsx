import React, { useState } from 'react';
import type { Ticket } from '../types';
import { RefreshCw, Landmark, Info, Trash2 } from 'lucide-react';

interface PassCardProps {
  ticket: Ticket;
  onCancel: (ticketId: string) => void;
  onToggleCheckIn?: (ticketId: string) => void;
}

export const PassCard: React.FC<PassCardProps> = ({ ticket, onCancel, onToggleCheckIn }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  // Secure Coding PII Masking: mask email and name if necessary
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return '***@***.com';
    const [name, domain] = parts;
    const maskedName = name.length > 2 ? `${name.substring(0, 2)}***` : '***';
    return `${maskedName}@${domain}`;
  };

  const maskedEmail = maskEmail(ticket.userEmail);

  // Category specific neon gradients
  const gradients = {
    demo: 'linear-gradient(135deg, hsl(145, 45%, 62%), hsl(168, 48%, 62%))',
    lab: 'linear-gradient(135deg, hsl(168, 48%, 62%), hsl(185, 45%, 65%))',
    workshop: 'linear-gradient(135deg, hsl(145, 45%, 62%), hsl(18, 65%, 72%))',
    keynote: 'linear-gradient(135deg, hsl(18, 65%, 72%), hsl(35, 70%, 72%))'
  };

  const gradient = gradients[ticket.event.category] || gradients.demo;

  return (
    <div style={{
      perspective: '1000px',
      width: '100%',
      maxWidth: '340px',
      height: '460px',
      cursor: 'pointer'
    }} onClick={() => setIsFlipped(!isFlipped)}>
      
      {/* Flip Card Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        transition: 'transform 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        transformStyle: 'preserve-3d',
        transform: isFlipped ? 'rotateY(180deg)' : 'none'
      }}>
        
        {/* ================= CARD FRONT ================= */}
        <div className="glass" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid hsla(0,0%,100%,0.08)'
        }}>
          {/* Glowing Validated stamp watermark */}
          {ticket.isCheckedIn && (
            <div style={{
              position: 'absolute',
              top: '55%',
              left: '50%',
              transform: 'translate(-50%, -50%) rotate(-12deg)',
              border: '4px double var(--color-accent-teal)',
              color: 'var(--color-accent-teal)',
              background: 'rgba(5, 5, 8, 0.95)',
              padding: '10px 20px',
              borderRadius: '8px',
              fontWeight: 900,
              fontSize: '1.4rem',
              letterSpacing: '0.12em',
              zIndex: 10,
              textTransform: 'uppercase',
              pointerEvents: 'none',
              boxShadow: '0 0 25px var(--color-accent-teal-glow), inset 0 0 10px var(--color-accent-teal-glow)',
              fontFamily: 'monospace',
              whiteSpace: 'nowrap'
            }}>
              Validated
            </div>
          )}
          {/* Neon Gradient Header Stripe */}
          <div style={{
            height: '12px',
            background: gradient,
            width: '100%'
          }} />

          {/* Card Top */}
          <div style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.2rem' }}>🎫</span>
              <div>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, letterSpacing: '0.1em', color: '#fff', textTransform: 'uppercase' }}>Mockup Pass</span>
                <span style={{ display: 'block', fontSize: '0.62rem', color: 'var(--text-muted)' }}>Simulated Entry Key</span>
              </div>
            </div>
            <div style={{
              background: 'hsla(0,0%,100%,0.05)',
              padding: '4px 10px',
              borderRadius: '6px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#fff',
              border: '1px solid var(--bg-glass-border)'
            }}>
              DESK {ticket.seatNumber}
            </div>
          </div>

          {/* Card Event Content */}
          <div style={{ padding: '0 20px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Event Title</span>
              <h4 style={{ fontSize: '1.15rem', color: '#fff', fontWeight: 600, marginTop: '2px', lineHeight: '1.3' }}>
                {ticket.event.title}
              </h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Date</span>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{ticket.event.date}</span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Slot</span>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>{ticket.timeSlot}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Holder</span>
                <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block' }}>
                  {ticket.userName}
                </span>
              </div>
              <div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Credentials</span>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 400, display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {maskedEmail}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode / QR Simulator Area */}
          <div style={{
            background: 'rgba(255,255,255,0.02)',
            borderTop: '1px dashed var(--bg-glass-border)',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '10px'
          }}>
            {/* Custom SVG QR Code Simulator */}
            <svg width="100" height="100" viewBox="0 0 100 100" style={{ filter: 'drop-shadow(0 0 4px var(--color-accent-teal-glow))' }}>
              <rect width="100" height="100" fill="transparent" />
              {/* Outer boundary markers */}
              <rect x="5" y="5" width="20" height="20" fill="none" stroke="#fff" strokeWidth="4" />
              <rect x="10" y="10" width="10" height="10" fill="#fff" />
              
              <rect x="75" y="5" width="20" height="20" fill="none" stroke="#fff" strokeWidth="4" />
              <rect x="80" y="10" width="10" height="10" fill="#fff" />
              
              <rect x="5" y="75" width="20" height="20" fill="none" stroke="#fff" strokeWidth="4" />
              <rect x="10" y="80" width="10" height="10" fill="#fff" />

              {/* Center optical/mesh scanner dots */}
              <circle cx="50" cy="50" r="8" fill="var(--color-accent-teal)" />
              
              {/* Randomized matrix pathways (simulated QR) */}
              <rect x="35" y="15" width="6" height="6" fill="#fff" />
              <rect x="45" y="25" width="12" height="6" fill="#fff" />
              <rect x="15" y="35" width="6" height="12" fill="#fff" />
              <rect x="55" y="35" width="6" height="6" fill="#fff" />
              <rect x="75" y="35" width="12" height="6" fill="#fff" />
              
              <rect x="35" y="65" width="12" height="6" fill="#fff" />
              <rect x="15" y="55" width="6" height="6" fill="#fff" />
              <rect x="55" y="55" width="6" height="12" fill="#fff" />
              <rect x="65" y="75" width="6" height="6" fill="#fff" />
              <rect x="75" y="65" width="12" height="12" fill="var(--color-accent-teal)" />
            </svg>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              TAP FOR DETAILS / FLIP
            </span>
          </div>
        </div>

        {/* ================= CARD BACK ================= */}
        <div className="glass" style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
          border: '1px solid hsla(0,0%,100%,0.08)',
          transform: 'rotateY(180deg)',
          padding: '24px'
        }}>
          {/* Back Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <Info size={16} style={{ color: 'var(--color-accent-teal)' }} />
            <h4 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>Access Credentials Details</h4>
          </div>

          {/* Details list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', flexGrow: 1, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
            
            {ticket.selectedAddOns && ticket.selectedAddOns.length > 0 && (
              <div>
                <span style={{ display: 'block', fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Selected Upgrades</span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
                  {ticket.selectedAddOns.map((addon) => (
                    <span key={addon.id} style={{
                      fontSize: '0.68rem',
                      background: 'hsla(18, 65%, 72%, 0.12)',
                      border: '1px solid var(--color-accent-rose)',
                      color: '#fff',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <span>{addon.icon}</span>
                      <span>{addon.name}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Authorized Venue</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px', color: '#fff' }}>
                <Landmark size={14} style={{ color: 'var(--color-accent-teal)' }} />
                {ticket.event.location}
              </span>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reservation Code</span>
              <code style={{ display: 'block', fontSize: '0.9rem', color: '#fff', background: 'rgba(255,255,255,0.05)', padding: '6px', borderRadius: '4px', fontFamily: 'monospace', marginTop: '2px', border: '1px solid var(--bg-glass-border)' }}>
                {ticket.id.toUpperCase()}
              </code>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Entry Policy</span>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                Present the front QR code on your mobile device or compatible simulation optic hardware at the secure check-in point. Doors open 15 minutes before the session slot.
              </p>
            </div>
            
            <div>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Check-In Authorization</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (onToggleCheckIn) onToggleCheckIn(ticket.id);
                }}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '8px 12px',
                  fontSize: '0.78rem',
                  marginTop: '4px',
                  background: ticket.isCheckedIn ? 'rgba(235, 87, 87, 0.15)' : 'hsla(145, 45%, 62%, 0.15)',
                  borderColor: ticket.isCheckedIn ? 'rgba(235, 87, 87, 0.4)' : 'var(--color-primary)',
                  color: '#fff'
                }}
              >
                {ticket.isCheckedIn ? 'Cancel Entry Check-In' : 'Authorize Entrance Check-In'}
              </button>
            </div>

            <div style={{ borderTop: '1px solid var(--bg-glass-border)', paddingTop: '14px', marginTop: 'auto' }}>
              <span style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Secured Booking On</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{ticket.bookingDate}</span>
            </div>
          </div>

          {/* Action Footer */}
          <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
            <button
              onClick={(e) => {
                e.stopPropagation(); // Stop flip trigger
                if (window.confirm('Are you absolutely sure you want to cancel this spatial reservation? This action cannot be undone.')) {
                  onCancel(ticket.id);
                }
              }}
              className="btn-secondary"
              style={{
                width: '100%',
                justifyContent: 'center',
                padding: '10px',
                fontSize: '0.85rem',
                borderColor: 'rgba(235, 87, 87, 0.4)',
                color: 'hsl(350, 95%, 70%)',
                background: 'rgba(235, 87, 87, 0.05)'
              }}
            >
              <Trash2 size={14} />
              Cancel Reservation
            </button>
            
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg-glass-highlight)',
                borderRadius: 'var(--radius-sm)',
                padding: '0 12px',
                border: '1px solid var(--bg-glass-border)'
              }}
              title="Flip back to front"
            >
              <RefreshCw size={14} style={{ color: 'var(--text-muted)' }} />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
