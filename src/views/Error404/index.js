import React from 'react';
import './Error404.css';

const Error404 = () => {
  return (
    <div className='error__container'>
      <div>
        <h1 className='error__h1'>404</h1>
        <h4 className='error__h4'>Error</h4>
        <p className='error__p'>Looks Like Youv'e Got Lost</p>
      </div>
    </div>
  );
};

export default Error404;
