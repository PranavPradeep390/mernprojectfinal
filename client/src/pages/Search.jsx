import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

function Search() {
    const navigate = useNavigate();
    const [showMore , setShowMore] = useState(false);

    const [sideBarData, setSideBarData] = useState({
        searchTerm:'',
        type:'all',
        sort:'created_at',
        order:'desc'
    });

    const [listings,setListings] = useState([]);
    
    // console.log(listings);

    useEffect(()=>{
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        const typeFromUrl = urlParams.get('type');
        const sortFromUrl = urlParams.get('sort');
        const orderFromUrl = urlParams.get('order');

        if(
            searchTermFromUrl ||
            typeFromUrl ||
            sortFromUrl ||
            orderFromUrl
        ){
            setSideBarData({
                searchTerm: searchTermFromUrl || '',
                type: typeFromUrl || 'all',
                sort: sortFromUrl || 'created_at',
                order: orderFromUrl || 'desc'
            });}

const fetchListings = async ()=>{
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length>8){
        setShowMore(true);
    }else{
        setShowMore(false);
    }
    setListings(data);



};
fetchListings();



    },[location.search]);


    // console.log(sideBarData);

const handleChange =(e)=>{

    if(e.target.id === 'all' || e.target.id === 'rent' || e.target.id === 'sale' ){
        setSideBarData({...sideBarData,type: e.target.id})
    }

    if(e.target.id === 'searchTerm'){
        setSideBarData({...sideBarData,searchTerm:e.target.value})
    }

    if(e.target.id === 'sort_order'){
        const sort = e.target.value.split('_')[0] || 'created_at';

        const order = e.target.value.split('_')[1] || 'desc';

        setSideBarData({...sideBarData,sort,order});
    }

};

const handleSubmit =(e)=>{
    e.preventDefault();
    const urlParams = new URLSearchParams()
    urlParams.set('searchTerm',sideBarData.searchTerm)
    urlParams.set('type',sideBarData.type)
    urlParams.set('sort',sideBarData.sort)
    urlParams.set('order',sideBarData.order)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`);
};

const onShowMoreClick = async () =>{
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if(data.length<9){
        setShowMore(false);
    }
    setListings([...listings,...data]);
};


  return (
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-r-4 border-y-4 border-x-teal-200' style={{backgroundColor:"whitesmoke"}}>
            <form onSubmit={handleSubmit} className='flex flex-col gap-8'>
                <div className='flex items-center gap-2'>
                    <label className='whitespace-nowrap'>Search Term :</label>
                    <input type="text"
                    id='searchTerm'
                    placeholder='Search...'
                    className='border rounded-lg p-3 w-full'
                    value={sideBarData.searchTerm}
                    onChange={handleChange}
                    />
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label className='font-semibold'>Type:</label>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='all' className='w-5'
                        onChange={handleChange}
                        checked={sideBarData.type === 'all'}
                        />
                        <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='rent' className='w-5'
                         onChange={handleChange}
                         checked={sideBarData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                        <input type="checkbox" id='sale' className='w-5'
                         onChange={handleChange}
                         checked={sideBarData.type === 'sale'}
                        
                        />
                        <span>Sale</span>
                    </div>
                </div>

<div className='flex items-center gap-2'>
<label className='font-semibold'>
    Sort : 
</label>
<select 
onChange={handleChange}
defaultValue={'created_at_desc'}
className='border rounded-lg p-3'  id="sort_order">
    <option value='regularPrice_desc'>Price High to Low</option>
    <option value='regularPrice_asc'>Price Low to High</option>
    <option value='createdAt_desc'>Latest</option>
    <option value='createdAt_asc'>Oldest</option>

</select>
</div>
<button className='bg-slate-700 text-white p-3 rounded-lg uppercase'>Search</button>
            </form>
        </div>
        <div className='flex-1'>
            <h5 className='text-3xl font-semibold p-3 text-slate-700 mt-5'>Search Details  : </h5>

            <div className='p-9 flex flex-wrap gap-4'>
                {listings.length === 0 && (
                    <p className='text-xl text-slate-700'>No Listings Found !</p>
                )}


                {
                listings && listings.map((listing)=>(
                <ListingCard key={listing._id} listing={listing}/>
                ))}
                
{showMore && (
    <button onClick={()=>{
        onShowMoreClick();
    }} className='text-green-700 p-7 text-center w-full'>
Show More...
    </button>
)}
                

            </div>


        </div>


    </div>
  )
}

export default Search