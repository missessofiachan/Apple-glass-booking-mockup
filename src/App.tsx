import { useState, useEffect, useRef } from 'react';
import type { AppleEvent, Ticket } from './types';
import { APPLE_EVENTS } from './data/events';
import { EventCard } from './components/EventCard';
import { BookingModal } from './components/BookingModal';
import { TicketsDrawer } from './components/TicketsDrawer';
import { Search, Compass, Cpu, Ticket as TicketIcon, BookOpen, Flame, Calendar as CalendarIcon, RefreshCw, Download, ExternalLink, ShieldAlert, Plus, Trash2, Layers, Edit, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [events, setEvents] = useState<AppleEvent[]>(APPLE_EVENTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<string | null>(null);
  const [activeBookEvent, setActiveBookEvent] = useState<AppleEvent | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newlyBookedTicket, setNewlyBookedTicket] = useState<Ticket | null>(null);
  
  // Role switcher: 'attendee' | 'admin'
  const [userRole, setUserRole] = useState<'attendee' | 'admin'>('attendee');

  // Form states for creating a new event
  const [newTitle, setNewTitle] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<'demo' | 'lab' | 'workshop' | 'keynote'>('demo');
  const [newDate, setNewDate] = useState('2026-06-10');
  const [newSlots, setNewSlots] = useState('09:00 AM, 01:00 PM, 05:00 PM');
  const [newDuration] = useState('2 hours');
  const [newLoc, setNewLoc] = useState('Melbourne Town Hall, VIC');
  const [newPricing, setNewPricing] = useState('Free Public Event');
  const [newMaxSpots, setNewMaxSpots] = useState(30);
  const [newImgUrl] = useState('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80');
  const [newTemp, setNewTemp] = useState('15°C');
  const [newWeatherStatus, setNewWeatherStatus] = useState('Mild Autumn Day');
  const [newWeatherIcon, setNewWeatherIcon] = useState<'sun' | 'rain' | 'wind' | 'moon' | 'cloud-sun'>('cloud-sun');
  const [newWeatherDesc] = useState('Comfortable temperature with a mild sky.');
  const [newGreeting, setNewGreeting] = useState('A warm welcome to Melbourne Town Hall!');
  const [formError, setFormError] = useState<string | null>(null);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Dynamically compute calendar days active dates from state array events
  const getEventDatesMap = () => {
    const map: Record<number, { id: string; title: string; dateStr: string }> = {};
    events.forEach((ev) => {
      // Date format is "2026-06-XX"
      if (ev.date.startsWith('2026-06-')) {
        const dayStr = ev.date.substring(8);
        const day = parseInt(dayStr, 10);
        if (!isNaN(day)) {
          map[day] = { id: ev.id, title: ev.title, dateStr: ev.date };
        }
      }
    });
    return map;
  };
  
  const eventDatesMap = getEventDatesMap();

  // Immersive Spatial Mesh Particle Canvas Simulation (Sage/Mint Pastel style)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle nodes
    const particleCount = 45;
    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];

    const colors = [
      'hsla(145, 45%, 62%, 0.15)', // Sage Green
      'hsla(168, 48%, 62%, 0.12)', // Mint Teal
      'hsla(18, 65%, 72%, 0.1)'    // Peach Coral
    ];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 120 + 80,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw floating nodes with soft blur properties
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Boundary bounce
        if (p.x < -100 || p.x > width + 100) p.vx *= -1;
        if (p.y < -100 || p.y > height + 100) p.vy *= -1;

        // Draw node gradient circle
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius);
        gradient.addColorStop(0, p.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  // Filter events by category, query search, AND selected calendar date
  const filteredEvents = events.filter((ev) => {
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          ev.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDate = !selectedDateFilter || ev.date === selectedDateFilter;
    return matchesCategory && matchesSearch && matchesDate;
  });

  const handleConfirmBooking = (newTicket: Ticket) => {
    // Deduct one spot from the state list to reflect live reservation
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === newTicket.event.id ? { ...ev, spotsLeft: ev.spotsLeft - 1 } : ev
      )
    );

    // Save ticket to our mock user database
    setTickets((prevTickets) => [newTicket, ...prevTickets]);
    setActiveBookEvent(null);
    setNewlyBookedTicket(newTicket); // Show native greeting overlay!

    // Dynamic celebration!
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#86efac', '#67e8f9', '#fca5a5', '#ffffff']
    });
  };

  const handleCancelTicket = (ticketId: string) => {
    const ticketToCancel = tickets.find((tkt) => tkt.id === ticketId);
    if (!ticketToCancel) return;

    // Restore spots count in mock db state
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === ticketToCancel.event.id ? { ...ev, spotsLeft: ev.spotsLeft + 1 } : ev
      )
    );

    // Remove the ticket
    setTickets((prevTickets) => prevTickets.filter((tkt) => tkt.id !== ticketId));
  };

  const handleToggleCheckIn = (ticketId: string) => {
    setTickets((prevTickets) =>
      prevTickets.map((tkt) =>
        tkt.id === ticketId ? { ...tkt, isCheckedIn: !tkt.isCheckedIn } : tkt
      )
    );
  };

  // Add/Save Event Form Submission handler
  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validations
    if (!newTitle.trim()) return setFormError('Title is required.');
    if (!newSubtitle.trim()) return setFormError('Subtitle is required.');
    if (!newDesc.trim()) return setFormError('Description is required.');
    if (!newDate.trim()) return setFormError('Scheduled date is required.');
    if (!newLoc.trim()) return setFormError('Location is required.');
    if (!newGreeting.trim()) return setFormError('Attendee welcome greeting is required.');

    // Stable default map link
    const fallbackMapUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835431707!2d144.963!3d-37.814!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b8e390!2sMelbourne!5e0!3m2!1sen!2sau!4v1700000000000`;

    const parsedSlots = newSlots.split(',').map((s) => s.trim()).filter(Boolean);

    if (editingEventId) {
      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === editingEventId
            ? {
                ...ev,
                title: newTitle.trim(),
                subtitle: newSubtitle.trim(),
                description: newDesc.trim(),
                category: newCategory,
                date: newDate.trim(),
                timeSlots: parsedSlots.length > 0 ? parsedSlots : ['10:00 AM', '02:00 PM'],
                duration: newDuration.trim() || '2 hours',
                location: newLoc.trim(),
                pricing: newPricing.trim() || 'Free Public Event',
                weather: {
                  temp: newTemp || '15°C',
                  status: newWeatherStatus || 'Mild Autumn Day',
                  icon: newWeatherIcon,
                  description: newWeatherDesc || 'Partly cloudy sky predictions.'
                },
                greeting: newGreeting.trim()
              }
            : ev
        )
      );
      setEditingEventId(null);
    } else {
      const newlyCreated: AppleEvent = {
        id: `ev-${Math.random().toString(36).substr(2, 9)}`,
        title: newTitle.trim(),
        subtitle: newSubtitle.trim(),
        description: newDesc.trim(),
        category: newCategory,
        date: newDate.trim(),
        timeSlots: parsedSlots.length > 0 ? parsedSlots : ['10:00 AM', '02:00 PM'],
        duration: newDuration.trim() || '2 hours',
        location: newLoc.trim(),
        spotsLeft: newMaxSpots,
        maxSpots: newMaxSpots,
        imageUrl: newImgUrl.trim() || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80',
        pricing: newPricing.trim() || 'Free Public Event',
        features: ['Local community meetup', 'Live mock presentation', 'Culture guide support'],
        googleMapEmbedUrl: fallbackMapUrl,
        weather: {
          temp: newTemp || '15°C',
          status: newWeatherStatus || 'Mild Autumn Day',
          icon: newWeatherIcon,
          description: newWeatherDesc || 'Partly cloudy sky predictions.'
        },
        greeting: newGreeting.trim()
      };
      setEvents((prev) => [newlyCreated, ...prev]);
    }
    
    // Reset Form fields
    handleCancelEdit();

    // Celebratory confirmation confetti
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#86efac', '#ffffff']
    });
  };

  const handleEditClick = (ev: AppleEvent) => {
    setEditingEventId(ev.id);
    setNewTitle(ev.title);
    setNewSubtitle(ev.subtitle);
    setNewDesc(ev.description);
    setNewCategory(ev.category);
    setNewDate(ev.date);
    setNewSlots(ev.timeSlots.join(', '));
    setNewLoc(ev.location);
    setNewMaxSpots(ev.maxSpots);
    setNewPricing(ev.pricing);
    setNewGreeting(ev.greeting);
    setNewTemp(ev.weather.temp);
    setNewWeatherStatus(ev.weather.status);
    setNewWeatherIcon(ev.weather.icon);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingEventId(null);
    setNewTitle('');
    setNewSubtitle('');
    setNewDesc('');
    setNewCategory('demo');
    setNewDate('2026-06-10');
    setNewSlots('09:00 AM, 01:00 PM, 05:00 PM');
    setNewLoc('Melbourne Town Hall, VIC');
    setNewPricing('Free Public Event');
    setNewMaxSpots(30);
    setNewTemp('15°C');
    setNewWeatherStatus('Mild Autumn Day');
    setNewWeatherIcon('cloud-sun');
    setNewGreeting('A warm welcome to Melbourne Town Hall!');
    setFormError(null);
  };

  // Remove Event handler
  const handleRemoveEvent = (eventId: string) => {
    if (window.confirm('Are you absolutely sure you want to delete this mockup event? This will remove all listing items.')) {
      setEvents((prev) => prev.filter((ev) => ev.id !== eventId));
      
      // Clear date filters if it was matching the removed date
      setSelectedDateFilter(null);
    }
  };

  // High-Fidelity pass ticket file downloader
  const downloadMockPassFile = (ticket: Ticket) => {
    const maskEmail = (email: string) => {
      const parts = email.split('@');
      if (parts.length !== 2) return '***@***.com';
      const [name, domain] = parts;
      return `${name.substring(0, 2)}***@${domain}`;
    };    const addonsStr = ticket.selectedAddOns && ticket.selectedAddOns.length > 0
      ? ticket.selectedAddOns.map(addon => `  * ${addon.icon} ${addon.name} (+$${addon.price})`).join('\n')
      : '  * None';

    const fileContent = `
