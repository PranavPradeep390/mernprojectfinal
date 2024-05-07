import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';


function Posts() {
    const [showListingError,setShowListingError]=useState(false);
    const [userListings ,setUserListings] = useState([]);
    const {currentUser} = useSelector((state)=>state.user);


    useEffect(()=>{
        const handleShowListings= async ()=>{
            try {
              setShowListingError(false);
              console.log(`${currentUser._id}`);
              const res = await fetch(`/api/user/listings/${currentUser._id}`);
              const data = await res.json();
              if(data.success === false){
                setShowListingError(true);
                
                return;
              }
              setUserListings(data);
            } catch (error) {
              setShowListingError(true);
            }
          };

          handleShowListings();
    },[]);


    const handleListingDelete = async (listingId) =>{
        try {
          const res = await fetch(`/api/listing/delete/${listingId}`,{
            method:'DELETE',
          });
          const data = await res.json();
          if(data.success === false){
            console.log(data.message);
            return;
          }
          setUserListings((prev)=>prev.filter((listing)=>listing._id !== listingId));
        } catch (error) {
          console.log(error.message);
        }
      }
  return (
<>
<h1 className='text-center text-3xl mt-3'>Your Posts</h1>
      <div className=' flex flex-wrap p-10'>
          {userListings && 
         userListings.length > 0 && 
       
            userListings.map((listing)=> (
  
  
                <div key={listing._id} className=' p-3 m-10 flex border shadow-2xl  justify-center items-center gap-4 mt-3 rounded-lg hover:scale-105  ' style={{width:"350px",marginBottom:"10px",backgroundColor:"lightcyan"}}>
  
               <div>
                      <Link to={`/listing/${listing._id}`}>
            
                      <img src={listing.imageUrls[0]} alt="listing image" className=' object-contain ' style={{height:"150px",width:"170px"}} />
                      </Link>
            
                      <Link className='flex-1 text-slate-700 font-semibold  truncate' to={`/listing/${listing._id}`}>
                      <p>{listing.name}</p>
                      </Link>
  
                      <p className='uppercase'> for {listing.type}</p>
               </div>
        
                  <div className='flex gap-3 items-center'>
                    <button onClick={()=>handleListingDelete(listing._id)} className='text-red-700  bg-slate-200 p-2 rounded-lg font-semibold'>
                    Delete
                    </button>
        <Link to={`/update-listing/${listing._id}`}>
          
                      <button className='text-green-700   bg-slate-200 p-2 rounded-lg font-semibold'>
                      Edit
                      </button>
        </Link>
                  </div>
                  
        
                
                </div>
      
            
          ))
            
            }
  
  
  
      </div>
</>
  )
}

export default Posts