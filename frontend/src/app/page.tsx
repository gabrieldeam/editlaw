import React from 'react';
import Section from '../components/section/Section'; 
import CategorySection from '../components/categorySection/CategorySection';

const HomePage: React.FC = () => {
  return (
    <div>
      <Section />
      <CategorySection />
    </div>
  );
};

export default HomePage;