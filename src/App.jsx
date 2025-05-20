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


  const saveOrUpdate = async () => {
    if (!name.trim() || !rankvalo.trim() || price === "" || isNaN(Number(price)) || !description.trim()) {
      alert("Please fill all fields correctly.")
      return
    }

    try {
      if (editId === null) {
        // CREATE
        await axios.post(`http://localhost:3000/createid`, {
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
    <>
      <div className="w-full max-w-4xl bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Stock Valorant List
        </h2>
        <form action="">
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="rank"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >Rankvalo
            </label>
            <input
              id="rankvalo"
              type="text"
              placeholder="Rankvalo"
              value={rankvalo}
              onChange={(e) => setRankvalo(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="price"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >Price
            </label>
            <input
              id="price"
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="description"
              className="block text-gray-700 text-sm font-semibold mb-2"
            >Description
            </label>
            <input
              id="description"
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        </form>
        <button
          type="button"
          className='bg-green-300 p-2 px-4 rounded-md'
          onClick={saveOrUpdate}
        >
          {editId === null ? "Save" : "Update"}
        </button>

        <div className="w-full max-w-4xl bg-white rounded shadow p-6 mt-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Stock Valorant List
          </h2>
          {datavalolist.length === 0 ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datavalolist.map((product, index) => (
                <div
                  key={product.id ?? index}
                  className="border rounded p-4 shadow hover:shadow-lg transition"
                >
                  <h3 className="font-bold text-lg text-blue-600 mb-1">
                    {product.id}
                  </h3>
                  <h3 className="font-bold text-lg text-blue-600 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Rankvalo:</span> {product.rankvalo}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Price:</span> ${product.price}
                  </p>
                  <p className="text-gray-700">{product.description}</p>
                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => {
                        setEditId(product.id)
                        setName(product.name)
                        setRankvalo(product.rankvalo)
                        setPrice(product.price)
                        setDescription(product.description)
                        window.scrollTo({ top: 0, behavior: 'smooth' }) 
                      }}     
                      className="bg-yellow-300 px-3 py-1 rounded"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => deletevalo(product.id)}
                      className="bg-red-400 px-3 py-1 rounded text-white"
                    >
                      ลบ
                    </button>
                  </div>

                </div>
              ))}
            </div>

          )}
        </div>
      </div>
    </>
  )
}

export default App
