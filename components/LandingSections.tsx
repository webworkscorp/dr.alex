import React, { useState, useEffect, useRef } from 'react';
import { 
  X, ArrowRight, Activity, Star, 
  ArrowUpRight, MoveDown,
  Scan, Zap, Shield, ChevronRight,
  MapPin, Phone
} from 'lucide-react';
import { SectionProps } from '../types';

// --- Utility: Reveal on Scroll ---
const Reveal: React.FC<{ children: React.ReactNode; className?: string; delay?: number }> = ({ children, className = "", delay = 0 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div 
      ref={ref} 
      className={`reveal-section ${isVisible ? 'reveal-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

// --- Navbar ---
export const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Lower threshold for quicker reaction
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // ROBUST NAVIGATION HANDLER
  const scrollToSection = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    
    // Small timeout to allow the menu close animation to start/finish prevents UI jank
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        const navbarHeight = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth"
        });
      }
    }, 10);
  };

  const navLinks = [
    { name: 'Nosotros', href: 'nosotros' },
    { name: 'Método', href: 'metodo' },
    { name: 'Historias', href: 'historias' }
  ];

  return (
    <>
      {/* Navbar Fixed - Z-Index 100 to stay on top */}
      <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-sm py-4 border-b border-slate-100 shadow-sm' : 'bg-transparent py-6 md:py-8'}`}>
        <div className="container mx-auto px-6 lg:px-16 flex items-center justify-between">
            
            {/* Logo */}
            <a href="#inicio" onClick={(e) => scrollToSection(e, 'inicio')} className="relative z-[100] group select-none cursor-pointer block">
              <span className="font-heading font-bold text-lg tracking-tight text-slate-900 group-hover:text-sky-500 transition-colors">
                DR.ALEX
              </span>
            </a>

            {/* Desktop Nav */}
            <div className={`hidden md:flex items-center gap-12 absolute left-1/2 -translate-x-1/2 transition-all duration-500 ${scrolled ? 'opacity-100' : 'opacity-0 translate-y-[-10px] pointer-events-none'}`}>
              {navLinks.map((item) => (
                <a 
                  key={item.name} 
                  href={`#${item.href}`}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className="text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-500 hover:text-sky-500 transition-colors outline-none cursor-pointer"
                >
                  {item.name}
                </a>
              ))}
            </div>

            {/* Menu Trigger & CTA */}
            <div className="flex items-center gap-8 relative z-[100]">
               <a 
                 href="#contacto"
                 onClick={(e) => scrollToSection(e, 'contacto')}
                 className="hidden md:flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.15em] text-slate-900 hover:text-sky-500 transition-colors group cursor-pointer"
               >
                 Cita <span className="bg-slate-900 text-white w-5 h-5 flex items-center justify-center rounded-full text-[10px] group-hover:bg-sky-500 transition-colors">→</span>
               </a>
               
               <button onClick={() => setMenuOpen(true)} className="group flex flex-col items-end gap-[6px] p-2 cursor-pointer outline-none border-none bg-transparent">
                  <span className="w-8 h-[2px] bg-slate-900 group-hover:bg-sky-500 transition-colors duration-300"></span>
                  <span className="w-5 h-[2px] bg-slate-900 group-hover:w-8 group-hover:bg-sky-500 transition-all duration-300 ease-out"></span>
               </button>
            </div>
        </div>
      </nav>

      {/* Menu Overlay - Z-Index 101 to cover Navbar */}
      <div className={`fixed inset-0 bg-white z-[101] transition-opacity duration-300 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
         
         {/* Close Button */}
         <button onClick={() => setMenuOpen(false)} className="absolute top-6 right-6 z-50 p-2 cursor-pointer border-none bg-transparent hover:bg-slate-50 rounded-full transition-colors">
            <X size={24} className="text-slate-900"/>
         </button>

         <div className="flex flex-col h-full container mx-auto px-6 py-10 items-center justify-center">
            <div className="flex flex-col gap-8 text-center">
               {[...navLinks, { name: 'Contacto', href: 'contacto' }].map((item, i) => (
                  <a 
                    key={item.name} 
                    href={`#${item.href}`}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className="group relative cursor-pointer inline-block p-2"
                  >
                     <span className="block font-heading text-4xl md:text-5xl font-light text-slate-900 group-hover:text-slate-400 transition-colors duration-300">
                        {item.name}
                     </span>
                     <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-xs font-bold text-sky-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        0{i+1}
                     </span>
                  </a>
               ))}
            </div>
            <div className="absolute bottom-12 text-center select-none">
               <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400">Dr. Alex — Costa Rica</p>
            </div>
         </div>
      </div>
    </>
  );
};

