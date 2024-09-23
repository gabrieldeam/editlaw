"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { getUserInfo, logout, isAdmin } from '../../services/authService';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdownDesktopOpen, setDropdownDesktopOpen] = useState(false);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);
  const dropdownDesktopRef = useRef<HTMLDivElement>(null);
  const dropdownMobileRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await getUserInfo();
        const firstName = response.name.split(' ')[0];
        setUser({ name: firstName });
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        setUser(null);
      }
    };

    const checkAdmin = async () => {
      try {
        const adminResponse = await isAdmin();
        setIsAdminUser(adminResponse.isAdmin);
      } catch (error) {
        console.error('Erro ao verificar administrador:', error);
        setIsAdminUser(false);
      }
    };

    // Execute both functions
    fetchUserInfo();
    checkAdmin();
  }, []);

  const handleSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  const toggleDropdownDesktop = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownDesktopOpen(!dropdownDesktopOpen);
  };

  const toggleDropdownMobile = (event: React.MouseEvent) => {
    event.stopPropagation();
    setDropdownMobileOpen(!dropdownMobileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownDesktopRef.current && !dropdownDesktopRef.current.contains(event.target as Node)) {
        setDropdownDesktopOpen(false);
      }
      if (dropdownMobileRef.current && !dropdownMobileRef.current.contains(event.target as Node)) {
        setDropdownMobileOpen(false);
      }
    };

    if (dropdownDesktopOpen || dropdownMobileOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [dropdownDesktopOpen, dropdownMobileOpen]);

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    try {
      await logout();
      setUser(null);
      setDropdownDesktopOpen(false);
      setDropdownMobileOpen(false);
      router.push('/auth/login');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/">
            <img src="/image/editlaw.svg" alt="EditLaw Logo" className={styles.logo} />
          </Link>
          <div className={styles.searchContainer}>
            <img src="/icon/search.svg" alt="Search Icon" className={styles.searchIcon} />
            <input type="text" placeholder="Pesquisar..." className={styles.search} />
          </div>
        </div>
        <div className={styles.right}>
          <Link href="/licenca" className={styles.licenca}>Licença</Link>
          <Link href="/suport" className={styles.licenca}>Suporte</Link>

          <div onClick={handleSearchClick} className={styles.searchMobileContainer}>
            <img src="/icon/search.svg" alt="Search Icon" className={styles.searchMobileIcon} />
          </div>

          <Link href="/cart" className={styles.cartContainer}>
            <img src="/icon/cart.svg" alt="Cart" className={styles.cartIcon} />
          </Link>

          {user ? (
            <>
              {/* Dropdown Desktop */}
              <div className={styles.userContainer} ref={dropdownDesktopRef} onClick={toggleDropdownDesktop}>
                <span className={styles.userName}>Olá, {user.name}</span>
                <img src="/icon/down-arrow.svg" alt="Dropdown Icon" className={styles.dropdownIcon} />
                {dropdownDesktopOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/account" className={styles.menuItem} onClick={handleLinkClick}>Minha conta</Link>
                    <Link href="/purchases" className={styles.menuItem} onClick={handleLinkClick}>Minhas compras</Link>
                    {isAdminUser && <Link href="/admin" className={styles.menuItem} onClick={handleLinkClick}>Admin</Link>}
                    <button type="button" className={styles.menuItemLogout} onClick={handleLogout}>Sair</button>
                  </div>
                )}
              </div>

              {/* Dropdown Mobile */}
              <div className={styles.mobileUserIcon} ref={dropdownMobileRef} onClick={toggleDropdownMobile}>
                <img src="/icon/people.svg" alt="User Icon" />
                {dropdownMobileOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link href="/account" className={styles.menuItem} onClick={handleLinkClick}>Minha conta</Link>
                    <Link href="/purchases" className={styles.menuItem} onClick={handleLinkClick}>Minhas compras</Link>
                    <button type="button" className={styles.menuItemLogout} onClick={handleLogout}>Sair</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className={styles.buttonLogin}>Entrar</Link>
              <Link href="/auth/register" className={styles.button}>Criar uma conta</Link>
            </>
          )}
        </div>
      </header>

      {!showMobileSearch ? (
        <div className={styles.mobileButtons}>
          {!user && (
            <>
              <Link href="/auth/login" className={styles.mobileButtonLogin}>Entrar</Link>
              <Link href="/auth/register" className={styles.mobileButton}>Criar uma conta</Link>
            </>
          )}
        </div>
      ) : (
        <div className={styles.mobileSearchBar}>
          <img src="/icon/search.svg" alt="Search Icon" className={styles.searchIcon} />
          <input type="text" placeholder="Pesquisar..." className={styles.mobileSearchInput} />
        </div>
      )}
    </>
  );
};

export default Header;
