import React, { useEffect, useState } from 'react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import ProductCard from '../components/ProductCard';
import axios from 'axios'


function Shop() {

  const [datavalo, setDatavalo] = useState([])

  useEffect(() => {

    fetchdatavalo()
  }, []);

  const fetchdatavalo = async () => {
    try {
      // const response = await axios.get(`http://localhost:3000/stockvalorant`)
      const response = await axios.get(`https://valorantserver.onrender.com/stockvalorant`)
      setDatavalo(response.data)
    } catch (error) {
      console.log("ไม่สามารถโหลดข้อมูลได้ API อาจจะมีปัญหา:", error)
    }
  }

  console.log(datavalo)




  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gradient-to-br from-purple-950 via-to-gray-900 to-gray-900  flex justify-center items-center">
         <div className='pt-32 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 p-10 gap-10 '>
          {datavalo.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}

        </div>
      </div>
      <Footer />
    </>
  )
}

export default Shop