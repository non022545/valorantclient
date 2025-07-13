import React from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { Mail, Phone, Facebook, Instagram } from 'lucide-react';

function Contact() {
  return (
    <>
      <Nav />
      <div className='min-h-screen flex justify-center items-center bg-[url("/images/pagecontact.png")] bg-cover bg-center ' >
        <div className='flex flex-col bg-black/90 w-auto h-auto p-20 rounded-2xl text-white'>
        <h1 className="text-3xl font-bold text-center text-pink-800 mb-8 ">ติดต่อเรา</h1>
          <div className="space-y-6 text-lg ">
            <div className="flex items-center gap-4">
              <Phone className="text-green-600" />
              <span className='font-bold'>โทร:</span>
              <span>062-5232145</span>
            </div>
            <div className="flex items-center gap-4">
              <Mail className="text-pink-600" />
              <span className="font-bold">อีเมล:</span>
              <span>
                <a href="mailto:nontthont7@gmail.com" target="_blank" rel="noopener noreferrer" className="text-sky-500 "> nontthont7@gmail.com </a>
              </span>

            </div>
            <div className="flex items-center gap-4">
              <Facebook className="text-blue-600" />
              <span className='font-bold'>Facebook:</span>
              <span><a href="https://www.facebook.com/chanon.aomkham" target="_blank" rel="noopener noreferrer" className="text-sky-500 ">Chanon Aomkham</a></span>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>

  )
}

export default Contact