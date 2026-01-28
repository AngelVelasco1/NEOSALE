import { RiFacebookCircleFill, RiInstagramFill, RiYoutubeFill, RiTwitterXFill, RiWhatsappFill } from "react-icons/ri";
import { Mail, MapPin, Phone, ArrowRight, Heart } from "lucide-react";
import Image from "next/image";
import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Sobre Nosotros', href: '/about' },
      { name: 'Nuestra Historia', href: '/story' },
      { name: 'Trabaja con Nosotros', href: '/careers' },
    ],
    shop: [
      { name: 'Productos', href: '/products' },
      { name: 'Nuevos Lanzamientos', href: '/new' },
      { name: 'Ofertas', href: '/deals' },
      { name: 'Marcas', href: '/brands' },
    ],
    support: [
      { name: 'Centro de Ayuda', href: '/help' },
      { name: 'Seguimiento de Orden', href: '/orders' },
      { name: 'Envíos', href: '/shipping' },
    ],
    legal: [
      { name: 'Términos y Condiciones', href: '/terms' },
      { name: 'Política de Privacidad', href: '/privacy' },
      { name: 'Política de Cookies', href: '/cookies' },
      { name: 'Tratamiento de Datos', href: '/data-treatment' },
    ],
  };

  const socialLinks = [
    { icon: RiFacebookCircleFill, href: '#', label: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: RiWhatsappFill, href: '#', label: 'WhatsApp', color: 'hover:bg-green-600' },
    { icon: RiInstagramFill, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: RiYoutubeFill, href: '#', label: 'YouTube', color: 'hover:bg-red-600' },
    { icon: RiTwitterXFill, href: '#', label: 'Twitter/X', color: 'hover:bg-slate-900' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Elegant Background Pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl"></div>
        </div>
        {/* Decorative Grid */}
        <div 
          className="absolute inset-0" 
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="max-w-4xl mx-auto text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Suscríbete a Nuestro Newsletter
              </h3>
              <p className="text-gray-400 mb-6 text-sm md:text-base">
                Recibe las últimas novedades, ofertas exclusivas y tendencias de moda directamente en tu email
              </p>
              <form className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                <input
                  type="email"
                  placeholder="tucorreo@ejemplo.com"
                  className="flex-1 px-5 py-3.5 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
                <button
                  type="submit"
                  className="px-8 py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl hover:scale-105 whitespace-nowrap"
                >
                  Suscribirse
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="flex items-center justify-center lg:justify-start">
                <Link href="/" className="group">
                  <div className="relative">
                    <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl blur-xl opacity-40 group-hover:opacity-60 transition-opacity"></div>
                    <div className="relative bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/10 group-hover:border-white/20 transition-all">
                      <Image
                        src={"/imgs/NomLogo2.png"}
                        alt="NeoSale Logo"
                        width={140}
                        height={140}
                        className="relative"
                      />
                    </div>
                  </div>
                </Link>
              </div>
              <p className="text-gray-300 text-center lg:text-left leading-relaxed text-sm max-w-sm mx-auto lg:mx-0">
                Tu destino premium de moda y estilo en línea. Ofrecemos las últimas tendencias con calidad excepcional, servicio personalizado y la mejor experiencia de compra.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4 text-center lg:text-left">
                  Contáctanos
                </h4>
                <a 
                  href="mailto:info@neosale.com" 
                  className="flex items-center justify-center lg:justify-start gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-600/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-blue-600/30 border border-blue-500/30 transition-all">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-medium">info@neosale.com</span>
                </a>
                <a 
                  href="tel:+573001234567" 
                  className="flex items-center justify-center lg:justify-start gap-3 text-gray-300 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-indigo-600/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-indigo-600/30 border border-indigo-500/30 transition-all">
                    <Phone className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-medium">+57 300 123 4567</span>
                </a>
                <div className="flex items-center justify-center lg:justify-start gap-3 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-600/20 backdrop-blur-sm flex items-center justify-center border border-purple-500/30">
                    <MapPin className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-sm font-medium">Bogotá, Colombia</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
              {/* Company Links */}
              <div>
                <h3 className="text-base font-bold mb-5 text-white border-b border-white/10 pb-3">
                  Compañía
                </h3>
                <ul className="space-y-3">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-2 group transition-all"
                      >
                        <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-blue-400" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shop Links */}
              <div>
                <h3 className="text-base font-bold mb-5 text-white border-b border-white/10 pb-3">
                  Tienda
                </h3>
                <ul className="space-y-3">
                  {footerLinks.shop.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-2 group transition-all"
                      >
                        <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-indigo-400" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-base font-bold mb-5 text-white border-b border-white/10 pb-3">
                  Soporte
                </h3>
                <ul className="space-y-3">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-2 group transition-all"
                      >
                        <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-purple-400" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-base font-bold mb-5 text-white border-b border-white/10 pb-3">
                  Legal
                </h3>
                <ul className="space-y-3">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white text-sm flex items-center gap-2 group transition-all"
                      >
                        <ArrowRight className="w-0 h-4 opacity-0 group-hover:w-4 group-hover:opacity-100 transition-all duration-300 text-cyan-400" />
                        <span className="group-hover:translate-x-1 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="mt-12 pt-8 border-t border-white/10">
            <div className="text-center">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-5">
                Síguenos en Redes Sociales
              </h4>
              <div className="flex items-center justify-center gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className={`w-11 h-11 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center hover:bg-white/20 ${social.color} transition-all duration-300 hover:scale-110 hover:-translate-y-1 hover:shadow-lg group`}
                  >
                    <social.icon className="text-white text-xl" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-gray-400 text-center md:text-left flex items-center gap-2">
                © {currentYear} <span className="font-semibold text-white">NeoSale</span>. Todos los derechos reservados.
                <span className="hidden sm:inline-flex items-center gap-1">
                  <span className="text-gray-500">•</span>
                  Hecho con <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500 inline" /> en Colombia
                </span>
              </p>
              <div className="flex items-center gap-5 text-sm">
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Términos
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacidad
                </Link>
                <span className="text-gray-600">•</span>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
