import React, { useState, useEffect } from 'react';
import type { AppleEvent, Ticket, AddOnItem } from '../types';
import { X, Calendar, Clock, MapPin, CheckCircle, ShieldAlert, Sun, CloudRain, Wind, Moon, CloudSun, Loader, Sparkles } from 'lucide-react';

const ADD_ONS_DATABASE: Record<string, AddOnItem[]> = {
  'ev-1': [
    { id: 'it-1', name: 'Gourmet Cannoli Trio', price: 12, description: 'Handcrafted traditional pistachio, chocolate, and ricotta cannolis.', icon: '🇮🇹' },
    { id: 'it-2', name: 'VIP Carlton Lawn Seat', price: 25, description: 'Reserved premium seating space near the main cultural orchestra stage.', icon: '⭐' }
  ],
  'ev-2': [
    { id: 'gr-1', name: 'Souvlaki Feast Box', price: 18, description: 'Charcoal meat skewers, fresh pita, tzatziki, and chips.', icon: '🇬🇷' },
    { id: 'gr-2', name: 'Bouzouki Tuning Picks Bundle', price: 8, description: 'Commemorative wooden bouzouki custom tuning picks.', icon: '🎸' }
  ],
  'ev-3': [
    { id: 'ch-1', name: 'Premium Tea Ceremony Kit', price: 20, description: 'Hand-picked loose leaf Oolong tea with a traditional clay tasting cup.', icon: '🏮' },
    { id: 'ch-2', name: 'Acoustic Lion Dance Keepsake', price: 15, description: 'Miniature papier-mâché lion dance head with brass bell.', icon: '🦁' }
  ],
  'ev-4': [
    { id: 'di-1', name: 'Deluxe Clay Diya Set', price: 10, description: 'Four organic clay oil lamps, hand-painted with gold sage accents.', icon: '🪔' },
    { id: 'di-2', name: 'Traditional Indian Sweet Box', price: 16, description: 'Assortment of handmade Kaju Katli, Ladoo, and Barfi.', icon: '🍬' }
  ],
  'ev-5': [
    { id: 'jo-1', name: 'Tapas & Sangria Pass', price: 22, description: 'Authentic Spanish patatas bravas, croquetas, and mocktail sangria.', icon: '🇪🇸' },
    { id: 'jo-2', name: 'Castanets Rhythm Kit', price: 12, description: 'Polished wooden performance castanets for flamenco rhythm-keeping.', icon: '💃' }
  ]
};

const DEFAULT_ADD_ONS: AddOnItem[] = [
  { id: 'def-1', name: 'Premium Cultural Snack Basket', price: 15, description: 'Artisanal collection of Melbourne-sourced treats.', icon: '🧺' },
  { id: 'def-2', name: 'VIP Priority Pass Upgrade', price: 25, description: 'Skipping general entry lanes with premium lounge access.', icon: '✨' }
];

