import React from 'react'
import Nav from '../components/Nav'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'


function Home() {
  return (
    <>
      <Nav />
      <div className="min-h-screen bg-[url('https://i.postimg.cc/F9MsZtCk/pagehome.jpg')] bg-cover bg-center flex justify-center items-center">
        <div className='bg-black/80 backdrop-blur-md rounded-3xl w-auto h-96 flex flex-col justify-center items-center m-4'>
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-white">
            Welcome to <span className="text-pink-800">Nvaloshop</span>
          </h1>
          <p className="text-center text-lg px-8 max-w-5xl mb-8 text-white">
            🎯 เว็บขายไอดี Valorant คุณภาพ ราคาประหยัด พร้อมสกินเทพ Rank สูง และบริการหลังการขายระดับเทพ 🔥
          </p>
          <button className='bg-green-800 h-16 w-auto px-10 rounded-full mt-5'>
            <Link className='text-white' to="/Shop">เข้าหน้าร้านค้า ➜</Link>
          </button>
        </div>
      </div>

      <Footer />
    </>

  )
}

export default Home