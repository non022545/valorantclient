import React from 'react'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Swal from 'sweetalert2'

function App() {
  const [datavalolist, setDatavalolist] = useState([])
  const [name, setName] = useState("")
  const [rankvalo, setRankvalo] = useState("")
  const [price, setPrice] = useState("")  // ให้เป็น string รับ input ก่อน
  const [description, setDescription] = useState("")
  const [editId, setEditId] = useState(null)
  const [isDarkMode, setIsDarkMode] = useState(false) // เพิ่มบรรทัดนี้



  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const saveOrUpdate = async () => {
    if (!name.trim() || !rankvalo.trim() || price === "" || isNaN(Number(price)) || !description.trim()) {
      alert("Please fill all fields correctly.")
      return
    }

    try {
      if (editId === null) {
        // CREATE
        // await axios.post(`http://localhost:3000/createid`, {
          await axios.post(`https://valorantserver-production.up.railway.app/deleteid`, {
          name,
          rankvalo,
          price: Number(price),
          description,
        })
        Swal.fire({
          icon: 'success',
          title: 'เพิ่มข้อมูลสำเร็จ!',
          text: 'ข้อมูลถูกเพิ่มแล้วในระบบ',
        })
      } else {
        // UPDATE
        // await axios.put(`http://localhost:3000/updateid/${editId}`, {
          await axios.put(`https://valorantserver-production.up.railway.app/updateid/${editId}`, {
          name,
          rankvalo,
          price: Number(price),
          description,
        })
        Swal.fire({
          icon: 'success',
          title: 'อัปเดตข้อมูลสำเร็จ!',
          text: 'ข้อมูลถูกแก้ไขเรียบร้อยแล้ว',
        })
        setEditId(null)
      }

      await fetchdatavalo()
      setName("")
      setRankvalo("")
      setPrice("")
      setDescription("")
    } catch (error) {
      console.error("Error saving item:", error)
      alert("Error saving item")
    }
  }

  const deletevalo = async (id) => {
    const confirmResult = await Swal.fire({
      title: 'คุณแน่ใจหรือไม่?',
      text: "ข้อมูลนี้จะถูกลบถาวร!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'ใช่, ลบเลย!',
      cancelButtonText: 'ยกเลิก'
    })

    if (confirmResult.isConfirmed) {
      try {
        // await axios.delete(`http://localhost:3000/deleteid/${id}`)
        await axios.delete(`https://valorantserver-production.up.railway.app/deleteid/${id}`)
        await fetchdatavalo()
        Swal.fire('ลบแล้ว!', 'ข้อมูลถูกลบเรียบร้อย.', 'success')
      } catch (error) {
        console.error("Error deleting item:", error)
        Swal.fire('เกิดข้อผิดพลาด!', 'ไม่สามารถลบข้อมูลได้.', 'error')
      }
    }
  }


  const fetchdatavalo = async () => {
    try {
      // const response = await axios.get(`http://localhost:3000/stockvalorant`)
      const response = await axios.get(`https://valorantserver-production.up.railway.app/stockvalorant`)
      setDatavalolist(response.data)
    } catch (error) {
      console.log("Fail fetchdatavalorant")
    }
  }

  useEffect(() => {
    fetchdatavalo()
  }, [])

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 px-4 transition-colors duration-500">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Toggle Dark Mode */}
          <div className="flex justify-end mb-4">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isDarkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
            </button>
          </div>

          <h1 className="text-4xl font-bold text-center text-blue-700 dark:text-blue-300 mb-8">
            Stock Valorant Management
          </h1>

          {/* Form */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
              {editId === null ? "Add New Stock" : "Update Stock"}
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Rank</label>
                <input
                  type="text"
                  value={rankvalo}
                  onChange={(e) => setRankvalo(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Rank"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Price</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Price"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="Description"
                />
              </div>
            </form>
            <button
              onClick={saveOrUpdate}
              className="mt-4 inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
            >
              {editId === null ? "Save" : "Update"}
            </button>
          </div>

          {/* List */}
          <div className="mt-10">
            <h2 className="text-2xl font-semibold mb-4 text-gray-700 dark:text-gray-100">
              Stock List
            </h2>
            {datavalolist.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400">No data available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {datavalolist.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-lg p-4 shadow-md bg-white dark:bg-gray-700 hover:shadow-lg transition"
                  >
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-blue-700 dark:text-blue-300 mb-1">#{product.id} - {product.name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Rank:</span> {product.rankvalo}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        <span className="font-semibold">Price:</span> ${product.price}
                      </p>
                      <p className="text-gray-700 dark:text-gray-200 mt-1">{product.description}</p>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          setEditId(product.id)
                          setName(product.name)
                          setRankvalo(product.rankvalo)
                          setPrice(product.price)
                          setDescription(product.description)
                          window.scrollTo({ top: 0, behavior: 'smooth' })
                        }}
                        className="bg-yellow-400 text-white px-3 py-1 rounded-md hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deletevalo(product.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App