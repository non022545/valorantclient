import React from 'react';

function ProductCard({ product }) {
    return (
        <div className="bg-white/80 backdrop-blur-md p-10 rounded-lg shadow-lg max-w-md ">
            {/* รูปภาพ */}
            {product.imageurl && (
                <img
                    src={product.imageurl}
                    alt={product.name}
                    className="w-full h-auto object-cover rounded-md mb-4"
                />
            )}
            <h2 className="text-3xl font-bold text-blue-900 mb-5 mt-5">{product.name}</h2>
            <div className='flex items-end gap-2'>
                <p className="text-xl font-bold text-black">แรงค์:</p>
                <p className="text-2xl font-bold text-pink-800">{product.rankvalo}</p>
            </div>
            <div className='flex items-end gap-2 mt-1'>
                <p className="text-xl font-bold text-black ">
                    ราคา:
                </p>
                <p className='text-green-700 text-2xl font-bold'>{product.selling_price.toLocaleString()}</p>
                <p className='text-xl font-bold text-black'>บาท</p>
            </div>
            <div className='flex items-end gap-2 mt-2'>
                <p className='text-black text-md '>{product.description}</p>
            </div>
        </div>
    );
}

export default ProductCard;
