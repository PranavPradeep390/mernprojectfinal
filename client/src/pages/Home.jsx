import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ListingCard from '../components/ListingCard';
import './home.css'
import Footer from '../components/Footer';
function Home() {

  const [saleListings , setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  console.log(rentListings);
  console.log(saleListings);


useEffect(()=>{
  const fetchRentListings = async () =>{
    try {
      const res = await fetch('/api/listing/get?type=rent&limit=3');
      const data = await res.json();
      setRentListings(data);
    } catch (error) {
      console.log(error);
    }
  }
  fetchRentListings();


  const fetchSaleListing = async () =>{
    try {
      const res = await fetch('/api/listing/get?type=sale&limit=3');
      const data = await res.json();     
      setSaleListings(data) ;
    } catch (error) {
      log(error);
      
    }
  }
  fetchSaleListing();



},[]);
  return (
  <>
      <div className='homepic'>
        <div className='flex flex-col gap-6 p-28 px-3 max-w-6xl mx-auto' >
          <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Buy & Sell Near You
          </h1>
         <i>
            <p className='text-gray-800 text-xs sm:text-sm'>Join the millions who buy and sell from each other <br />
    everyday in local communities around the world</p>
         </i>
      <Link className='text-xs sm:text-sm text-blue-500' to={'/search'}>Lets Make A Deal </Link>
        </div>
      </div>
      
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10' >

        {rentListings && rentListings.length>0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>Recent Items For Rent</h2>
              <Link className='text-sm text-blue-800' to={'/search?type=rent'}>Show More</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {rentListings.map((listing)=>(
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}

{saleListings && saleListings.length>0 && (
          <div className=''>
            <div className='my-3'>
              <h2 className='text-2xl font-semibold text-slate-500'>Recent Items For Sale</h2>
              <Link className='text-sm text-blue-800' to={'/search?type=rent'}>Show More</Link>
            </div>
            <div className='flex flex-wrap gap-4'>
              {saleListings.map((listing)=>(
                <ListingCard listing={listing} key={listing._id}/>
              ))}
            </div>
          </div>
        )}

      </div>
      <Footer/>
     
  </>

    
  )
}

export default Home