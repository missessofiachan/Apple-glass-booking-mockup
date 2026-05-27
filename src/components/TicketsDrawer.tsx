import React from 'react';
import type { Ticket } from '../types';
import { PassCard } from './PassCard';
import { X, Ticket as TicketIcon } from 'lucide-react';

interface TicketsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: Ticket[];
  onCancelTicket: (ticketId: string) => void;
  onToggleCheckIn: (ticketId: string) => void;
}

export const TicketsDrawer: React.FC<TicketsDrawerProps> = ({ isOpen, onClose, tickets, onCancelTicket, onToggleCheckIn }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 5, 8, 0.6)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      justifyContent: 'flex-end',
      zIndex: 900,
      transition: 'var(--transition-smooth)'
    }} onClick={onClose}>
      
      {/* Drawer Panel */}
      <div className="glass" style={{
        width: '100%',
        maxWidth: '420px',
        height: '100vh',
        padding: '32px 24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        overflowY: 'auto',
        boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.5)',
        borderLeft: '1px solid var(--bg-glass-border)',
        borderTop: 'none',
        borderBottom: 'none',
        borderRight: 'none',
        animation: 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
      }} onClick={(e) => e.stopPropagation()}>
        
        {/* Style injection for animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideIn {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
        `}} />

        {/* Drawer Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TicketIcon size={20} style={{ color: 'var(--color-primary)' }} />
            <h3 style={{ fontSize: '1.4rem', color: '#fff' }}>My Spatial Keys</h3>
            <span style={{
              background: 'var(--color-primary)',
              color: '#fff',
              fontSize: '0.78rem',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '10px'
            }}>
              {tickets.length}
            </span>
          </div>
          
          <button
            onClick={onClose}
            className="btn-secondary"
            style={{
              padding: '6px',
              borderRadius: '50%'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Tickets List */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '24px', 
          alignItems: 'center',
          flexGrow: 1,
          paddingBottom: '20px'
        }}>
          {tickets.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flexGrow: 1,
              gap: '12px',
              color: 'var(--text-muted)',
              textAlign: 'center',
              padding: '40px'
            }}>
              <span style={{ fontSize: '2.5rem', filter: 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}>🎫</span>
              <h4 style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>No passes issued yet</h4>
              <p style={{ fontSize: '0.82rem', lineHeight: '1.4' }}>
                Select an exclusive Apple Glass workshop or trial demo session to claim your entry pass.
              </p>
            </div>
          ) : (
            tickets.map((tkt) => (
              <PassCard 
                key={tkt.id} 
                ticket={tkt} 
                onCancel={onCancelTicket} 
                onToggleCheckIn={onToggleCheckIn}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};
