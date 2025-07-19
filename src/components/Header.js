'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Mostrar botão "Novo Veículo" em todas as páginas exceto na página de cadastro
  const shouldShowNewVehicleButton = pathname !== '/';

  const navigation = [
    // { name: 'Cadastro', href: '/' },
    { name: 'Monitor', href: '/monitor' },
    { name: 'Acompanhamento', href: '/acompanhamento' },
  ];

  return (
    <>
      {/* Header Principal */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            {/* Logo e Título */}
            <div className="flex items-center space-x-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <h1 className="text-2xl font-bold">Auto Paint Pro</h1>
                <p className="text-blue-100 text-sm">Sistema de Gerenciamento de Oficina</p>
              </div>
            </div>

            {/* Navegação Desktop */}
            <div className="hidden md:flex items-center space-x-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg font-medium transition duration-200 ${
                    pathname === item.href
                      ? 'bg-blue-800 text-white'
                      : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Botão Novo Veículo - aparece em todas as páginas exceto na de cadastro */}
              {/* {shouldShowNewVehicleButton && (
                <Link 
                  href="/"
                  className="bg-white text-blue-700 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition duration-200 ml-4 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Novo Veículo
                </Link>
              )} */}
            </div>

            {/* Botão Menu Mobile */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-white hover:text-blue-200 transition duration-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Menu Mobile */}
      {isMobileMenuOpen && (
        <div className="bg-blue-800 text-white py-4 px-6 md:hidden">
          <div className="space-y-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-lg font-medium transition duration-200 ${
                  pathname === item.href
                    ? 'bg-blue-900 text-white'
                    : 'text-blue-100 hover:bg-blue-700 hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Botão Novo Veículo Mobile - aparece em todas as páginas exceto na de cadastro */}
            {shouldShowNewVehicleButton && (
              <Link 
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full text-left py-2 px-3 mt-3 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition duration-200 flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Novo Veículo
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}