// --- Hero ---
export const Hero: React.FC<SectionProps> = ({ id }) => {
  
  const scrollToContact = (e: React.MouseEvent) => {
    e.preventDefault();
    const element = document.getElementById('contacto');
    if (element) {
      const navbarHeight = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - navbarHeight;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <section id={id} className="relative pt-32 pb-20 min-h-screen flex flex-col justify-center overflow-hidden">
      
      {/* PERFORMANCE FIX: Hide heavy blurs on mobile/tablet */}
      <div className="hidden md:block absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-sky-50/50 rounded-full blur-[100px] -z-10 translate-z-0"></div>

      <div className="w-full px-6 lg:pl-24 lg:pr-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-end gap-12 lg:gap-24">
          <div className="lg:w-[55%]">
             <Reveal>
               <h1 className="font-heading text-[12vw] md:text-[8vw] font-bold text-slate-900 leading-[0.9] tracking-tighter mb-10 select-none">
                 VIVE <br/>
                 <span className="text-slate-400">SIN DOLOR</span>
               </h1>
             </Reveal>
             
             <div className="flex flex-col md:flex-row gap-8 md:items-end border-l-2 border-sky-500 pl-8">
                <Reveal delay={200} className="md:w-3/4">
                   <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
                      Tu espalda carga mucho. <br/>
                      <span className="text-sky-500">Es hora de liberarla.</span>
                   </p>
                </Reveal>
                
                <Reveal delay={300} className="md:w-1/4 pb-1">
                   <a 
                    href="#contacto" 
                    onClick={scrollToContact}
                    className="inline-flex items-center gap-4 text-sm font-bold uppercase tracking-widest text-slate-900 hover:text-sky-500 transition-all group cursor-pointer"
                   >
                      Agendar <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                   </a>
                </Reveal>
             </div>
          </div>

          <div className="lg:w-[45%] relative mt-12 lg:mt-0 w-full">
             <Reveal delay={400}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-sm select-none shadow-xl">
                   <img 
                      src="https://i.imgur.com/a5o60lJ.jpeg" 
                      alt="Dr. Alex" 
                      className="w-full h-full object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-[1.5s] ease-out scale-105 hover:scale-100"
                   />
                </div>
                <div className="absolute bottom-0 right-0 bg-white/95 pl-6 pt-4 pr-0 pb-0 select-none backdrop-blur-sm">
                   <p className="text-xs font-bold uppercase tracking-widest text-slate-900 mb-1">Dr. Alex</p>
                   <p className="text-[10px] text-slate-500 uppercase tracking-widest">Quiropráctico y Osteópata</p>
                </div>
             </Reveal>
          </div>

        </div>

        <div className="absolute bottom-12 left-6 lg:left-24 hidden md:block select-none pointer-events-none">
           <MoveDown className="text-slate-300 animate-bounce" size={24} strokeWidth={1.5} />
        </div>
      </div>
    </section>
  );
};

// --- Philosophy ---
export const About: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-24 md:py-32 lg:py-48 bg-white relative">
       <div className="container mx-auto px-6 lg:px-16">
          <div className="mb-16 lg:mb-40 border-t border-slate-100 pt-8 flex justify-between items-start">
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400 select-none">01 — Nosotros</span>
             <h2 className="hidden md:block font-heading text-xl font-bold text-slate-900 max-w-xs text-right select-none">
                Salud real, sin atajos.
             </h2>
          </div>

          <div className="grid lg:grid-cols-12 gap-12 lg:gap-24 items-center">
             <div className="lg:col-span-5 lg:-mt-32">
                <Reveal>
                   <h3 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-8">
                      No solo <br/> alivio. <br/>
                      <span className="text-sky-500">Corrección.</span>
                   </h3>
                   <p className="text-lg text-slate-500 leading-relaxed mb-8">
                      No tapamos el síntoma con pastillas. Buscamos qué está causando el dolor y lo arreglamos con nuestras manos.
                   </p>
                   <p className="text-lg text-slate-500 leading-relaxed">
                      Tu cuerpo sabe sanar, nosotros solo le quitamos el freno.
                   </p>
                </Reveal>
             </div>

             <div className="lg:col-span-7 relative">
                <Reveal delay={200}>
                   <div className="bg-slate-50 p-8 md:p-12 lg:p-20 relative overflow-hidden rounded-sm">
                      <span className="absolute -top-10 -right-10 text-[15rem] md:text-[20rem] font-bold text-slate-100 font-heading select-none pointer-events-none">
                         100%
                      </span>
                      
                      <div className="relative z-10 grid md:grid-cols-2 gap-12">
                         <div>
                            <Activity className="text-sky-500 mb-6" size={32} />
                            <h4 className="font-heading text-2xl font-bold text-slate-900 mb-4">Trato Personal</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                               Atención dedicada. Te escuchamos sin prisas.
                            </p>
                         </div>
                         <div>
                            <div className="w-8 h-8 rounded-full border border-sky-500 flex items-center justify-center mb-6">
                               <div className="w-3 h-3 bg-sky-500 rounded-full"></div>
                            </div>
                            <h4 className="font-heading text-2xl font-bold text-slate-900 mb-4">Manual</h4>
                            <p className="text-slate-500 text-sm leading-relaxed">
                               Terapia manual específica. Corregimos la estructura para recuperar tu movilidad.
                            </p>
                         </div>
                      </div>
                   </div>
                </Reveal>
             </div>
          </div>
       </div>
    </section>
  );
};

