import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/SignUp'
import Signin from './pages/Signin'
import About from './pages/About'
import Profile from './pages/Profile'
import Header from './components/Header'
import PrivateRoute from './components/PrivateRoute'
import Createlisting from './pages/Createlisting'
import UpdateListing from './pages/UpdateListing'
import Listing from './pages/Listing'
import Search from './pages/Search'
import Posts from './pages/Posts'

function App() {
  return (
<>
  <Header/>
  <Routes>
   <Route path='/' element={<Home/>}/>
   <Route path='/sign-in' element={<Signin/>}/>
   <Route path='/sign-up' element={<Signup/>}/>
   <Route path='/about' element={<About/>}/>
   <Route path='/search' element={<Search/>}/>
   <Route path='/listing/:listingId' element={<Listing/>} />
   <Route path='/posts' element={<Posts/>}/>

  <Route element={<PrivateRoute/>}> 
    <Route path='/profile' element={<Profile/>}/>
    <Route path='/create-listing' element={< Createlisting/>}/>
    <Route path='/update-listing/:listingId' element={<UpdateListing/>}/>
  </Route>

  </Routes>
</>
  )
}

export default App