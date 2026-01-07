import React from 'react';
import { 
  Navbar, 
  Hero, 
  About, 
  Services, 
  Testimonials, 
  Contact
} from './components/LandingSections';

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
    </div>
  );
}

export default App;