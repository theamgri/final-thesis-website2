import React from 'react';
import Image from 'next/image';
import SearchBar from '../components/Searchbar';
// import logo from '/public/icon.png';
// import SearchBar from './Searchbar';

 

  const Navbar = () => {
    
    return ( // Add a return statement to return the JSX
      <nav className="fixed w-full h-24 shadow-xl">
        <div className="flex justify-between items-center h-full w-full px-4 2xl:px-16">

        <a href="/" className="flex items-center">
          <a>
          
            <Image
              src="/icon.png"
              alt="Gecko Logo"
              className="rounded-full"
              width={40}
              height={40}
              priority
            />
          </a>
  
          <span className="ml-5 self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Gecko</span>
        </a>
       
        <a className="ml-10 font-bold text-xl uppercase hover:border-b text-md p-4 ">
        Dashboard
        </a>
        
     
        </div>
       
      </nav>
    );
  };
  
  

export default Navbar;