// --- Services ---
export const Services: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="bg-slate-50 relative py-24 md:py-32 lg:py-48 overflow-hidden">
      
      {/* PERFORMANCE FIX: Hide heavy blurs on mobile */}
      <div className="hidden md:block absolute top-0 right-0 w-[600px] h-[600px] bg-sky-100/40 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none translate-z-0"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-[400px] h-[400px] bg-slate-200/50 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/4 pointer-events-none translate-z-0"></div>

      <div className="container mx-auto px-6 lg:px-16 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24">
           <Reveal>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block select-none">02 — El Proceso</span>
              <h2 className="font-heading text-4xl md:text-5xl font-semibold text-slate-900">
                 Simple y Efectivo.
              </h2>
           </Reveal>
           <Reveal delay={100} className="mt-8 md:mt-0 max-w-sm border-l border-slate-300 pl-6">
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                 Sin complicaciones. Un plan claro para que te sientas bien de nuevo.
              </p>
           </Reveal>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
           {[
              {
                 title: "Revisión",
                 phase: "01",
                 desc: "Hablamos y examinamos dónde duele y por qué. Encontramos el origen.",
              },
              {
                 title: "Ajuste",
                 phase: "02",
                 desc: "Corregimos la postura y liberamos la tensión con manos expertas.",
              },
              {
                 title: "Alivio",
                 phase: "03",
                 desc: "Recuperas el movimiento. Te damos pautas para mantenerte sano.",
              }
           ].map((card, i) => (
              <Reveal key={i} delay={i * 100}>
                 <div className="group relative min-h-[320px] bg-white p-10 flex flex-col justify-between shadow-sm hover:shadow-2xl hover:shadow-sky-900/5 transition-all duration-500 rounded-sm">
                    <div>
                       <span className="font-heading text-7xl font-extralight text-slate-100 group-hover:text-slate-900 transition-colors duration-500 select-none">
                          {card.phase}
                       </span>
                    </div>
                    <div className="relative z-10">
                       <h3 className="text-2xl font-heading font-medium text-slate-900 mb-4 tracking-tight">{card.title}</h3>
                       <p className="text-slate-500 text-sm leading-relaxed font-light group-hover:text-slate-600">
                          {card.desc}
                       </p>
                    </div>
                    <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-sky-400 transition-all duration-700 opacity-50 group-hover:opacity-100"></div>
                 </div>
              </Reveal>
           ))}
        </div>
      </div>
    </section>
  );
};