==================================================
        MELBOURNE FESTIVAL MOCKUP ACCESS KEY
==================================================
RESERVATION CODE: ${ticket.id.toUpperCase()}
STATUS:           ${ticket.isCheckedIn ? 'VALIDATED & CHECKED IN' : 'ISSUED & ACTIVE'}
EVENT:            ${ticket.event.title}
GREETING:         ${ticket.event.greeting}
SUBTITLE:         ${ticket.event.subtitle}
VENUE:            ${ticket.event.location}
DATE:             ${ticket.event.date}
TIME SLOT:        ${ticket.timeSlot}
SEAT NUMBER:      DESK ${ticket.seatNumber}

SELECTED UPGRADES:
${addonsStr}

ATTENDEE NAME:    ${ticket.userName}
CREDENTIALS:      ${maskEmail(ticket.userEmail)}
SECURED ON:       ${ticket.bookingDate}

--------------------------------------------------
MELBOURNE WEATHER OUTLOOK:
TEMP:             ${ticket.event.weather.temp} (${ticket.event.weather.status})
OUTLOOK:          ${ticket.event.weather.description}
--------------------------------------------------
ENTRY POLICY:
Present the check-in QR code shown in your digital 
Mockup Pass inside the slide drawer. Doors open 
15 minutes before the scheduled slot.
--------------------------------------------------
      Thank you for using our Mockup Platform!
