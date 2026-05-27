import type { AppleEvent } from '../types';

export const APPLE_EVENTS: AppleEvent[] = [
  {
    id: 'ev-1',
    title: 'Mockup of Italian Festa',
    subtitle: 'Celebrating Melbourne Italian Culture',
    description: 'Immerse yourself in a simulated presentation of traditional Italian music performances, handmade crafts exhibitions, and a mock culinary guide showcasing the historic heritage of Carlton gardens.',
    category: 'demo',
    date: '2026-06-15',
    timeSlots: ['09:00 AM', '11:00 AM', '01:00 PM', '04:00 PM', '06:00 PM'],
    duration: '2 hours',
    location: 'Carlton Gardens, Melbourne VIC',
    spotsLeft: 12,
    maxSpots: 50,
    imageUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=600&q=80',
    pricing: 'Free Public Event',
    features: ['Cultural dance showcases', 'Mock cooking demonstrations', 'Interactive craft marketplace'],
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.48443900388!2d144.9685375!3d-37.8021151!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642cb1a5e17ad%3A0xf0456760532d840!2sCarlton%20Gardens!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
    weather: {
      temp: '16°C',
      status: 'Sage-green Sunny',
      icon: 'sun',
      description: 'Clear, crisp Melbourne autumn afternoon. Ideal weather for walking around the Carlton Gardens lawn.'
    },
    greeting: 'A warm welcome to Carlton Gardens!'
  },
  {
    id: 'ev-2',
    title: 'Mockup of Greek Festival',
    subtitle: 'Lonsdale Street Greek Precinct Meetup',
    description: 'A mock cultural lab bringing interactive traditional instrument tutoring, historic folk dance tutorials, and architectural history workshops straight to the heart of the Lonsdale Street Greek Precinct.',
    category: 'lab',
    date: '2026-06-18',
    timeSlots: ['10:00 AM', '02:00 PM', '05:00 PM'],
    duration: '3 hours',
    location: 'Lonsdale St, Melbourne VIC 3000',
    spotsLeft: 8,
    maxSpots: 30,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80',
    pricing: '$15 Entry Pass',
    features: ['Bouzouki software tuner sandbox', 'Folk dance steps choreography', 'Historic migration lecture'],
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.9866896200236!2d144.9647248!3d-37.8117765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642ca024bbfcf%3A0xdb65fa638c11e5f8!2sLonsdale%20St%2C%20Melbourne%20VIC!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
    weather: {
      temp: '14°C',
      status: 'Showers Predicted',
      icon: 'rain',
      description: 'Quick local Melbourne showers. Sage umbrellas highly recommended for Lonsdale Street walks!'
    },
    greeting: 'Join us under the Lonsdale Street lights!'
  },
  {
    id: 'ev-3',
    title: 'Mockup of Lunar New Year',
    subtitle: 'Chinatown Lantern Showcase Broadcast',
    description: 'Join a mock keynote presentation covering lantern assembly, calligraphy structures, and dynamic visual lion dance performances broadcast live across the vibrant lanes of Melbourne Chinatown.',
    category: 'keynote',
    date: '2026-06-25',
    timeSlots: ['07:00 PM'],
    duration: '90 mins',
    location: 'Chinatown Melbourne, VIC 3000',
    spotsLeft: 5,
    maxSpots: 100,
    imageUrl: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80',
    pricing: 'Invitation Only',
    features: ['Lion dance choreography notes', 'Holographic paper lantern craft', 'Traditional tea balance study'],
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.9610196238697!2d144.9669527!3d-37.8123847!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642cb3a903c73%3A0xe54e3d360ef3a726!2sChinatown%20Melbourne!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
    weather: {
      temp: '12°C',
      status: 'Crisp Clear Night',
      icon: 'moon',
      description: 'Crisp winter night sky. Perfect atmosphere to experience traditional Chinatown Melbourne lights.'
    },
    greeting: 'Celebrate the Spring Festival with Chinatown Melbourne!'
  },
  {
    id: 'ev-4',
    title: 'Mockup of Diwali Lights',
    subtitle: 'Federation Square Craft & Rangoli Lab',
    description: 'An interactive design workshop learning Rangoli grid layouts, simulated clay Diya molding, and festive light pattern calibrations on the beautiful stages of Federation Square.',
    category: 'workshop',
    date: '2026-06-20',
    timeSlots: ['11:00 AM', '03:00 PM', '07:00 PM'],
    duration: '2 hours',
    location: 'Federation Square, Melbourne VIC',
    spotsLeft: 14,
    maxSpots: 40,
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658bdfaf1?auto=format&fit=crop&w=600&q=80',
    pricing: '$25 Materials Fee',
    features: ['Live Rangoli layout grid tool', 'Diya pattern configurations', 'Spiritual stories storytelling'],
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8210301037593!2d144.9671158!3d-37.8180173!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642b655f46eb3%3A0x2a3e0f9b699a77ef!2sFederation%20Square!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
    weather: {
      temp: '13°C',
      status: 'Cool Evening Breeze',
      icon: 'wind',
      description: 'Cool breeze sweeping through the Yarra. Wrap up warm to experience the lights at Fed Square.'
    },
    greeting: 'May your time at Federation Square be filled with light!'
  },
  {
    id: 'ev-5',
    title: 'Mockup of Johnston St Fiesta',
    subtitle: 'Hispanic Folk Dance & Rhythms Lab',
    description: 'A technical cultural lab teaching Hispanic guitar acoustics, rhythmic percussion timings, and vibrant flamenco choreographies directly from historic Johnston Street Fitzroy.',
    category: 'lab',
    date: '2026-06-28',
    timeSlots: ['12:00 PM', '04:00 PM'],
    duration: '90 mins',
    location: 'Johnston St, Fitzroy VIC 3065',
    spotsLeft: 6,
    maxSpots: 15,
    imageUrl: 'https://images.unsplash.com/photo-1545128485-c400e7702796?auto=format&fit=crop&w=600&q=80',
    pricing: 'Free Public Event',
    features: ['Flamenco guitar dynamic demo', 'Latin percussion mapping tools', 'Street stage entry pass'],
    googleMapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3152.339247656681!2d144.977271!3d-37.800085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642d99dcd7573%3A0xa19c1187425164d!2sJohnston%20St%2C%20Fitzroy%20VIC!5e0!3m2!1sen!2sau!4v1700000000000!5m2!1sen!2sau',
    weather: {
      temp: '15°C',
      status: 'Partly Cloudy',
      icon: 'cloud-sun',
      description: 'Classic Fitzroy day. Mild and partly cloudy, excellent for sidewalk cafe meetups.'
    },
    greeting: 'Feel the vibrant Hispanic rhythms of Fitzroy!'
  }
];