// --- Testimonials ---
export const Testimonials: React.FC<SectionProps> = ({ id }) => {
  return (
    <section id={id} className="py-24 md:py-32 lg:py-48 bg-white overflow-hidden">
       <div className="container mx-auto px-6 lg:px-16">
          <div className="border-t border-slate-100 pt-8 mb-24">
             <span className="text-xs font-bold uppercase tracking-widest text-slate-400 select-none">03 — Historias</span>
          </div>

          <Reveal>
             <div className="max-w-4xl mx-auto text-center relative">
                <div className="absolute top-0 left-0 md:left-10 text-[8rem] md:text-[10rem] text-slate-100 font-serif leading-none -z-10 select-none">“</div>
                
                <h2 className="font-heading text-2xl md:text-5xl lg:text-6xl font-medium text-slate-900 leading-tight mb-16 px-4">
                   "Llegué con mucho dolor de espalda y sin poder moverme bien. Me explicaron la causa y me ayudaron a corregirlo. <span className="text-sky-500">Excelente atención.</span>"
                </h2>

                <div className="flex flex-col items-center gap-4">
                   <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden select-none flex items-center justify-center">
                      <span className="text-slate-900 font-heading font-bold text-xl">C</span>
                   </div>
                   <div className="text-center">
                      <p className="font-heading font-bold text-lg text-slate-900">Carlos M.</p>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Paciente</p>
                   </div>
                   <div className="flex gap-1 mt-2">
                      {[1,2,3,4,5].map(i => <Star key={i} size={14} className="text-sky-500 fill-sky-500" />)}
                   </div>
                </div>
             </div>
          </Reveal>

          <div className="grid grid-cols-3 gap-4 md:gap-8 mt-24 md:mt-32 border-y border-slate-100 py-12">
             {[
                { label: "Pacientes", val: "+500" },
                { label: "Satisfacción", val: "99%" },
                { label: "Estrellas", val: "5.0" }
             ].map((stat, i) => (
                <div key={i} className="text-center border-r last:border-r-0 border-slate-100 px-2">
                   <p className="font-heading text-2xl md:text-4xl font-bold text-slate-900 mb-2">{stat.val}</p>
                   <p className="text-[10px] md:text-xs text-slate-400 uppercase tracking-widest">{stat.label}</p>
                </div>
             ))}
          </div>
       </div>
    </section>
  );
};

