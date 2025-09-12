import React from 'react';
import ReactDOM from 'react-dom/client';
import logo from '../logo_2.jpg';

import './nav.css';


const NavBar = ({
    appName : AppName
}) => {
    return (
       
        <div className='navbar'>
            <div className='marlin_bar'>
                <span className='marlin_title'>MARLIN AI | LIVE</span>
            </div>
           
            <div className='logo'>
               {/* <img src={logo}  /> */}
                <span className='appName'>  <span className='subAppName'></span></span> 
            </div>

        </div> 
    );
}

export default NavBar;