import React from 'react'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/nosifer';
import { Menu, X } from 'lucide-react';



function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <>
      <nav>
        <div className='fixed z-50 bg-gradient-to-br from-purple-800 via-purple-950 to-gray-900 w-full h-24 flex justify-center p-4  '>
          <div className='container flex items-center justify-between'>
            <div>
              <img className='w-60 h-auto md:w-96' src="/images/NVALOSHOP_WHITE.png" alt="NVALOSHOP-WHITE" />
            </div>
            {/* <div className='font-nosifer text-xl md:text-5xl text-white'>
              <p>NvaloShop</p>
            </div> */}
            {/* 📱 ปุ่มเมนูสำหรับจอเล็ก */}
            <button
              className="text-white md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={35} /> : <Menu size={35} />}
            </button>

            {/* 🌐 เมนู (แสดงบนจอใหญ่เสมอ, จอเล็กซ่อน) */}
            <div className="hidden text-white md:flex font-bold gap-6 text-sm md:text-2xl">
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/">Home</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Shop">Shop</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Contact">Contact</Link>
              <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Admin_Npass_non0625232145">Dashboard</Link>
              {/* <Link className='hover:text-pink-600 hover:text-lg md:hover:text-3xl' to="/Alllogin">Login</Link> */}
            </div>
          </div>
          {/* 📱 เมนูบนมือถือแบบ dropdown (toggle) */}
          {menuOpen && (
            <div className="absolute font-bold text-white top-24 left-0 right-0 bg-gradient-to-br from-purple-800 via-purple-950 to-gray-900 flex flex-col items-center gap-4 p-4 md:hidden z-50">
              <Link className="hover:text-pink-500" to="/">Home</Link>
              <Link className="hover:text-pink-500" to="/Shop">Shop</Link>
              <Link className="hover:text-pink-500" to="/Contact">Contact</Link>
              <Link className="hover:text-pink-500" to="/Admin_Npass_non0625232145">Admin</Link>
            </div>
          )}

        </div>
      </nav>
    </>

  )
}

export default Nav