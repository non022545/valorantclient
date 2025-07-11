import React from 'react'
import { Link } from 'react-router-dom';
import '@fontsource/nosifer';


function Nav() {
  return (
    <>
      <nav>
        <div className='fixed z-50 bg-gradient-to-br from-purple-800 via-purple-950 to-gray-900 w-full h-24 flex justify-center p-4  '>
          <div className='container flex items-center justify-between'>
            <div className='font-nosifer text-xl md:text-5xl text-white'>
              <p>NvaloShop</p>
            </div>
            <div className='text-white  font-bold flex items-center gap-2 text-sm md:text-2xl md:gap-8'>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/">Home</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Shop">Shop</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Contact">Contact</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Admin_Npass_non0625232145">Admin</Link>
            </div>
          </div>
      

        </div>
      </nav>
    </>

  )
}

export default Nav