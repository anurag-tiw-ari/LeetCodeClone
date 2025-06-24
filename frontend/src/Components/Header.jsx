import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice.js";
import { useNavigate } from "react-router";
import { Link, NavLink } from "react-router";
import { useState,useEffect } from "react";
import axiosClient from "../utils/axiosClient.js";

function Header() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const [profilepic,setProfilePic] = useState(null)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
      useEffect(() => {
        const fetchPP = async () => {
          try {
            const resp = await axiosClient.get('/user/profilepic');
          //  console.log("header res:", resp)
            setProfilePic(resp.data.profilePic.secureURL);
          } catch (err) {
            console.log(err?.response?.data);
          }
        };
        if(user)
        fetchPP();
      }, [user]);

    const handleLogOut = () => {
        if (isAuthenticated) dispatch(logoutUser());
    };
    
    const handleSignUp = () => {
        if (!isAuthenticated) {
            navigate("/signup");
        }
    };

    return (
        <header className="navbar bg-base-100/90 shadow-lg fixed top-0 px-4 sm:px-8 z-15 backdrop-blur-md border-b border-base-200">
            {/* Left side - Logo */}
            <div className="flex-1">
                <NavLink 
                    to="/" 
                    className="btn btn-ghost text-md sm:text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent hover:bg-gradient-to-l transition-all duration-300"
                >
                  Coding Platform
                </NavLink>
            </div>
            
            <div className="hidden md:flex gap-3 px-4">
                <a 
                    href="#learnDSA"
                    className="btn btn-ghost btn-md font-medium hover:text-primary transition-colors"
                    onClick={()=>navigate("/?pageId=learnDSA")}
                >
                    Learn DSA
                </a>
                <a 
                    href="#battle" 
                    className="btn btn-ghost btn-md font-medium hover:text-secondary transition-colors"
                    activeClassName="text-secondary font-semibold"
                    onClick={()=>navigate("/?pageId=battle")}
                >
                    <span className="relative">
                        Code Battle
                        <span className="absolute top-1 right-2 -mt-2 -mr-4 h-2 w-2 rounded-full bg-secondary animate-ping opacity-75"></span>
                        <span className="absolute top-1 right-2 -mt-2 -mr-4 h-2 w-2 rounded-full bg-secondary"></span>
                    </span>
                </a>
                <Link
                    to="/battle/weeklyleaderboard" 
                    className="btn btn-ghost btn-md font-medium hover:text-primary transition-colors"
                    activeClassName="text-secondary font-semibold"
                >
                    <span className="relative">
                        Weekly LeaderBoard
                    </span>
                </Link>
            </div>
            
            {/* Right side - User controls */}
            <div className="flex-none gap-2 sm:gap-4 items-center ">
                {isAuthenticated && user?.role === 'admin' && (
                    <NavLink 
                        to="/admin" 
                        className="btn btn-sm btn-outline btn-primary hidden sm:inline-flex mr-3"
                    >
                        Admin DashBoard
                    </NavLink>
                )}
                
                {/* Mobile menu button */}
                <div className="dropdown dropdown-end md:hidden">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </label>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52 border border-base-200">
                        <li><a href="#learnDSA">Learn DSA</a></li>
                        <li><a to="#battle">Code Battle</a></li>
                        <li><Link to="/battle/weeklyleaderboard" >Weekly LeaderBoard</Link></li>
                        {isAuthenticated && user?.role === 'admin' && (
                            <li><NavLink to="/admin">Admin Dashboard</NavLink></li>
                        )}
                    </ul>
                </div>
                
                {/* User avatar dropdown */}
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                        <div className="w-8 rounded-full">
                            <img
                                alt="User profile"
                                src={profilepic || "https://th.bing.com/th/id/OIP.-OwdeGjbVmQWf62Ynk9_8AHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain"}
                            />
                        </div>
                    </label>
                    
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                        {isAuthenticated ? (
                            <>
                                <li className="border-b border-base-200">
                                    <div className="flex flex-col px-4 py-2">
                                        <span className="font-semibold">{user?.firstName || "User"}</span>
                                        <span className="text-xs text-gray-500">{user?.email}</span>
                                    </div>
                                </li>
                                <li>
                                    <NavLink to="/userprofile" className="hover:bg-base-200">
                                        Profile
                                    </NavLink>
                                </li>
                                <li className="border-t border-base-200">
                                    <label 
                                        htmlFor="my_modal_6" 
                                        className="text-error hover:bg-error/10"
                                    >
                                        Log Out
                                    </label>
                                </li>
                            </>
                        ) : (
                            <>
                                <li>
                                    <NavLink to="/login" className="hover:bg-base-200">
                                        Login
                                    </NavLink>
                                </li>
                                <li>
                                    <NavLink to="/signup" className="hover:bg-base-200">
                                        Sign Up
                                    </NavLink>
                                </li>
                            </>
                        )}
                    </ul>
                </div>
            </div>
            
            {/* Logout confirmation modal */}
              {   isAuthenticated ? <>
                        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                        <div className="modal top-0 left-0 fixed justify-center items-center h-screen w-screen" role="dialog">
                        <div className="modal-box">
                            <p className="py-2 text-2xl text-center leading-0.8">Are You Sure You Want To Logout?</p>
                            <div className="modal-action flex justify-evenly">
                                <label htmlFor="my_modal_6" className="btn btn-primary">NO</label>
                            <label onClick={handleLogOut} className="btn btn-md btn-error">Log Out</label>
                            </div>
                        </div>
                        </div> </>: null
                    }
        </header>
    );
}

export default Header;