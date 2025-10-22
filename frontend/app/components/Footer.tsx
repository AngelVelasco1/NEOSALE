import { RiFacebookCircleFill } from "react-icons/ri";
import { RiInstagramFill } from "react-icons/ri";
import { RiYoutubeFill } from "react-icons/ri";
import { RiTwitterXFill } from "react-icons/ri";
import { RiWhatsappFill } from "react-icons/ri";
import { Mail, MapPin, Phone, ArrowRight, Heart, ShoppingBag, Truck, Shield } from "lucide-react";

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
      { name: 'Blog', href: '/blog' },
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
      { name: 'Cambios y Devoluciones', href: '/returns' },
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
    { icon: RiFacebookCircleFill, href: '#', label: 'Facebook', color: 'hover:text-blue-500' },
    { icon: RiWhatsappFill, href: '#', label: 'WhatsApp', color: 'hover:text-green-500' },
    { icon: RiInstagramFill, href: '#', label: 'Instagram', color: 'hover:text-pink-500' },
    { icon: RiYoutubeFill, href: '#', label: 'YouTube', color: 'hover:text-red-500' },
    { icon: RiTwitterXFill, href: '#', label: 'Twitter/X', color: 'hover:text-slate-900' },
  ];



  return (
    <footer className="relative bg-gradient-to-br  text-white overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">


        {/* Main Footer Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
                  <Image
                    src={"/imgs/NomLogo2.png"}
                    alt="Logo"
                    width={120}
                    height={120}
                    className="relative"
                  />
                </div>
              </div>
              <p className="text-gray-200 text-center lg:text-left leading-relaxed text-sm">
                Tu destino de moda y estilo. Encuentra las últimas tendencias con la mejor calidad y servicio.
              </p>

              {/* Social Media */}
              <div>
                <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3 text-center lg:text-left">
                  Síguenos
                </h4>
                <div className="flex items-center justify-center lg:justify-start gap-2">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      aria-label={social.label}
                      className={`w-9 h-9 rounded-lg bg-white/15 backdrop-blur-sm flex items-center justify-center hover:bg-white/25 transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 ${social.color} group`}
                    >
                      <social.icon className="text-white group-hover:scale-110 transition-transform" size="1.2em" />
                    </a>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 text-center lg:text-left">
                <a href="mailto:info@tutienda.com" className="flex items-center justify-center lg:justify-start gap-2 text-gray-200 hover:text-white transition-colors group">
                  <div className="w-7 h-7 rounded-md bg-blue-500/25 flex items-center justify-center group-hover:bg-blue-500/35 transition-colors">
                    <Mail className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs">info@tutienda.com</span>
                </a>
                <a href="tel:+573001234567" className="flex items-center justify-center lg:justify-start gap-2 text-gray-200 hover:text-white transition-colors group">
                  <div className="w-7 h-7 rounded-md bg-indigo-500/25 flex items-center justify-center group-hover:bg-indigo-500/35 transition-colors">
                    <Phone className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs">+57 300 123 4567</span>
                </a>
                <div className="flex items-center justify-center lg:justify-start gap-2 text-gray-200">
                  <div className="w-7 h-7 rounded-md bg-purple-500/25 flex items-center justify-center">
                    <MapPin className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs">Bogotá, Colombia</span>
                </div>
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Company Links */}
              <div>
                <h3 className="text-base font-bold mb-4 bg-gradient-to-r from-blue-300 to-cyan-300 bg-clip-text text-transparent">
                  Compañía
                </h3>
                <ul className="space-y-2">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-200 hover:text-white text-xs flex items-center gap-1.5 group transition-all"
                      >
                        <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shop Links */}
              <div>
                <h3 className="text-base font-bold mb-4 bg-gradient-to-r from-indigo-300 to-purple-300 bg-clip-text text-transparent">
                  Tienda
                </h3>
                <ul className="space-y-2">
                  {footerLinks.shop.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-200 hover:text-white text-xs flex items-center gap-1.5 group transition-all"
                      >
                        <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Support Links */}
              <div>
                <h3 className="text-base font-bold mb-4 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                  Soporte
                </h3>
                <ul className="space-y-2">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-200 hover:text-white text-xs flex items-center gap-1.5 group transition-all"
                      >
                        <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h3 className="text-base font-bold mb-4 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Legal
                </h3>
                <ul className="space-y-2">
                  {footerLinks.legal.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-gray-200 hover:text-white text-xs flex items-center gap-1.5 group transition-all"
                      >
                        <ArrowRight className="w-0 h-3 opacity-0 group-hover:w-3 group-hover:opacity-100 transition-all duration-300" />
                        <span className="group-hover:translate-x-0.5 transition-transform duration-300">
                          {link.name}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-white/15">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="max-w-xl mx-auto text-center">
              <h3 className="text-lg font-bold mb-2 bg-gradient-to-r from-blue-300 via-indigo-300 to-purple-300 bg-clip-text text-transparent">
                Suscríbete a nuestro Newsletter
              </h3>
              <p className="text-gray-200 mb-4 text-sm">
                Recibe las últimas novedades, ofertas exclusivas y tendencias directamente en tu correo
              </p>
              <form className="flex flex-col sm:flex-row gap-2 max-w-sm mx-auto">
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="flex-1 px-3 py-2.5 rounded-lg bg-white/15 backdrop-blur-sm border border-white/25 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all text-sm"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 font-semibold text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5"
                >
                  <span className="text-sm">Suscribirse</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 bg-black/30 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-300">
              <p className="text-center md:text-left">
                © {currentYear} <span className="font-semibold text-white">Tu Tienda</span>. Todos los derechos reservados.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="hover:text-white transition-colors text-gray-300 hover:text-white">
                  Términos
                </Link>
                <Link href="/privacy" className="hover:text-white transition-colors text-gray-300 hover:text-white">
                  Privacidad
                </Link>
                <Link href="/cookies" className="hover:text-white transition-colors text-gray-300 hover:text-white">
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
