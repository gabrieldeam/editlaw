// src/components/header/Header.tsx
"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { getUserInfo, logout } from '../../services/authService'; // Importa o serviço de autenticação e logout
import styles from './Header.module.css';
import { useRouter } from 'next/navigation'; // Use 'next/navigation'

const Header: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdownDesktopOpen, setDropdownDesktopOpen] = useState(false);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);
  const dropdownDesktopRef = useRef<HTMLDivElement>(null);
  const dropdownMobileRef = useRef<HTMLDivElement>(null);
  const router = useRouter(); // Importação correta do useRouter

  // Função para verificar o usuário autenticado
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

    fetchUserInfo();
  }, []);

  const handleSearchClick = () => {
    setShowMobileSearch(!showMobileSearch);
  };

  // Função para alternar o dropdown desktop
  const toggleDropdownDesktop = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique feche o menu
    setDropdownDesktopOpen(!dropdownDesktopOpen);
  };

  // Função para alternar o dropdown mobile
  const toggleDropdownMobile = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique feche o menu
    setDropdownMobileOpen(!dropdownMobileOpen);
  };

  // Fechar o dropdown ao clicar fora dele
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

  // Função para fazer logout
  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation(); // Evita o fechamento do dropdown
    try {
      console.log('Chamando serviço de logout...');
      await logout(); // Chama o serviço de logout
      console.log('Logout realizado com sucesso.');
      setUser(null); // Remove o usuário
      setDropdownDesktopOpen(false); // Fecha o dropdown desktop
      setDropdownMobileOpen(false); // Fecha o dropdown mobile
      router.push('/auth/login'); // Redireciona para a página de login
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Impedir que os links do dropdown fechem o menu automaticamente no mobile e desktop
  const handleLinkClick = (event: React.MouseEvent) => {
    event.stopPropagation(); // Impede que o clique feche o menu
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
