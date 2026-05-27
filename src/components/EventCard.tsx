import React from 'react';
import type { AppleEvent } from '../types';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: AppleEvent;
  onBookClick: (event: AppleEvent) => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onBookClick }) => {
  const urgencyPercent = ((event.maxSpots - event.spotsLeft) / event.maxSpots) * 100;
  
  // Style config per category
  const categoryStyles = {
    demo: { text: 'Culture Showcase', color: 'var(--color-accent-teal)', bg: 'var(--bg-glass-highlight)' },
    lab: { text: 'Community Gathering', color: 'var(--color-primary)', bg: 'var(--bg-glass-highlight)' },
    workshop: { text: 'Cultural Workshop', color: 'var(--color-accent-rose)', bg: 'var(--bg-glass-highlight)' },
    keynote: { text: 'Community Keynote', color: 'hsl(35, 70%, 72%)', bg: 'var(--bg-glass-highlight)' }
  };

  const style = categoryStyles[event.category];

  return (
    <article className="glass glass-interactive" style={{
      borderRadius: 'var(--radius-lg)',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%'
    }}>
      {/* Event Header Image */}
      <div style={{ position: 'relative', height: '180px', overflow: 'hidden' }}>
        <img 
          src={event.imageUrl} 
          alt={event.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'var(--transition-smooth)' }}
        />
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          background: style.bg,
          color: style.color,
          border: `1px solid ${style.color}`,
          padding: '6px 14px',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 600,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          backdropFilter: 'blur(10px)'
        }}>
          {style.text}
        </div>
        <div style={{
          position: 'absolute',
          bottom: '0',
          left: '0',
          right: '0',
          height: '60px',
          background: 'linear-gradient(to top, var(--bg-surface), transparent)'
        }} />
      </div>

      {/* Card Body */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', color: '#fff', marginBottom: '4px' }}>{event.title}</h3>
          <span style={{ fontSize: '0.9rem', color: style.color, fontWeight: 500 }}>{event.subtitle}</span>
        </div>

        <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5', flexGrow: 1 }}>
          {event.description}
        </p>

        {/* Dynamic availability bar */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '6px' }}>
            <span style={{ color: 'var(--text-muted)' }}>Reservations Status</span>
            <span style={{ color: event.spotsLeft <= 5 ? 'var(--color-accent-rose)' : 'var(--text-secondary)', fontWeight: 600 }}>
              {event.spotsLeft === 0 ? 'Fully Booked' : `${event.spotsLeft} spots left`}
            </span>
          </div>
          <div style={{ height: '6px', background: 'hsl(225, 20%, 16%)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${urgencyPercent}%`, 
              background: event.spotsLeft <= 5 
                ? 'linear-gradient(to right, var(--color-accent-rose), hsl(350, 95%, 60%))' 
                : `linear-gradient(to right, var(--color-primary), ${style.color})`,
              borderRadius: '3px',
              transition: 'width 0.8s ease-out'
            }} />
          </div>
        </div>

        {/* Metadata Details */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Calendar size={14} style={{ color: style.color }} />
            <span>{event.date}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Clock size={14} style={{ color: style.color }} />
            <span>{event.duration}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <MapPin size={14} style={{ color: style.color }} />
            <span>{event.location}</span>
          </div>
        </div>

        {/* Highlight Feature Badges */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '4px' }}>
          {event.features.slice(0, 2).map((feat, idx) => (
            <span key={idx} style={{
              background: 'hsla(0, 0%, 100%, 0.04)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              padding: '4px 10px',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              border: '1px solid hsla(0, 0%, 100%, 0.02)'
            }}>
              <Sparkles size={10} style={{ color: style.color }} />
              {feat}
            </span>
          ))}
        </div>

        {/* Pricing & Booking Action */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          borderTop: '1px solid var(--bg-glass-border)', 
          paddingTop: '16px',
          marginTop: '8px'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket Price</span>
            <span style={{ fontSize: '1.2rem', color: '#fff', fontWeight: 700 }}>{event.pricing}</span>
          </div>
          
          <button 
            onClick={() => onBookClick(event)}
            disabled={event.spotsLeft === 0}
            className="btn-primary" 
            style={{
              padding: '10px 20px',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-md)',
              opacity: event.spotsLeft === 0 ? 0.4 : 1,
              cursor: event.spotsLeft === 0 ? 'not-allowed' : 'pointer',
              background: event.spotsLeft === 0 ? 'var(--bg-glass-border)' : undefined,
              boxShadow: event.spotsLeft === 0 ? 'none' : undefined
            }}
          >
            {event.spotsLeft === 0 ? 'Sold Out' : 'Book Session'}
          </button>
        </div>
      </div>
    </article>
  );
};