interface BookingModalProps {
  event: AppleEvent;
  onClose: () => void;
  onConfirm: (ticket: Ticket) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ event, onClose, onConfirm }) => {
  const [timeSlot, setTimeSlot] = useState(event.timeSlots[0]);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Live Open-Meteo Weather states
  const [liveWeather, setLiveWeather] = useState<{
    temp: string;
    status: string;
    icon: 'sun' | 'rain' | 'wind' | 'moon' | 'cloud-sun';
    description: string;
    isHistorical?: boolean;
    archiveDate?: string;
  } | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Fetch Melbourne Today's Weather or Historical Archive depending on event date
  useEffect(() => {
    setIsWeatherLoading(true);
    
    // Determine today's date in Melbourne time (AEST / AEDT) YYYY-MM-DD
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const todayStr = `${y}-${m}-${d}`;

    const isToday = event.date === todayStr;

    if (isToday) {
      fetch('https://api.open-meteo.com/v1/forecast?latitude=-37.8136&longitude=144.9631&current=temperature_2m,weather_code&timezone=Australia%2FSydney')
        .then((res) => {
          if (!res.ok) throw new Error('API query block');
          return res.json();
        })
        .then((data) => {
          if (data && data.current) {
            const tempVal = Math.round(data.current.temperature_2m);
            const code = data.current.weather_code;

            let iconType: 'sun' | 'rain' | 'wind' | 'moon' | 'cloud-sun' = 'cloud-sun';
            let statusText = 'Mild Outlook';
            let descText = 'Partly cloudy sky predictions for Melbourne.';

            if (code === 0) {
              iconType = 'sun';
              statusText = 'Sunny Today';
              descText = 'Clear skies today in Melbourne! Perfect for outdoor garden events.';
            } else if ([1, 2, 3].includes(code)) {
              iconType = 'cloud-sun';
              statusText = 'Partly Cloudy';
              descText = 'Mild, scattered clouds across Melbourne. Enjoy the festival atmosphere!';
            } else if ([45, 48].includes(code)) {
              iconType = 'cloud-sun';
              statusText = 'Foggy Skies';
              descText = 'Mist settling over the Yarra. Wrap up warm.';
            } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
              iconType = 'rain';
              statusText = 'Local Showers';
              descText = 'Rain showers active. Bringing a sage umbrella is recommended!';
            } else if ([71, 73, 75, 77, 85, 86, 95, 96, 99].includes(code)) {
              iconType = 'wind';
              statusText = 'Windy/Stormy';
              descText = 'Strong wind or electrical storm alerts. Gather inside local pavilions.';
            }

            setLiveWeather({
              temp: `${tempVal}°C`,
              status: statusText,
              icon: iconType,
              description: `${descText} (Live API Forecast)`
            });
          }
        })
        .catch((err) => {
          console.warn('Open-Meteo weather fetch failed', err);
        })
        .finally(() => {
          setIsWeatherLoading(false);
        });
    } else {
      // Historical Archive lookup
      const eventDateObj = new Date(event.date);
      const isFutureObj = new Date(event.date) > new Date(todayStr);
      let queryDateObj = eventDateObj;
      
      // If the date is in the future, look up the same date in the previous year (2025)
      if (isFutureObj) {
        queryDateObj = new Date(event.date);
        queryDateObj.setFullYear(2025);
      }

      const qY = queryDateObj.getFullYear();
      const qM = String(queryDateObj.getMonth() + 1).padStart(2, '0');
      const qD = String(queryDateObj.getDate()).padStart(2, '0');
      const queryDateStr = `${qY}-${qM}-${qD}`;

      fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=-37.8136&longitude=144.9631&start_date=${queryDateStr}&end_date=${queryDateStr}&daily=temperature_2m_max,weather_code&timezone=Australia%2FSydney`)
        .then((res) => {
          if (!res.ok) throw new Error('Historical API query block');
          return res.json();
        })
        .then((data) => {
          if (data && data.daily && data.daily.time && data.daily.time.length > 0) {
            const tempVal = Math.round(data.daily.temperature_2m_max[0] || 15);
            const code = data.daily.weather_code[0] !== undefined ? data.daily.weather_code[0] : 3;

            let iconType: 'sun' | 'rain' | 'wind' | 'moon' | 'cloud-sun' = 'cloud-sun';
            let statusText = 'Mild Outlook';
            let descText = `Historical average around ${tempVal}°C on this day.`;

            if (code === 0) {
              iconType = 'sun';
              statusText = 'Sunny Day';
              descText = 'Historically beautiful clear skies in Melbourne on this day.';
            } else if ([1, 2, 3].includes(code)) {
              iconType = 'cloud-sun';
              statusText = 'Partly Cloudy';
              descText = 'Historically mild with scattered clouds. Comfortable festival climate.';
            } else if ([45, 48].includes(code)) {
              iconType = 'cloud-sun';
              statusText = 'Foggy Skies';
              descText = 'Historically foggy or misty morning. Cool weather.';
            } else if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) {
              iconType = 'rain';
              statusText = 'Showers';
              descText = 'Historically wet day with some showers. Indoor activities preferred.';
            } else if ([71, 73, 75, 77, 85, 86, 95, 96, 99].includes(code)) {
              iconType = 'wind';
              statusText = 'Windy/Stormy';
              descText = 'Historically strong winds or stormy conditions on this date.';
            }

            setLiveWeather({
              temp: `${tempVal}°C`,
              status: statusText,
              icon: iconType,
              description: `${descText} (Historical Archive Data)`,
              isHistorical: true,
              archiveDate: queryDateStr
            });
          }
        })
        .catch((err) => {
          console.warn('Open-Meteo historical fetch failed', err);
        })
        .finally(() => {
          setIsWeatherLoading(false);
        });
    }
  }, [event.date]);

  const [selectedAddOns, setSelectedAddOns] = useState<AddOnItem[]>([]);

  // Get add-ons for the current event
  const availableAddOns = ADD_ONS_DATABASE[event.id] || DEFAULT_ADD_ONS;

  const handleToggleAddOn = (item: AddOnItem) => {
    if (selectedAddOns.some((addon: AddOnItem) => addon.id === item.id)) {
      setSelectedAddOns(selectedAddOns.filter((addon: AddOnItem) => addon.id !== item.id));
    } else {
      setSelectedAddOns([...selectedAddOns, item]);
    }
  };

  // Parse event price if possible (e.g. "$15 Entry Pass" -> 15, "Free" -> 0)
  const basePrice = (() => {
    const match = event.pricing.match(/\$(\d+)/);
    return match ? parseInt(match[1], 10) : 0;
  })();

  const addOnsTotal = selectedAddOns.reduce((sum: number, item: AddOnItem) => sum + item.price, 0);
  const totalPrice = basePrice + addOnsTotal;

  // Generate 20 spatial seats: A1 to D5
  const rows = ['A', 'B', 'C', 'D'];
  const cols = [1, 2, 3, 4, 5];

  // Simulating already reserved seats in our mockup environment
  const mockReservedSeats = ['A3', 'B1', 'C4', 'D2'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    // Validation
    if (!userName.trim()) {
      setValidationError('Please enter your full name for credentials verification.');
      return;
    }
    if (!userEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userEmail)) {
      setValidationError('Please enter a valid developer email address.');
      return;
    }
    if (!selectedSeat) {
      setValidationError('Please choose an entry reservation seat from the seating map.');
      return;
    }

    // Success! Generate ticket payload
    const ticket: Ticket = {
      id: `tkt-${Math.random().toString(36).substr(2, 9)}`,
      event,
      timeSlot,
      seatNumber: selectedSeat,
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      bookingDate: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      selectedAddOns,
      isCheckedIn: false
    };

    onConfirm(ticket);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 5, 8, 0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      overflowY: 'auto'
    }}>
      <div className="glass" style={{
        width: '100%',
        maxWidth: '850px',
        borderRadius: 'var(--radius-lg)',
        padding: '32px',
        position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.6)',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '50%',
            transition: 'var(--transition-fast)'
          }}
          className="btn-secondary"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div>
          <span style={{ 
            fontSize: '0.8rem', 
            color: 'var(--color-primary)', 
            fontWeight: 600, 
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}>Mockup Reservation Center</span>
          <h2 style={{ fontSize: '1.8rem', color: '#fff', marginTop: '4px' }}>Confirm your Event Access</h2>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Header Summary Card */}
          <div style={{
            background: 'hsla(0,0%,100%,0.02)',
            border: '1px solid var(--bg-glass-border)',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>{event.title}</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={12} /> {event.date}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={12} /> {event.duration}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={12} style={{ color: 'var(--color-primary)' }} /> {event.location}</span>
            </div>
          </div>

          {/* TWO COLUMN GRID LAYOUT */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '24px'
          }}>
            
            {/* Column 1: Map, Seating & Weather */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Interactive Seating Selector */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Select Entry Desk / Seat
                </label>
                <div style={{
                  background: 'hsla(0,0%,100%,0.01)',
                  border: '1px solid var(--bg-glass-border)',
                  padding: '16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  {/* Seating Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gap: '8px'
                  }}>
                    {rows.map((row) => 
                      cols.map((col) => {
                        const id = `${row}${col}`;
                        const isReserved = mockReservedSeats.includes(id);
                        const isSelected = selectedSeat === id;
                        
                        return (
                          <button
                            key={id}
                            type="button"
                            disabled={isReserved}
                            onClick={() => setSelectedSeat(id)}
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              border: '1px solid',
                              borderColor: isSelected 
                                ? 'var(--color-primary)' 
                                : isReserved 
                                  ? 'transparent' 
                                  : 'var(--bg-glass-border)',
                              background: isSelected
                                ? 'hsla(145, 45%, 62%, 0.25)'
                                : isReserved
                                  ? 'rgba(255, 255, 255, 0.03)'
                                  : 'var(--bg-glass-highlight)',
                              color: isSelected 
                                ? '#fff' 
                                : isReserved 
                                  ? 'var(--text-muted)' 
                                  : 'var(--text-secondary)',
                              cursor: isReserved ? 'not-allowed' : 'pointer',
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'var(--transition-fast)',
                              boxShadow: isSelected ? '0 0 10px var(--color-primary-glow)' : 'none',
                              textDecoration: isReserved ? 'line-through' : 'none'
                            }}
                            title={isReserved ? `Seat ${id} (Booked)` : `Seat ${id}`}
                          >
                            {id}
                          </button>
                        );
                      })
                    )}
                  </div>

                  {/* Legend */}
                  <div style={{ display: 'flex', gap: '12px', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'var(--bg-glass-highlight)', border: '1px solid var(--bg-glass-border)' }} />
                      Available
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'hsla(145, 45%, 62%, 0.25)', border: '1px solid var(--color-primary)' }} />
                      Selected
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span style={{ width: '6px', height: '6px', borderRadius: '1px', background: 'rgba(255, 255, 255, 0.03)' }} />
                      Occupied
                    </span>
                  </div>
                </div>
              </div>

              {/* Google Map Embed */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Interactive Venue Map (Melbourne)
                </label>
                <div style={{
                  width: '100%',
                  height: '140px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  border: '1px solid var(--bg-glass-border)',
                  background: 'var(--bg-glass-highlight)'
                }}>
                  <iframe
                    src={event.googleMapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0, filter: 'invert(90%) hue-rotate(90deg) contrast(1.1) brightness(0.9)' }}
                    allowFullScreen={false}
                    loading="lazy"
                    title={`Google Map - ${event.location}`}
                  />
                </div>
              </div>

              {/* Melbourne Weather Forecast Widget */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
                  <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
                    Melbourne Weather Forecast
                  </label>
                  {liveWeather && (
                    <span style={{
                      fontSize: '0.68rem',
                      color: liveWeather.isHistorical ? 'var(--color-accent-rose)' : 'var(--color-primary)',
                      background: liveWeather.isHistorical ? 'hsla(350, 45%, 62%, 0.1)' : 'hsla(145, 45%, 62%, 0.1)',
                      border: `1px solid ${liveWeather.isHistorical ? 'var(--color-accent-rose)' : 'var(--color-primary)'}`,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}>
                      {liveWeather.isHistorical ? `Archive: ${liveWeather.archiveDate}` : 'Live Today'}
                    </span>
                  )}
                </div>
                
                <div className="glass" style={{
                  padding: '12px 16px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  border: '1px solid var(--bg-glass-border)',
                  position: 'relative'
                }}>
                  {isWeatherLoading && !liveWeather ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.78rem', width: '100%', justifyContent: 'center', padding: '8px 0' }}>
                      <Loader size={14} className="shimmer" style={{ animation: 'spin 2s linear infinite' }} />
                      <span>Querying Open-Meteo API...</span>
                    </div>
                  ) : (
                    <>
                      {/* Render Live Weather from API if loaded, else fall back seamlessly to Event Date Weather */}
                      {liveWeather ? (
                        <>
                          <div style={{
                            background: 'hsla(145, 45%, 62%, 0.1)',
                            padding: '10px',
                            borderRadius: '12px',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {liveWeather.icon === 'sun' && <Sun size={22} />}
                            {liveWeather.icon === 'rain' && <CloudRain size={22} />}
                            {liveWeather.icon === 'wind' && <Wind size={22} />}
                            {liveWeather.icon === 'moon' && <Moon size={22} />}
                            {liveWeather.icon === 'cloud-sun' && <CloudSun size={22} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{liveWeather.temp}</span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>{liveWeather.status}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                              {liveWeather.description}
                            </p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div style={{
                            background: 'hsla(145, 45%, 62%, 0.1)',
                            padding: '10px',
                            borderRadius: '12px',
                            color: 'var(--color-primary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}>
                            {event.weather.icon === 'sun' && <Sun size={22} />}
                            {event.weather.icon === 'rain' && <CloudRain size={22} />}
                            {event.weather.icon === 'wind' && <Wind size={22} />}
                            {event.weather.icon === 'moon' && <Moon size={22} />}
                            {event.weather.icon === 'cloud-sun' && <CloudSun size={22} />}
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                              <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{event.weather.temp}</span>
                              <span style={{ fontSize: '0.78rem', color: 'var(--color-primary)', fontWeight: 600 }}>{event.weather.status}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>
                              {event.weather.description} (Forecast for Event Date)
                            </p>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* Column 2: Date Selector & Inputs Checkout */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Time slot picker */}
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  Choose Arrival Time
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {event.timeSlots.map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setTimeSlot(slot)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid',
                        borderColor: timeSlot === slot ? 'var(--color-primary)' : 'var(--bg-glass-border)',
                        background: timeSlot === slot ? 'hsla(145, 45%, 62%, 0.15)' : 'var(--bg-glass-highlight)',
                        color: timeSlot === slot ? '#fff' : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 500,
                        transition: 'var(--transition-fast)'
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Cultural Add-On Customizer */}
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '8px', fontWeight: 500 }}>
                  <Sparkles size={14} style={{ color: 'var(--color-accent-rose)' }} />
                  Select Cultural Add-Ons
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {availableAddOns.map((item) => {
                    const isSelected = selectedAddOns.some((addon: AddOnItem) => addon.id === item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleAddOn(item)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '10px 14px',
                          borderRadius: '8px',
                          background: isSelected ? 'hsla(18, 65%, 72%, 0.08)' : 'var(--bg-glass-highlight)',
                          border: '1px solid',
                          borderColor: isSelected ? 'var(--color-accent-rose)' : 'var(--bg-glass-border)',
                          cursor: 'pointer',
                          transition: 'var(--transition-fast)'
                        }}
                      >
                        <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                        <div style={{ flexGrow: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{item.name}</span>
                            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--color-accent-rose)' }}>+${item.price}</span>
                          </div>
                          <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px', lineHeight: '1.3' }}>
                            {item.description}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Summary */}
              <div className="glass" style={{
                padding: '12px 16px',
                borderRadius: '8px',
                border: '1px solid var(--bg-glass-border)',
                fontSize: '0.85rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Base Access ({event.pricing})</span>
                  <span>${basePrice}</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Selected Upgrades ({selectedAddOns.length})</span>
                    <span>+${addOnsTotal}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px dashed var(--bg-glass-border)', paddingTop: '8px', marginTop: '4px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#fff', fontSize: '0.95rem' }}>
                  <span>Total Amount</span>
                  <span style={{ color: 'var(--color-primary)' }}>${totalPrice} AUD</span>
                </div>
              </div>

              {/* Inputs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                    Attendee Full Name
                  </label>
                  <input 
                    type="text" 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder="e.g. John Doe"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--bg-glass-border)',
                      background: 'var(--bg-glass-highlight)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    value={userEmail} 
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder="e.g. john@domain.com"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      border: '1px solid var(--bg-glass-border)',
                      background: 'var(--bg-glass-highlight)',
                      color: '#fff',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>
              </div>

              {/* Validation Feedback */}
              {validationError && (
                <div style={{
                  background: 'rgba(235, 87, 87, 0.1)',
                  border: '1px solid hsl(350, 95%, 60%)',
                  color: 'hsl(350, 95%, 70%)',
                  padding: '12px',
                  borderRadius: '8px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <ShieldAlert size={16} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Submit Button */}
              <button 
                type="submit" 
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '14px',
                  marginTop: 'auto'
                }}
              >
                <CheckCircle size={18} />
                Confirm Mockup Reservation
              </button>

            </div>

          </div>

        </form>
      </div>
    </div>
  );
};
