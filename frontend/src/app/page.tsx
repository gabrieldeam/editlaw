"use client";

import React, { useEffect } from 'react';
import Section from '../components/section/Section'; 
import CategorySection from '../components/categorySection/CategorySection';
import CategoryCarousel from '../components/categoryCarousel/CategoryCarousel';
import PackageList from '../components/packageList/PackageList';

const HomePage: React.FC = () => {
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '//code.jivosite.com/widget/Wt3NVjqhJG';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script); // Limpa o script ao desmontar o componente
    };
  }, []);

  return (
    <div>
      <Section />
      <CategorySection />
      <CategoryCarousel categoryId="8fc53164-2aa9-4816-9981-574725e844af" />
      <CategoryCarousel categoryId="8fc53164-2aa9-4816-9981-574725e844af" />
      <PackageList />
    </div>
  );
};

export default HomePage;
