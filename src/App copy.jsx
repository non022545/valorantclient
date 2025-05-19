import React, { useState, useEffect } from "react"
import axios from "axios"

function App() {
  const [name, setName] = useState("")
  const [rank, setRank] = useState("")
  const [price, setPrice] = useState("")
  const [description, setDescription] = useState("")
  const [datavalolist, setDatavalolist] = useState([])
  const [showdata, setShowdata] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const fetchdatavalo = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`http://localhost:3000/stockvalorant`)
      setDatavalolist(response.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
      setError("Fail to fetch data")
      console.log("fail fetchdatavalo", error)
    }
  }

  useEffect(() => {
    fetchdatavalo()
  }, [])

  const getStockvalorant = async () => {
    if (!name.trim() || !rank.trim() || price === "" || isNaN(price)) {
      alert("Please fill all fields correctly.")
      return
    }

    try {
      setLoading(true)
      await axios.post(`http://localhost:3000/createid`, {
        name,
        rank,
        price: Number(price),
        description,
      })
      await fetchdatavalo()
      setName("")
      setRank("")
      setPrice("")
      setDescription("")
    } catch (err) {
      console.error("Error adding item:", err)
      alert("Error adding item")
    } finally {
      setLoading(false)
    }
  }

  const Onclickshowdata = () => {
    setShowdata(!showdata)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Valorant Stock Manager</h1>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-6 w-full max-w-lg"
      >
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Name
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
          >
            Rank
          </label>
          <input
            id="rank"
            type="text"
            placeholder="Rank"
            value={rank}
            onChange={(e) => setRank(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="price"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Price
          </label>
          <input
            id="price"
            type="number"
            placeholder="Price"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="description"
            className="block text-gray-700 text-sm font-semibold mb-2"
          >
            Description
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

        <button
          onClick={getStockvalorant}
          disabled={loading}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      </form>

      <button
        onClick={Onclickshowdata}
        className="mb-4 px-6 py-2 bg-green-500 hover:bg-green-700 text-white font-semibold rounded shadow"
      >
        {showdata ? "Hide Data" : "Show Data"}
      </button>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {showdata && (
        <div className="w-full max-w-4xl bg-white rounded shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-800">
            Stock Valorant List
          </h2>
          {loading && <p className="mb-4 text-gray-600">Loading data...</p>}

          {datavalolist.length === 0 && !loading ? (
            <p className="text-gray-500">No data available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {datavalolist.map((product, index) => (
                <div
                  key={product.id ?? index}
                  className="border rounded p-4 shadow hover:shadow-lg transition"
                >

                  <h3 className="font-bold text-lg text-blue-600 mb-1">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Rank:</span> {product.rank}
                  </p>
                  <p className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Price:</span> ${product.price}
                  </p>
                  <p className="text-gray-700">{product.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