==================================================
`;

    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Mockup_Pass_${ticket.id.toUpperCase()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <main style={{ position: 'relative', minHeight: '100vh', width: '100%', padding: '0 0 80px 0' }}>
      {/* Background Animated Canvas */}
      <canvas ref={canvasRef} className="mesh-bg" />

      {/* Main Global Layout */}
      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* Navigation Bar */}
        <header style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          padding: '24px 0', 
          borderBottom: '1px solid var(--bg-glass-border)',
          marginBottom: '48px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem', filter: 'drop-shadow(0 0 8px var(--color-primary-glow))' }}>🎟️</span>
            <div>
              <h1 style={{ fontSize: '1.5rem', color: '#fff', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                Mockup Space
              </h1>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Melbourne Multicultural Festivals Mockup
              </p>
            </div>
          </div>

          {/* Navigation Action Panel */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            
            {/* Role switcher toggle */}
            <button 
              onClick={() => setUserRole(userRole === 'attendee' ? 'admin' : 'attendee')}
              className="btn-secondary"
              style={{
                borderColor: userRole === 'admin' ? 'var(--color-accent-rose)' : undefined,
                color: userRole === 'admin' ? 'hsl(18, 65%, 72%)' : undefined,
                gap: '6px',
                fontSize: '0.85rem',
                padding: '10px 16px'
              }}
            >
              <Layers size={14} />
              <span>Switch to {userRole === 'attendee' ? 'Admin View' : 'Attendee View'}</span>
            </button>

            {/* My Mockup Keys Drawer button */}
            {userRole === 'attendee' && (
              <button 
                onClick={() => setIsDrawerOpen(true)}
                className="btn-secondary" 
                style={{ 
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 20px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--bg-glass-border)'
                }}
              >
                <TicketIcon size={16} style={{ color: 'var(--color-primary)' }} />
                <span>My Mockup Keys</span>
                {tickets.length > 0 && (
                  <span style={{
                    position: 'absolute',
                    top: '-8px',
                    right: '-8px',
                    background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-teal))',
                    color: 'hsl(145, 25%, 8%)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 10px var(--color-primary-glow)'
                  }}>
                    {tickets.length}
                  </span>
                )}
              </button>
            )}

          </div>
        </header>

        {/* HERO SECTION */}
        <section style={{ textAlign: 'center', marginBottom: '48px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
          <div style={{
            background: userRole === 'admin' ? 'hsla(18, 65%, 72%, 0.1)' : 'hsla(145, 45%, 62%, 0.1)',
            border: userRole === 'admin' ? '1px solid var(--color-accent-rose)' : '1px solid var(--color-primary)',
            color: userRole === 'admin' ? 'var(--color-accent-rose)' : 'var(--color-primary)',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.78rem',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Cpu size={12} /> {userRole === 'admin' ? 'Administrative Control Center' : 'Live Melbourne Cultural Calendar'}
          </div>
          <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', maxWidth: '800px', lineHeight: '1.15' }}>
            {userRole === 'admin' ? 'Manage Mockup Cultural Festivals' : 'Book a Mockup of Melbourne Cultural Events'}
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '600px', lineHeight: '1.6' }}>
            {userRole === 'admin' 
              ? 'Publish new mockup cultural events in Melbourne, schedule times, adjust spaces capacity, or delete expired mockup events.'
              : 'Explore mockups of community celebrations, Greek precinct street meetups, Chinatown lantern parades, and beautiful Federation Square Rangoli light workshops.'}
          </p>
        </section>

        {/* ================================================================= */}
        {/* ======================= ATTENDEE MAIN VIEW ======================= */}
        {/* ================================================================= */}
        {userRole === 'attendee' && (
          <>
            {/* INTERACTIVE CALENDAR AND DASHBOARD SUMMARY */}
            <section style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '32px',
              marginBottom: '48px'
            }}>
              {/* Dashboard Quick Stats */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'hsla(145, 45%, 62%, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <Compass size={24} style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Active Festivals</span>
                    <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>{events.length} Mockup Venues</span>
                  </div>
                </div>

                <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'hsla(168, 48%, 62%, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <Flame size={24} style={{ color: 'var(--color-accent-teal)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Capacity Slots</span>
                    <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>{events.reduce((acc, ev) => acc + ev.spotsLeft, 0)} spots left</span>
                  </div>
                </div>

                <div className="glass" style={{ padding: '20px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ background: 'hsla(18, 65%, 72%, 0.1)', padding: '12px', borderRadius: '12px' }}>
                    <BookOpen size={24} style={{ color: 'var(--color-accent-rose)' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', textTransform: 'uppercase' }}>Mock Keys Active</span>
                    <span style={{ fontSize: '1.4rem', color: '#fff', fontWeight: 700 }}>{tickets.length} issued</span>
                  </div>
                </div>
              </div>

              {/* Interactive Mini-Calendar Month Widget (June 2026) */}
              <div className="glass" style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                flexDirection: 'column',
                gap: '16px',
                border: '1px solid var(--bg-glass-border)',
                boxShadow: '0 8px 32px rgba(0,0,0,0.2)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CalendarIcon size={18} style={{ color: 'var(--color-primary)' }} />
                    <h3 style={{ fontSize: '1.1rem', color: '#fff', fontWeight: 600 }}>June 2026</h3>
                  </div>
                  {selectedDateFilter && (
                    <button
                      onClick={() => setSelectedDateFilter(null)}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--color-accent-rose)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        backgroundColor: 'rgba(235, 87, 87, 0.05)'
                      }}
                    >
                      <RefreshCw size={10} /> Clear Filter
                    </button>
                  )}
                </div>

                {/* Calendar Days Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  textAlign: 'center',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                  color: 'var(--text-muted)',
                  borderBottom: '1px solid var(--bg-glass-border)',
                  paddingBottom: '8px'
                }}>
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                </div>

                {/* Calendar Days Grid */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  rowGap: '10px',
                  columnGap: '6px',
                  fontSize: '0.85rem'
                }}>
                  {Array.from({ length: 30 }, (_, idx) => {
                    const day = idx + 1;
                    const dateStr = `2026-06-${day < 10 ? '0' + day : day}`;
                    const eventInfo = eventDatesMap[day];
                    const isSelected = selectedDateFilter === dateStr;

                    return (
                      <button
                        key={day}
                        onClick={() => {
                          if (eventInfo) {
                            setSelectedDateFilter(isSelected ? null : dateStr);
                          }
                        }}
                        style={{
                          height: '38px',
                          background: isSelected 
                            ? 'var(--color-primary)' 
                            : eventInfo 
                              ? 'hsla(145, 45%, 62%, 0.06)' 
                              : 'transparent',
                          color: isSelected 
                            ? 'hsl(145, 25%, 8%)' 
                            : eventInfo 
                              ? '#fff' 
                              : 'var(--text-muted)',
                          border: '1px solid',
                          borderColor: isSelected 
                            ? 'var(--color-primary)' 
                            : eventInfo 
                              ? 'var(--bg-glass-border)' 
                              : 'transparent',
                          borderRadius: '8px',
                          cursor: eventInfo ? 'pointer' : 'default',
                          fontWeight: eventInfo ? 700 : 400,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          position: 'relative',
                          transition: 'var(--transition-fast)'
                        }}
                        title={eventInfo ? `${eventInfo.title} (${dateStr})` : undefined}
                        disabled={!eventInfo}
                      >
                        <span>{day}</span>
                        {eventInfo && !isSelected && (
                          <span style={{
                            width: '4px',
                            height: '4px',
                            borderRadius: '50%',
                            background: 'var(--color-primary)',
                            position: 'absolute',
                            bottom: '4px',
                            boxShadow: '0 0 4px var(--color-primary-glow)'
                          }} />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* SEARCH AND FILTER BAR */}
            <section className="glass" style={{ 
              padding: '16px 24px', 
              borderRadius: 'var(--radius-lg)', 
              marginBottom: '40px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '20px',
              flexWrap: 'wrap'
            }}>
              {/* Tabs Filter */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {['all', 'demo', 'lab', 'workshop', 'keynote'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      border: '1px solid',
                      borderColor: selectedCategory === cat ? 'var(--color-primary)' : 'transparent',
                      background: selectedCategory === cat ? 'hsla(145, 45%, 62%, 0.12)' : 'transparent',
                      color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      textTransform: 'capitalize',
                      transition: 'var(--transition-fast)'
                    }}
                  >
                    {cat === 'all' ? 'All Mockups' : `Mockup of ${cat}`}
                  </button>
                ))}
              </div>

              {/* Search box */}
              <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                <Search size={16} style={{ 
                  position: 'absolute', 
                  top: '50%', 
                  left: '14px', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} />
                <input 
                  type="text" 
                  placeholder="Search mockup events..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px 10px 38px',
                    borderRadius: '20px',
                    border: '1px solid var(--bg-glass-border)',
                    background: 'var(--bg-glass-highlight)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    transition: 'var(--transition-fast)'
                  }}
                />
              </div>
            </section>

            {/* EVENTS LISTING GRID */}
            {filteredEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
                <span style={{ fontSize: '3rem' }}>🔍</span>
                <h4 style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', marginTop: '16px' }}>No matches found</h4>
                <p style={{ fontSize: '0.9rem', marginTop: '8px' }}>Adjust your date calendar selections or query filter tabs.</p>
              </div>
            ) : (
              <section style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px'
              }}>
                {filteredEvents.map((ev) => (
                  <EventCard 
                    key={ev.id} 
                    event={ev} 
                    onBookClick={(e) => setActiveBookEvent(e)} 
                  />
                ))}
              </section>
            )}
          </>
        )}

        {/* ================================================================= */}
        {/* ========================= ADMIN VIEW PANEL ======================= */}
        {/* ================================================================= */}
        {userRole === 'admin' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '32px',
            alignItems: 'start'
          }}>
            
            {/* Column 1: Add New Event Form */}
            <div className="glass" style={{
              padding: '28px',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid hsla(18, 65%, 72%, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              <div>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {editingEventId ? <Edit size={18} style={{ color: 'var(--color-primary)' }} /> : <Plus size={18} style={{ color: 'var(--color-accent-rose)' }} />}
                  {editingEventId ? 'Edit Event Mockup' : 'Publish Mockup Event'}
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {editingEventId ? 'Modify active settings for this multicultural event.' : 'Add a new multicultural event to the active state listings.'}
                </p>
              </div>

              <form onSubmit={handleAddEvent} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                
                {/* Event Title */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Event Title</label>
                  <input 
                    type="text" 
                    value={newTitle} 
                    onChange={(e) => setNewTitle(e.target.value)} 
                    placeholder="e.g. Mockup of Italian Festa"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Subtitle Banner</label>
                  <input 
                    type="text" 
                    value={newSubtitle} 
                    onChange={(e) => setNewSubtitle(e.target.value)} 
                    placeholder="e.g. Celebrating Lygon St Heritage"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Category & Date */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Category</label>
                    <select 
                      value={newCategory} 
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'hsl(145, 14%, 12%)', color: '#fff', fontSize: '0.85rem' }}
                    >
                      <option value="demo">Demo Showcase</option>
                      <option value="lab">Community Gathering</option>
                      <option value="workshop">Cultural Workshop</option>
                      <option value="keynote">Community Keynote</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Date (June 2026)</label>
                    <input 
                      type="date" 
                      value={newDate} 
                      onChange={(e) => setNewDate(e.target.value)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Time Slots & Location */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Time Slots (Comma split)</label>
                    <input 
                      type="text" 
                      value={newSlots} 
                      onChange={(e) => setNewSlots(e.target.value)}
                      placeholder="e.g. 10:00 AM, 02:00 PM"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Max Capacity (Spots)</label>
                    <input 
                      type="number" 
                      value={newMaxSpots} 
                      onChange={(e) => setNewMaxSpots(parseInt(e.target.value, 10) || 10)}
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Location Venue</label>
                  <input 
                    type="text" 
                    value={newLoc} 
                    onChange={(e) => setNewLoc(e.target.value)}
                    placeholder="e.g. Federation Square, Melbourne"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                  />
                </div>

                {/* Description */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Description Summary</label>
                  <textarea 
                    value={newDesc} 
                    onChange={(e) => setNewDesc(e.target.value)} 
                    placeholder="Enter interactive meetup overview details..."
                    rows={3}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem', resize: 'none' }}
                  />
                </div>

                {/* Event Greeting & Price */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Event Greeting</label>
                    <input 
                      type="text" 
                      value={newGreeting} 
                      onChange={(e) => setNewGreeting(e.target.value)}
                      placeholder="e.g. Welcome to Lygon St!"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Pricing Label</label>
                    <input 
                      type="text" 
                      value={newPricing} 
                      onChange={(e) => setNewPricing(e.target.value)}
                      placeholder="e.g. $10 Pass"
                      style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.85rem' }}
                    />
                  </div>
                </div>

                {/* Weather Settings */}
                <div style={{
                  borderTop: '1px solid var(--bg-glass-border)',
                  paddingTop: '10px',
                  marginTop: '4px'
                }}>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>
                    Melbourne Weather Outlook Setup
                  </span>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Temp</label>
                      <input type="text" value={newTemp} onChange={(e) => setNewTemp(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Status</label>
                      <input type="text" value={newWeatherStatus} onChange={(e) => setNewWeatherStatus(e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--bg-glass-border)', background: 'var(--bg-glass-highlight)', color: '#fff', fontSize: '0.8rem' }} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Icon</label>
                      <select value={newWeatherIcon} onChange={(e) => setNewWeatherIcon(e.target.value as any)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--bg-glass-border)', background: 'hsl(145, 14%, 12%)', color: '#fff', fontSize: '0.8rem' }}>
                        <option value="sun">Sunny</option>
                        <option value="rain">Rainy</option>
                        <option value="wind">Windy</option>
                        <option value="moon">Night</option>
                        <option value="cloud-sun">Cloudy</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Form Error Message */}
                {formError && (
                  <div style={{
                    background: 'rgba(235, 87, 87, 0.1)',
                    border: '1px solid hsl(350, 95%, 60%)',
                    color: 'hsl(350, 95%, 70%)',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}>
                    <ShieldAlert size={14} />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Submit button */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {editingEventId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="btn-secondary"
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        borderColor: 'var(--bg-glass-border)',
                        color: 'var(--text-secondary)',
                        padding: '12px'
                      }}
                    >
                      Cancel
                    </button>
                  )}
                  <button
                    type="submit"
                    className="btn-primary"
                    style={{
                      flex: 2,
                      justifyContent: 'center',
                      background: editingEventId 
                        ? 'linear-gradient(135deg, var(--color-primary), hsl(145, 45%, 52%))'
                        : 'linear-gradient(135deg, var(--color-accent-rose), hsl(18, 65%, 62%))',
                      color: 'hsl(145, 25%, 8%)',
                      boxShadow: 'none',
                      padding: '12px'
                    }}
                  >
                    {editingEventId ? <CheckCircle size={16} /> : <Plus size={16} />}
                    <span>{editingEventId ? ' Save Changes' : ' Publish Mockup Event'}</span>
                  </button>
                </div>

              </form>

            </div>

            {/* Column 2: Deletion control list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <div className="glass" style={{
                padding: '24px',
                borderRadius: 'var(--radius-lg)'
              }}>
                <h3 style={{ fontSize: '1.2rem', color: '#fff', marginBottom: '16px' }}>
                  Manage Active Mockups ({events.length})
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {events.map((ev) => (
                    <div 
                      key={ev.id}
                      style={{
                        background: 'hsla(0,0%,100%,0.02)',
                        border: '1px solid var(--bg-glass-border)',
                        padding: '16px',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '12px'
                      }}
                    >
                      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                        <h4 style={{ fontSize: '0.98rem', color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{ev.title}</h4>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'block', marginTop: '2px' }}>
                          {ev.date} — {ev.location}
                        </span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => handleEditClick(ev)}
                          className="btn-secondary"
                          style={{
                            padding: '8px 12px',
                            color: 'var(--color-primary)',
                            background: 'hsla(145, 45%, 62%, 0.05)',
                            borderColor: 'hsla(145, 45%, 62%, 0.3)',
                            fontSize: '0.8rem',
                            gap: '4px'
                          }}
                        >
                          <Edit size={12} /> Edit
                        </button>
                        
                        <button
                          onClick={() => handleRemoveEvent(ev.id)}
                          className="btn-secondary"
                          style={{
                            padding: '8px 12px',
                            color: 'hsl(350, 95%, 70%)',
                            background: 'rgba(235, 87, 87, 0.05)',
                            borderColor: 'rgba(235, 87, 87, 0.3)',
                            fontSize: '0.8rem',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        )}

      </div>

      {/* MODALS AND SIDEPANELS */}
      {activeBookEvent && (
        <BookingModal 
          event={activeBookEvent} 
          onClose={() => setActiveBookEvent(null)}
          onConfirm={handleConfirmBooking}
        />
      )}

      <TicketsDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        tickets={tickets} 
        onCancelTicket={handleCancelTicket}
        onToggleCheckIn={handleToggleCheckIn}
      />

      {/* MULTICULTURAL NATIVE GREETING OVERLAY */}
      {newlyBookedTicket && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(5, 5, 8, 0.9)',
          backdropFilter: 'blur(20px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1100,
          padding: '20px'
        }}>
          <div className="glass" style={{
            width: '100%',
            maxWidth: '500px',
            borderRadius: 'var(--radius-lg)',
            padding: '40px 32px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '24px',
            boxShadow: '0 20px 60px rgba(0,0,0,0.7)',
            border: '1px solid hsla(145, 45%, 62%, 0.2)'
          }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: 'hsla(145, 45%, 62%, 0.1)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid var(--color-primary)',
              boxShadow: '0 0 20px var(--color-primary-glow)',
              fontSize: '2rem'
            }}>
              ✓
            </div>

            <div>
              <span style={{ 
                fontSize: '2.2rem', 
                fontWeight: 800, 
                color: 'var(--color-primary)', 
                display: 'block',
                fontFamily: 'Outfit',
                letterSpacing: '-0.02em'
              }}>
                Reservation Secured!
              </span>
              <span style={{ 
                fontSize: '1rem', 
                color: 'var(--text-secondary)',
                fontWeight: 600,
                display: 'block',
                marginTop: '8px',
                fontStyle: 'italic'
              }}>
                "{newlyBookedTicket.event.greeting}"
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
              Your reservation key for the <strong>{newlyBookedTicket.event.title}</strong> is officially secured on desk <strong>{newlyBookedTicket.seatNumber}</strong> at <strong>{newlyBookedTicket.timeSlot}</strong>.
            </p>

            {/* Actions Panel */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
              <button
                onClick={() => downloadMockPassFile(newlyBookedTicket)}
                className="btn-primary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                <Download size={16} />
                Download Mockup Access Pass (.txt)
              </button>

              <button
                onClick={() => {
                  setNewlyBookedTicket(null);
                  setIsDrawerOpen(true);
                }}
                className="btn-secondary"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  padding: '12px'
                }}
              >
                <ExternalLink size={16} />
                View in digital Wallet drawer
              </button>
            </div>

          </div>
        </div>
      )}
    </main>
  );
}
