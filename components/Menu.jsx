import React, { useState } from 'react';
import ReportsPage from '../components/ReportsPage'; 
import { db } from './firebase.jsx';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const Menu = () => {
  const [isFocusVisible, setIsFocusVisible] = useState(false);

  const handleMenuClick = () => {
    // Toggle the focus state
    setIsFocusVisible(!isFocusVisible);
  };

  return (
    <div>
      {/* Your menu bar */}
      <ul className="m-5 p-4 w-50 rounded-2xl drop-shadow-xl hidden text-sm font-medium text-center text-white divide-x divide-gray-200 rounded-lg shadow sm:flex bg-black dark:bg-gray-900 dark:divide-gray-700">
        {/* <li className="w-full">
          <a id="dashboardLink" href="#" className="menu-link">
            <i className="fas fa-tachometer-alt"></i> Dashboard
          </a>
        </li>
        <li className="w-full">
          <a id="sentimentLink" href="#" className="menu-link">
            <i className="fas fa-chart-line"></i> Sentiment Analysis
          </a>
        </li>
        <li className="w-full">
          <a id="weekendTrendsLink" href="#" className="menu-link">
            <i className="fas fa-chart-line"></i> Daily Weekend Trends
          </a>
        </li> */}
        {/* Reports Section */}
        <li className="w-full relative">
          <a id="reportsLink" href="#" className="menu-link" onClick={handleMenuClick}>
            <i className="fas fa-file-alt"></i> View Reports
          </a>
          {/* Submenu */}
         
        </li>
      </ul>

      {/* The focus div */}
      {isFocusVisible && (
      
            <div className="focus-div ">
                
                <ReportsPage />
         
        </div>
      )}
    </div>
  );
};

export default Menu;
