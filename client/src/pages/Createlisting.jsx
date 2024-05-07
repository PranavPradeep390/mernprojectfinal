import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import React, {  useState } from 'react'
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';


function Createlisting() {
const {currentUser} = useSelector(state => state.user)

const navigate=useNavigate();

const [files, setFiles] = useState([])

const [error,setError] = useState(false);

const [formData , setFormData]=useState({
    imageUrls:[],
    name:'',
    description:'',
    address:'',
    type:'sale',
    regularPrice:50,
});
console.log(formData);


const handleImageSubmit = (e) =>{

    if(files.length>0 && files.length<7){
        const promises = [];

        for (let i=0; i<files.length; i++){
            promises.push(storeImage(files[i]));
        }
        Promise.all(promises).then((urls)=>{
            setFormData({...formData,imageUrls:formData.imageUrls.concat(urls)});
        });
    }

}
const storeImage = async (file)=>{
    return new Promise((resolve,reject)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime() + file.name;
        const storageRef = ref(storage,fileName);
        const uploadTask = uploadBytesResumable(storageRef,file);
        uploadTask.on(
            "state_changed",
            (snapshot)=>{
                const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                console.log(`Upload ${progress}`);
            },
            (error)=>{
                reject(error);
            },
            ()=>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL)=>{
                    resolve(downloadURL);
                });
            }

        )
    });
};

const handleChange = (e) =>{
    if(e.target.id === 'sale' || e.target.id === 'rent'){
        setFormData({
            ...formData,
            type: e.target.id
        })
    }

    if(e.target.type === 'number' ||
     e.target.type === 'text' || 
      e.target.type === 'textarea')
      {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value
        })
    }

};

const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
        setError(false);
        const res = await fetch('/api/listing/create',{
            method:'POST',
            headers:{
                'Content-Type':'application/json',
            },
            body:JSON.stringify({
                ...formData,userRef: currentUser._id,
            }),

        });
        const data = await res.json();
        if(data.success === false){
            setError(data.message);
        }
        navigate(`/listing/${data._id}`);

    } catch (error) {
        setError(error.message);
    }
}



  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-7'>Create the List</h1>
        <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4' >
            <div className='flex flex-col gap-4 flex-1'>

                <input type="text"  placeholder='Product Name' className='border p-3 rounded-lg ' id='name' required onChange={handleChange} value={formData.name} />

                <textarea type="text"  placeholder='Description' className='border p-3 rounded-lg ' id='description'  required onChange={handleChange} value={formData.description} />

                <input type="text"  placeholder='Address' className='border p-3 rounded-lg ' id='address'  required onChange={handleChange} value={formData.address} />

                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5'
                        onChange={handleChange} 
                        checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5' 
                        onChange={handleChange} 
                        checked={formData.type === 'rent'} />
                        <span>Rent</span>
                    </div>
                </div>

                <div className='flex items-center gap-2'>
                    <input type="number" required id='regularPrice' min={50} max={10000}  className='p-3 border border-gray-300 rounded-lg'
                    onChange={handleChange} value={formData.regularPrice}
                    />
                    <div className=''>
                        <p>Price (or)</p>
                        <p>Rent/Month</p>
                    </div>
                </div>



            </div>

            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images: </p>
                <div className='flex gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)}  className='p-3 border border-gray-300 rounded w-full' type="file" id='images' accept='image/*' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 border border-green-700 rounded uppercase hover:shadow-lg '>Upload</button>
                </div>            
                <button className='bg-green-700 p-3 w-20 mx-auto text-white rounded-lg uppercase hover:opacity-90' >Post</button>

            </div>

        </form>
    </main>
  )
}

export default Createlisting