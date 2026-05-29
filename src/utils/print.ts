import type { Ticket } from '../types';

export const printMockPass = (ticket: Ticket) => {
  const maskEmail = (email: string) => {
    const parts = email.split('@');
    if (parts.length !== 2) return '***@***.com';
    const [name, domain] = parts;
    return `${name.substring(0, 2)}***@${domain}`;
  };

  const addonsHtml = ticket.selectedAddOns && ticket.selectedAddOns.length > 0
    ? ticket.selectedAddOns.map(addon => `<li><span class="addon-icon">${addon.icon}</span> <strong>${addon.name}</strong> (+$${addon.price})</li>`).join('')
    : '<li>None</li>';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Pop-up blocker is enabled. Please allow pop-ups to print your pass.');
    return;
  }

  printWindow.document.write(`
    <html>
      <head>
        <title>Access Pass - ${ticket.id.toUpperCase()}</title>
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Inter:wght@400;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f3f4f6;
            color: #1f2937;
            padding: 40px;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
          }
          .ticket-container {
            background: white;
            border-radius: 24px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
            width: 100%;
            max-width: 600px;
            border: 1px solid #e5e7eb;
            overflow: hidden;
            position: relative;
          }
          .header-stripe {
            height: 16px;
            background: linear-gradient(135deg, #72ca97, #70cdba);
            width: 100%;
          }
          .ticket-header {
            padding: 30px;
            border-bottom: 2px dashed #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .ticket-header h2 {
            margin: 0;
            font-family: 'Outfit', sans-serif;
            font-size: 1.6rem;
            color: #111827;
          }
          .ticket-header p {
            margin: 4px 0 0 0;
            font-size: 0.8rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .seat-badge {
            background: #ecfdf5;
            border: 1px solid #a7f3d0;
            color: #065f46;
            padding: 8px 16px;
            border-radius: 12px;
            font-weight: 700;
            font-family: 'Outfit', sans-serif;
          }
          .ticket-body {
            padding: 30px;
          }
          .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
          }
          .info-label {
            font-size: 0.75rem;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            display: block;
            margin-bottom: 4px;
          }
          .info-value {
            font-size: 0.95rem;
            color: #111827;
            font-weight: 600;
          }
          .upgrades-section {
            background: #f9fafb;
            border: 1px solid #f3f4f6;
            padding: 20px;
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .upgrades-title {
            font-size: 0.8rem;
            font-weight: 700;
            color: #374151;
            margin-bottom: 10px;
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          .upgrades-list {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            font-size: 0.85rem;
          }
          .addon-icon {
            font-size: 1.1rem;
            margin-right: 4px;
          }
          .weather-section {
            border: 1px solid #e5e7eb;
            padding: 16px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            background-color: #f0fdf4;
            border-color: #d1fae5;
          }
          .weather-icon {
            font-size: 2rem;
          }
          .weather-temp {
            font-size: 1.1rem;
            font-weight: 700;
            color: #065f46;
          }
          .weather-desc {
            font-size: 0.8rem;
            color: #047857;
            margin-top: 2px;
          }
          .ticket-footer {
            background: #f9fafb;
            padding: 30px;
            border-top: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
          }
          .qr-code-placeholder {
            width: 80px;
            height: 80px;
            border: 1px solid #e5e7eb;
            padding: 6px;
            border-radius: 12px;
            background: white;
          }
          .barcode-svg {
            width: 100%;
            height: 100%;
          }
          .instructions {
            font-size: 0.78rem;
            color: #6b7280;
            max-width: 320px;
            line-height: 1.4;
          }
          
          /* Print Specific Styles */
          @media print {
            body {
              background: white;
              padding: 0;
            }
            .ticket-container {
              box-shadow: none;
              border: none;
              max-width: 100%;
            }
            .no-print {
              display: none;
            }
          }
          
          .print-btn-container {
            position: fixed;
            top: 20px;
            right: 20px;
          }
          .print-btn {
            background: #111827;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            font-family: 'Outfit', sans-serif;
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          }
        </style>
      </head>
      <body>
        <div class="print-btn-container no-print">
          <button class="print-btn" onclick="window.print()">Print / Save as PDF</button>
        </div>
        
        <div class="ticket-container">
          <div class="header-stripe"></div>
          
          <div class="ticket-header">
            <div>
              <h2>${ticket.event.title}</h2>
              <p>Official Entry Pass</p>
            </div>
            <div class="seat-badge">DESK ${ticket.seatNumber}</div>
          </div>
          
          <div class="ticket-body">
            <div class="info-grid">
              <div>
                <span class="info-label">Attendee</span>
                <span class="info-value">${ticket.userName}</span>
              </div>
              <div>
                <span class="info-label">Credentials</span>
                <span class="info-value">${maskEmail(ticket.userEmail)}</span>
              </div>
              <div>
                <span class="info-label">Date & Time</span>
                <span class="info-value">${ticket.event.date} at ${ticket.timeSlot}</span>
              </div>
              <div>
                <span class="info-label">Pass Code</span>
                <span class="info-value" style="font-family: monospace;">${ticket.id.toUpperCase()}</span>
              </div>
              <div style="grid-column: span 2;">
                <span class="info-label">Authorized Venue</span>
                <span class="info-value">${ticket.event.location}</span>
              </div>
            </div>
            
            <div class="upgrades-section">
              <div class="upgrades-title">Selected Upgrades</div>
              <ul class="upgrades-list">
                ${addonsHtml}
              </ul>
            </div>
            
            <div class="weather-section">
              <div class="weather-icon">🌤️</div>
              <div>
                <div class="weather-temp">${ticket.event.weather.temp} — ${ticket.event.weather.status}</div>
                <div class="weather-desc">${ticket.event.weather.description}</div>
              </div>
            </div>
          </div>
          
          <div class="ticket-footer">
            <div class="instructions">
              <strong>Entry Instructions:</strong><br>
              Present this physical pass or QR code at check-in. Doors open 15 minutes prior to slot. Verified under reservation ${ticket.id.toUpperCase()} on ${ticket.bookingDate}.
            </div>
            
            <div class="qr-code-placeholder">
              <svg viewBox="0 0 100 100" class="barcode-svg">
                <rect width="100" height="100" fill="transparent" />
                <rect x="5" y="5" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                <rect x="10" y="10" width="10" height="10" fill="#000" />
                <rect x="75" y="5" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                <rect x="80" y="10" width="10" height="10" fill="#000" />
                <rect x="5" y="75" width="20" height="20" fill="none" stroke="#000" strokeWidth="4" />
                <rect x="10" y="80" width="10" height="10" fill="#000" />
                <circle cx="50" cy="50" r="8" fill="#000" />
                <rect x="35" y="15" width="6" height="6" fill="#000" />
                <rect x="45" y="25" width="12" height="6" fill="#000" />
                <rect x="15" y="35" width="6" height="12" fill="#000" />
                <rect x="55" y="35" width="6" height="6" fill="#000" />
                <rect x="75" y="35" width="12" height="6" fill="#000" />
                <rect x="35" y="65" width="12" height="6" fill="#000" />
                <rect x="15" y="55" width="6" height="6" fill="#000" />
                <rect x="55" y="55" width="6" height="12" fill="#000" />
                <rect x="65" y="75" width="6" height="6" fill="#000" />
                <rect x="75" y="65" width="12" height="12" fill="#000" />
              </svg>
            </div>
          </div>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
