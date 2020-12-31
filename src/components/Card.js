import React from 'react';

import './Card.css';

const Card = ({ img, label, email, noBotMargin, className, style, noLink, notAllowed, handleClick = () => null }) => {

  return (
    <div
      className={`card-container ${className}`}
      style={{ ...style, cursor: ((noLink && 'auto') || (notAllowed && 'not-allowed')), marginBottom: noBotMargin && '0 ' }}
      onClick={() => handleClick(label, email)}
    >
      <div className="card-bg">
        <img src={img} alt="card" />
      </div>
      <p className="card-link" style={{ textDecoration: noLink && 'none' }}>
        {label}
      </p>
    </div>
  );
};

export default Card;
