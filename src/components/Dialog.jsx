import React from 'react';
import '../styles/Dialog.css';

function Dialog(props) {
  return props.open && (
    <div id='icons-card'>
      <div>
        <div>{props.title}</div>
        {props.children}
      </div>
    </div>
  );
}

export default Dialog;