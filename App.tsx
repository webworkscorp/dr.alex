import React from 'react';
import { 
  Navbar, 
  Hero, 
  About, 
  Services, 
  Testimonials, 
  Contact
} from './components/LandingSections';
import { ChatWidget } from './components/ChatWidget';

function App() {
  return (
    <div className="relative min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero id="inicio" />
        <About id="nosotros" />
        <Services id="metodo" />
        <Testimonials id="historias" />
        <Contact id="contacto" />
      </main>
      <ChatWidget />
    </div>
  );
}

export default App;