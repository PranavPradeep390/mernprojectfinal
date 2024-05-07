import React from 'react'
import { Link } from 'react-router-dom'
import {MdLocationOn} from 'react-icons/md'

function ListingCard({listing}) {
  return (
   <div className='bg-white overflow-hidden rounded-lg shadow-xl' >
       <Link to={`/listing/${listing._id}`}>

        <img src={listing.imageUrls[0]}
         alt="item cover" 
         className='h-[300px] sm:h-[220px] w-[300px] object-cover hover:scale-105
         transition-scale duration-300
        '/>
        <div className='p-3 flex flex-col gap-2 w-full'>
            <p className='text-lg font-semibold text-slate-700'>{listing.name}</p>
            <div className='flex items-center gap-1 '>
                <MdLocationOn className='h-4 w-4 text-green-700'/>
                <p className='text-sm text-gray-600 truncate'>{listing.address}</p>
            </div>
            <div className='flex gap-5'>
                <p className='uppercase font-semibold  p-1 rounded'>{listing.type}</p>
                <p className=' font-semibold text-white bg-green-600 p-1 rounded'>Price : {listing.regularPrice}
                 ${listing.type === 'rent' && ' / month'}
                
                 </p>
            </div>
        </div>
       
       </Link>
        
   </div>
  )
}

export default ListingCard