import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {Swiper ,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules';
import 'swiper/css/bundle';
import { FaAddressCard } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';

function Listing() {
    SwiperCore.use([Navigation]);
const params = useParams();
const {currentUser} = useSelector((state)=> state.user);
const [contact ,setContact] = useState(false);
const [listing ,setListing] = useState(null);
const [error,setError] = useState(false);
useEffect(()=>{
    const fetchListing = async () =>{
        try {
            const res = await fetch(`/api/listing/get/${params.listingId}`);
        const data = await res.json();
        if (data.success === false){
            setError(true);
            return;
        }
        setListing(data);
        } catch (error) {
            setError(true);
        }
        

    };
    fetchListing();

},[params.listingId]);


  return (
    <main>
        
        {listing && !error && 
        <div>
        <Swiper navigation>
            {
                listing.imageUrls.map((url)=>(
                    <SwiperSlide key={url}>
                        <div className='h-[500px]' style={{objectFit:"fill",margin:"20px",background:`url(${url}) center no-repeat`}}>
                        </div>
                    </SwiperSlide>
         ))}
        </Swiper>

        <br />
        <div className=''>

            <h1 className='font-bold text-black ml-10' style={{fontSize:"40px"}}>{listing.name}</h1> 
            <button className=' p-2 w-30 rounded-lg text-black ml-10'><span className='uppercase font-bold'>{listing.regularPrice }   
            &nbsp;${listing.type === 'rent' && ' / month'}
              ,</span></button>

            <button className=' p-2 w-30 rounded-lg'><span className='uppercase font-bold text-black'>for &nbsp; {listing.type}</span></button>
        </div>
        
             <div className='p-10'>
                 <p className='text-slate-600  text-justify flex gap-2'><FaAddressCard className='text-lg'/> <span className='font-bold text-black'>  Address :  </span>{listing.address}</p>
    
                 <p className='text-slate-600  text-justify mt-6'><span className='font-bold text-black'>Description : </span> {listing.description}</p>
                 
                 { currentUser && listing.userRef !== currentUser._id && !contact  && ( 
                    <button onClick={()=>setContact(true)} className='bg-green-800 p-3 w-60 rounded-lg mt-6 text-white font-semibold uppercase'>Contact Owner</button>
                 )}
<br />
                 {contact && <Contact listing ={listing}/>}
                 <br />
             </div>

             


        </div>
        }

    </main>
  );
}

export default Listing