import React, { useRef, useState,useEffect } from 'react'
import { useSelector } from 'react-redux'
import {getDownloadURL, getStorage,ref, uploadBytesResumable} from 'firebase/storage';
import { app } from '../firebase';
import { updateUserStart,updateUserSuccess,updateUserFailure, deleteUserFailure,deleteUserSuccess,deleteUserStart,signOutUserStart,signOutUserSuccess,signOutUserFailure } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import {Link} from 'react-router-dom';
// import Posts from './Posts';


function Profile() {
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state)=>state.user);
 const [file,setFile]=useState(undefined);
 const [filePerc , setFilePerc] = useState(0);
 const [fileUploadError,setFileUploadError]= useState(false);
const [formData,setFormdata]= useState({});
const dispatch = useDispatch();
// console.log(formData);
const [showListingError,setShowListingError]=useState(false);
const [userListings ,setUserListings] = useState([]);



useEffect(()=>{
 if (file){
  handleFileUpload(file);
 }
},[file]);

const handleFileUpload = (file)=>{
const storage = getStorage(app);
const fileName = new Date().getTime()+ file.name;
const storageRef = ref(storage,fileName);
const uploadTask = uploadBytesResumable(storageRef,file);

uploadTask.on('state_changed',
(snapshot)=>{
  const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
  // console.log('Upload is '+ progress +'% done');
  setFilePerc(Math.round(progress));
},

(error)=>{
  setFileUploadError(true);
},
()=>{
  getDownloadURL(uploadTask.snapshot.ref).then
  ((downloadURL)=>
      setFormdata({...formData,avatar: downloadURL})
    
  );

}

);
};
const handleChange=(e)=>{
 setFormdata({...formData, [e.target.id]: e.target.value });
};

const handleSubmit = async (e)=>{
  e.preventDefault();
  try {
    dispatch(updateUserStart());
    const res = await fetch(`/api/user/update/${currentUser._id}`,{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
      },
      body:JSON.stringify(formData),
    });
    const data = await res.json();
    if(data.success === false){
      dispatch(updateUserFailure(data.message));
      return;
    }
    dispatch(updateUserSuccess(data));
  } catch (error) {
    dispatch(updateUserFailure(error.message));
    console.log("error happened");
  }
};

const handleDeleteUser = async ()=>{
  try {
    dispatch(deleteUserStart());
    const res = await fetch(`/api/user/delete/${currentUser._id}`,
  {
    method:'DELETE',
  });
  const data = await res.json();
  if(data.success === false){
    dispatch(deleteUserFailure(data.message));
    return;
  }
  dispatch(deleteUserSuccess(data));
    
  } catch (error) {
    dispatch(deleteUserFailure(error.message))
  }

};

const handleSignOut= async () =>{
try {
  dispatch(signOutUserStart());
  const res = await fetch('/api/auth/signout');
  const data = await res.json();
  if(data.success === false){
    dispatch(deleteUserFailure(data.message));
    return;
  }
  dispatch(deleteUserSuccess(data));
} catch (error) {
  dispatch(deleteUserFailure(data.message));

}
}
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
}


  return (
    <div div className=' max-w-lg mx-auto border p-6 m-5'style={{backgroundColor:"whitesmoke"}}>
      
      <form onSubmit={handleSubmit} className='flex flex-col gap-4 ' >
        
        <h1 className='text-3xl font-semibold text-center'>Profile</h1>

      <input onChange={(e)=>setFile(e.target.files[0])} type="file"  ref={fileRef} hidden accept='image/*'/>

        <img onClick={()=>fileRef.current.click()} className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2' src={formData.avatar || currentUser.avatar} alt="Profile"  />

        <input type="text" placeholder='Username' id='username' 
        defaultValue={currentUser.username}
        className='border p-3 rounded-lg'
        onChange={handleChange} />

        <input type="email" placeholder='Email' id='email' 
        defaultValue={currentUser.email}
        className='border p-3 rounded-lg'
        onChange={handleChange} />

        <input type="password" placeholder='Password' id='password' className='border p-3 rounded-lg'
        onChange={handleChange} />

        <button className='bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-90 disabled:opacity-80 mx-auto'style={{width:"200px"}}>update account</button>


    <Link className='bg-green-700 p-3 text-white rounded-lg text-center uppercase mx-auto hover:opacity-90' to={'/create-listing'} style={{width:"200px"}}>
      make a sell
    </Link>
      </form>
      <div className='flex justify-between mt-5'>
        <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>Delete Account</span>
   <Link to={'/posts'}>   <button onClick={handleShowListings} className='text-red-700 w-full'>Show Your Posts</button></Link>

        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>Sign Out</span>
      </div>








    
    </div> 
  );
}

export default Profile