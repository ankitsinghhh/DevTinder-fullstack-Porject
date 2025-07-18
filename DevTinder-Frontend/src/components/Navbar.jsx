import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { CheckBadgeIcon as SolidBadge } from '@heroicons/react/24/solid';
// We'll style one as blue, one as gold via Tailwind


const Navbar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch()
  const navigate = useNavigate()
  // console.log(user);
  const [isPremium,setIsPremium] = useState(false)

  const verifyPremiumUser =  async () =>{
      try {
          const res =  await axios.get(
              BASE_URL+"/premium/verify",
              {withCredentials:true}
          );
          if(res.data.isPremium){
              setIsPremium(true)
          }
      } catch (error) {
          console.error(error)
      }
  }

  useEffect(() => {
    if (user) verifyPremiumUser();
    else setIsPremium(false);
  }, [user]);
  

  const handleLogout = async () =>{
    try{
        const res = axios.post(
          BASE_URL+"/logout",
    
          {
            withCredentials:true
          }
        );
        dispatch(removeUser())
        setIsPremium(false)
        return navigate("/login")


    }
    catch(err){
      console.error(err)
    }
  }


  return (
    <div>
      <div className="navbar bg-base-300 shadow-sm fixed right-0 top-0 z-50 w-full">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            DevTinder
          </Link>
        </div>
        {user && (
          <div className="flex gap-2">
            <p className="form-control px-4 self-center">
              {" "}
              Welcome, {user.firstName} 
            </p>
            {isPremium && (
        <SolidBadge
          className={`h-6 w-6 my-auto text-yellow-400`}
          aria-label={` premium badge`}
        />
      )}
            <div className="dropdown dropdown-end mx-5 ">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Tailwind CSS Navbar component"
                    src={user.photoUrl}
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-sm dropdown-content bg-base-200 rounded-box z-1 mt-3 w-52 p-2 shadow"
              >
                <li>
                  <Link to="/profile" className="justify-between">
                    Profile
                    {/* <span className="badge">New</span> */}
                  </Link>
                </li>
                <li>
                  <Link to="/">Feed</Link>
                </li>
                <li>
                  <Link to="/connections">Connections</Link>
                </li>
                <li>
                  <Link to="/requests">Requests</Link>
                </li>
               {
                !isPremium && (
                  <li>
                  <Link to="/premium">Premium</Link>
                </li>
                )
               }
                <li>
                  <a onClick={handleLogout}>Logout</a>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
