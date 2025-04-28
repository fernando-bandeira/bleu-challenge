'use client';

import { useThemeStore } from '@/store/useThemeStore';
import { Moon, Menu, X } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { ConnectWalletButton } from './connect-wallet-button';
import MenuLinks from './menu-links';
import { Button } from './ui/button';

const Header = () => {
  const { toggleTheme } = useThemeStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header>
      <div className="flex relative h-16 items-center justify-between bg-content mx-5 mt-6 px-5 rounded-3xl">
        <Link href="/">
          <h1 className="text-primary font-bold text-lg font-roboto-mono text-center">Bleu</h1>
        </Link>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex gap-4 text-lg">
          <MenuLinks />
        </div>
        <div className="flex items-center gap-4">
          <ConnectWalletButton />
          <Button
            variant="ghost"
            className="flex items-center justify-center rounded-full bg-primary/10 p-1 w-8 h-8 "
            onClick={() => toggleTheme()}
          >
            <Moon size={18} className="text-primary" />
          </Button>
          <Button
            variant="ghost"
            className="flex items-center justify-center rounded-full p-1 w-8 h-8 md:hidden"
            onClick={handleMenuToggle}
          >
            {isMenuOpen ? <X size={18} className="text-primary" /> : <Menu size={18} className="text-primary" />}
          </Button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="flex flex-col items-center gap-4 bg-content mx-5 mt-2 py-4 rounded-2xl md:hidden">
          <MenuLinks />
        </div>
      )}
    </header>
  );
};

export default Header;