// --- Contact ---
export const Contact: React.FC<SectionProps> = ({ id }) => {
  const [formData, setFormData] = useState({
    name: '',
    message: ''
  });

  const handleWhatsAppSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const phoneNumber = "50661919280"; // Consultations still go here
    
    // FORMATO ORDENADO
    const text = `Hola Dr. Alex, me gustaría agendar una cita.

Nombre: ${formData.name}

Motivo: ${formData.message}`;

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <section id={id} className="py-24 md:py-32 bg-slate-900 text-white relative">
       {/* Removed fancy radial gradients for mobile performance, keep simple solid/subtle */}
       <div className="hidden md:block absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,rgba(14,165,233,0.08),transparent_50%)] pointer-events-none translate-z-0"></div>

       <div className="container mx-auto px-6 lg:px-16 relative z-10">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
             
             <div className="lg:col-span-5 flex flex-col justify-center">
                <Reveal>
                   <span className="text-sky-500 text-xs font-bold uppercase tracking-[0.3em] mb-8 block select-none">Citas</span>
                   <h2 className="font-heading text-5xl lg:text-7xl font-light mb-8 text-white tracking-tight">
                      Tu Salud, <br/>
                      <i className="font-serif text-slate-400">Primero.</i>
                   </h2>
                   
                   <p className="text-slate-400 leading-relaxed mb-12 font-light text-lg max-w-md">
                      Estamos listos para recibirte. Agenda tu cita y comienza tu recuperación.
                   </p>

                   <div className="grid gap-8">
                      <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sky-500 shrink-0 border border-slate-700">
                             <MapPin size={18} />
                          </div>
                          <div>
                             <p className="text-white text-lg font-heading">Ubicación</p>
                             <p className="text-slate-400 text-sm mt-1">100m Oeste de la Municipalidad de Alajuela</p>
                          </div>
                      </div>
                      <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center text-sky-500 shrink-0 border border-slate-700">
                             <Phone size={18} />
                          </div>
                          <div>
                             <p className="text-white text-lg font-heading">Contacto</p>
                             <div className="space-y-1 mt-1">
                                <p className="text-slate-400 text-sm">+506 6191 9280</p>
                                <p className="text-slate-400 text-sm">+506 8885 2893</p>
                             </div>
                          </div>
                      </div>
                   </div>
                </Reveal>
             </div>

             <div className="lg:col-span-7">
                <Reveal delay={200}>
                   <div className="bg-white rounded-sm shadow-xl relative overflow-hidden">
                      
                      <div className="p-8 md:p-16">
                          <div className="flex justify-between items-start mb-12">
                             <div>
                                <h3 className="font-heading text-3xl font-light tracking-tight text-slate-900">Agenda tu Cita</h3>
                                <p className="text-slate-400 text-xs uppercase tracking-widest mt-2">Te contactaremos pronto</p>
                             </div>
                          </div>

                          <form onSubmit={handleWhatsAppSubmit} className="space-y-10">
                             <div className="group relative">
                                <input 
                                  type="text" 
                                  value={formData.name}
                                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                                  className="w-full bg-transparent border-b border-slate-200 py-4 text-xl text-slate-900 font-light focus:outline-none focus:border-slate-900 transition-all placeholder-slate-300 peer" 
                                  placeholder="Ej: Juan Pérez" 
                                  id="name" 
                                  required
                                />
                                <label htmlFor="name" className="absolute left-0 -top-6 text-xs text-slate-900 font-bold tracking-widest cursor-text transition-all select-none">Nombre</label>
                             </div>
                             
                             <div className="group relative">
                                <textarea 
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    className="w-full bg-transparent border-b border-slate-200 py-4 text-xl text-slate-900 font-light focus:outline-none focus:border-slate-900 transition-all placeholder-slate-300 peer resize-none" 
                                    placeholder="Ej: Dolor de espalda baja, cuello..." 
                                    id="description" 
                                    rows={2}
                                    required
                                />
                                <label htmlFor="description" className="absolute left-0 -top-6 text-xs text-slate-900 font-bold tracking-widest cursor-text transition-all select-none">Motivo de la consulta</label>
                             </div>

                             <div className="pt-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                 <div className="flex items-center gap-2 text-[10px] text-slate-400 uppercase tracking-widest select-none">
                                    <Shield size={10} />
                                    <span>Datos Privados</span>
                                 </div>
                                 <button type="submit" className="bg-slate-900 text-white py-4 px-10 text-xs font-bold uppercase tracking-[0.2em] hover:bg-sky-500 transition-all duration-500 flex items-center justify-center gap-4 group select-none cursor-pointer">
                                    <span>Enviar</span>
                                    <ArrowRight className="group-hover:translate-x-1 transition-transform" size={16} />
                                 </button>
                             </div>
                          </form>
                      </div>
                      
                      <div className="h-2 w-full bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-2">
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                          <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                      </div>
                   </div>
                </Reveal>
             </div>
          </div>

          <div className="mt-24 md:mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-end gap-8 opacity-40 hover:opacity-100 transition-opacity">
             <div className="select-none text-center md:text-left w-full md:w-auto">
                <span className="font-heading font-bold text-2xl tracking-tighter text-white">DR.ALEX.</span>
                <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest">© 2026 Todos los derechos reservados.</p>
             </div>
          </div>
       </div>
    </section>
  );
};