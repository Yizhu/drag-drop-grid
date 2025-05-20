import React from 'react';
import ReactDOM from 'react-dom/client';
// import { IntlProvider }              from 'react-intl'
import './index.css';
// import App from './App';
import Canvas from './Canvas'
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/* <IntlProvider locale='en'> */}
      <Canvas />
    {/* </IntlProvider> */}
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
