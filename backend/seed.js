import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

dotenv.config();

const products = [
  {
    name: 'Nebula Glass Keyboard',
    description: 'Frosted crystal-glass body with customizable underglow RGB, hot-swappable tactile switches, and premium sound dampening.',
    price: 189.99,
    category: 'Keyboards',
    imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    stockCount: 15,
  },
  {
    name: 'Aura Sound Pods',
    description: 'True wireless earbuds with transparent acrylic styling, high-fidelity acoustics, active noise cancellation, and 30-hour battery life.',
    price: 149.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    stockCount: 22,
  },
  {
    name: 'Quantum Prism Display',
    description: 'Frameless glowing glass ambient screen, 144Hz high refresh rate, HDR 400 support, perfect for secondary dashboard panels.',
    price: 499.99,
    category: 'Monitors',
    imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    stockCount: 8,
  },
  {
    name: 'Chronos Smart Glass Tracker',
    description: 'Premium circular smartwatch featuring a glowing holographic-inspired watch interface, health tracking metrics, and custom alerts.',
    price: 299.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stockCount: 12,
  },
  {
    name: 'Eclipse Charging Dock',
    description: 'Induction charging pad with dynamic ambient LED rings, frosted glass top-plate, and 15W fast wireless power transmission.',
    price: 79.99,
    category: 'Accessories',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXCZd6vPM0gNuKewlhQz3EIyaoA7Gt11oCP8IgL9GDD5WeBLqpOAjvY9Ps&s=10',
    rating: 4.4,
    stockCount: 30,
  },
  {
    name: 'Spectra Glass Mouse',
    description: 'High-precision optical gaming mouse with transparent shell, breathing gradient lights, and low latency wireless capability.',
    price: 99.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    stockCount: 25,
  },
  {
    name: 'Vortex Mech Keyboard',
    description: 'Ultra-compact 65% mechanical keyboard with dynamic RGB lighting and fully transparent keycaps for max underglow.',
    price: 159.99,
    category: 'Keyboards',
    imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stockCount: 18,
  },
  {
    name: 'Aero Wireless Earbuds',
    description: 'Active sport earbuds with sweatproof transparent shell, custom audio driver tuning, and dynamic bass boosting.',
    price: 129.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=600',
    rating: 4.3,
    stockCount: 40,
  },
  {
    name: 'Aether Curved Monitor',
    description: '34-inch curved ultra-wide gaming panel featuring customizable rear ambient light bars and crystal-clear display output.',
    price: 699.99,
    category: 'Monitors',
    imageUrl: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    stockCount: 6,
  },
  {
    name: 'Nova Fit Band',
    description: 'Sleek, lightweight fitness tracking band featuring a glowing AMOLED interface, step tracking, and sleep metrics.',
    price: 119.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&q=80&w=600',
    rating: 4.2,
    stockCount: 50,
  },
  {
    name: 'Lumen Desk Mat',
    description: 'Premium glass-threaded mouse pad featuring integrated neon RGB border lines and a low-friction surface.',
    price: 49.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1616440347437-b1c73416efc2?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stockCount: 35,
  },
  {
    name: 'Cosmos VR Visor',
    description: 'Next-generation Virtual Reality headset featuring a transparent glowing visor shell and ultra-high pixel density lenses.',
    price: 599.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&q=80&w=600',
    rating: 4.7,
    stockCount: 10,
  },
  {
    name: 'Helix Multi-Hub',
    description: 'Universal USB-C dock featuring a transparent acrylic body, dual HDMI output ports, card reader, and 100W power delivery.',
    price: 69.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    stockCount: 28,
  },
  {
    name: 'Solaris Globe Lamp',
    description: 'Touch-sensitive ambient desk light featuring a glowing glass orb, customizable warm hues, and a wireless charging base.',
    price: 89.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stockCount: 15,
  },
  {
    name: 'Obsidian Keyboard',
    description: 'Retro mechanical keyboard with custom dark keycaps, hot-swappable switches, and integrated volume control roller.',
    price: 219.99,
    category: 'Keyboards',
    imageUrl: 'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&q=80&w=600',
    rating: 4.9,
    stockCount: 12,
  },
  {
    name: 'Nexus Studio Headset',
    description: 'Over-ear studio monitor headphones featuring transparent audio chamber caps, plush memory foam earcups, and high res sound.',
    price: 249.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=600',
    rating: 4.8,
    stockCount: 14,
  },
  {
    name: 'Zenith Projector',
    description: 'Ultra-portable 1080p smart projector with dynamic glass lens, 800 ANSI lumens, and integrated stereo surround speakers.',
    price: 349.99,
    category: 'Monitors',
    imageUrl: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&q=80&w=600',
    rating: 4.4,
    stockCount: 9,
  },
  {
    name: 'Horizon Smart Ring',
    description: 'Bio-tracking health metrics ring with a transparent inner-casing revealing micro-sensors, finished in polished titanium.',
    price: 199.99,
    category: 'Wearables',
    imageUrl: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=600',
    rating: 4.3,
    stockCount: 20,
  },
  {
    name: 'Stellar Speaker Globe',
    description: 'Wireless Bluetooth desktop speaker in a glass globe enclosure with customizable glowing light patterns syncing to audio rhythms.',
    price: 179.99,
    category: 'Audio',
    imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&q=80&w=600',
    rating: 4.6,
    stockCount: 17,
  },
  {
    name: 'Vector Glow Mouse',
    description: 'Lightweight ergonomic gaming mouse with clear shell, custom micro-switches, and smooth ceramic glide feet.',
    price: 89.99,
    category: 'Accessories',
    imageUrl: 'https://images.unsplash.com/photo-1625600243103-1dc6824c6c8a?auto=format&fit=crop&q=80&w=600',
    rating: 4.5,
    stockCount: 24,
  },
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/glass-ecomm';
  try {
    await mongoose.connect(uri);
    console.log('Seed: MongoDB Connected');

    // Clear existing products
    await Product.deleteMany();
    console.log('Seed: Existing products cleared');

    // Insert new products
    await Product.insertMany(products);
    console.log('Seed: Database successfully populated with 20 premium products!');

    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Seed Error: ${error.message}`);
    process.exit(1);
  }
};

seedDB();
