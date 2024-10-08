// src/components/Header/Header.tsx

"use client";

import Link from 'next/link';
import React, { useEffect, useRef, useState } from 'react';
import { getUserInfo, logout, isAdmin } from '../../services/authService';
import { getAllCategories } from '../../services/categoryService';
import styles from './Header.module.css';
import { useRouter } from 'next/navigation';
import CustomSelect from '../customSelect/CustomSelect';
import { useCart } from '../../context/CartContext';

const Header: React.FC = () => {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [isAdminUser, setIsAdminUser] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [dropdownDesktopOpen, setDropdownDesktopOpen] = useState(false);
  const [dropdownMobileOpen, setDropdownMobileOpen] = useState(false);
  const [categories, setCategories] = useState<{ id: string, name: string }[]>([]); // Estado para armazenar categorias
  const [selectedCategory, setSelectedCategory] = useState<string>(''); // Categoria selecionada
  const [searchQuery, setSearchQuery] = useState<string>('');
  const { cartCount } = useCart(); // Obtém o contador do carrinho do contexto
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

    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response);
      } catch (error) {
        console.error('Erro ao buscar categorias:', error);
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

    // Execute as funções
    fetchUserInfo();
    fetchCategories();
    checkAdmin();
  }, []);

  // Função de busca
  const handleSearch = () => {
    if (searchQuery || selectedCategory) {
      router.push(`/search?query=${searchQuery}&category=${selectedCategory}`);
    }
  };

  // Adiciona o evento de tecla (Enter)
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

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

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.left}>
          <Link href="/">
            <img src="/image/editlaw.svg" alt="EditLaw Logo" className={styles.logo} />
          </Link>

          <div className={styles.searchContainer}>
            <CustomSelect
              options={categories}
              onSelect={handleCategorySelect}
              placeholder="Todas as categorias"
            />

            <img
              src="/icon/search.svg"
              alt="Search Icon"
              className={styles.searchIcon}
              onClick={handleSearch}  // Executa a busca ao clicar no ícone
            />
            <input
              type="text"
              placeholder="Pesquisar..."
              className={styles.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}              
            />
            <button onClick={handleSearch} className={styles.searchButton}>Pesquisar</button>
          </div>
        </div>
        <div className={styles.right}>
          <Link href="/license" className={styles.licenca}>Licença</Link>
          <Link href="/suporte" className={styles.licenca}>Suporte</Link>

          <div onClick={handleSearchClick} className={styles.searchMobileContainer}>
            <img src="/icon/search.svg" alt="Search Icon" className={styles.searchMobileIcon} />
          </div>

          <Link href="/cart" className={styles.cartContainer}>
            <img src="/icon/cart.svg" alt="Cart" className={styles.cartIcon} />
          </Link>
          {cartCount > 0 && (
            <Link href="/cart" className={styles.cartContainerCount}>
              <span className={styles.cartCount}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{cartCount}</span>
            </Link>
          )}

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
        <div className={user ? styles.mobileButtons2 : styles.mobileButtons}>
          {!user && (
            <>
              <Link href="/auth/login" className={styles.mobileButtonLogin}>Entrar</Link>
              <Link href="/auth/register" className={styles.mobileButton}>Criar uma conta</Link>
            </>
          )}
        </div>
      ) : (
        <div className={styles.mobileSearchBar}>
          <CustomSelect
            options={categories}
            onSelect={handleCategorySelect}
            placeholder="Tudo"
          />

          <img
            src="/icon/search.svg"
            alt="Search Icon"
            className={styles.searchIcon}
            onClick={handleSearch} 
          />
          <input
            type="text"
            placeholder="Pesquisar..."
            className={styles.mobileSearchInput}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}              
          />
          <button onClick={handleSearch} className={styles.searchButton}>Pesquisar</button>          
        </div>
      )}
    </>
  );
};

export default Header;