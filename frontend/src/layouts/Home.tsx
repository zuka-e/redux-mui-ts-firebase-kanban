import React from 'react';

import ProductHero from './ProductHero';
import ProductValues from './ProductValues';

const Home: React.FC = () => {
  return (
    <React.Fragment>
      <ProductHero />
      <ProductValues />
    </React.Fragment>
  );
};

export default Home;
