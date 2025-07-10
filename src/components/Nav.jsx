import React from 'react'
import { Link } from 'react-router-dom';
import '@fontsource/nosifer';


function Nav() {
  return (
    <>
      <nav>
        <div className='text-white fixed z-50 bg-gradient-to-br from-purple-800 via-purple-950 to-gray-900 w-full h-24 flex justify-center '>
          <div className='container flex items-center justify-between'>
            <div className='font-nosifer text-xl md:text-5xl'>
              <p>NvaloShop</p>
            </div>
            <div className='text-white text-2xl font-bold flex items-center gap-8'>
              <Link className='hover:text-3xl hover:text-pink-600' to="/">Home</Link>
              <Link className='hover:text-3xl hover:text-pink-600' to="/Shop">Shop</Link>
              <Link className='hover:text-3xl hover:text-pink-600' to="/Contact">Contact</Link>
            </div>
          </div>
      

        </div>
      </nav>
    </>

  )
}

export default Nav