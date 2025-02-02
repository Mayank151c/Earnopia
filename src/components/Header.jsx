import React from 'react';
import favicon from '../favicon.ico';
import '../styles/Header.css';
import { CurrencyBitcoinOutlined } from '@mui/icons-material';

function Header(props) {
  return (
    <div id="header">
      <img src={favicon} alt="logo" />
      <div className="title">Earnopia</div>
      <div className="balance">
        <CurrencyBitcoinOutlined />
        {String(props.amount).padStart(10, '0')}
      </div>
    </div>
  );
}

export default Header;
