import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../authSlice.js";
import { useNavigate } from "react-router";
import { Link, NavLink } from "react-router";

function Header() {
    const { user, isAuthenticated } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const handleLogOut = () => {
        if (isAuthenticated) dispatch(logoutUser());
    };
    
    const handleSignUp = () => {
        if (!isAuthenticated) {
            navigate("/signup");
        }
    };

    return (
        <div className="navbar bg-base-100 shadow-lg fixed top-0 px-4 sm:px-8 z-50 backdrop-blur-sm bg-opacity-90">
            <div className="flex-1">
                <NavLink to="/" className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                    Coding Platform
                </NavLink>
            </div>
            
            <div className="flex-none gap-4 items-center">
                {isAuthenticated && user?.role === 'admin' && (
                    <NavLink 
                        to="/admin" 
                        className="btn btn-sm btn-outline btn-primary hidden sm:inline-flex mr-2"
                    >
                        Admin Dashboard
                    </NavLink>
                )}
               
                
                <div className="dropdown dropdown-end">
                    <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                        <div className="w-10 rounded-full ring ring-primary ">
                            <img
                                alt="User profile"
                                src={user?.image || "https://th.bing.com/th/id/OIP.-OwdeGjbVmQWf62Ynk9_8AHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain"}
                            />
                        </div>
                    </div>
                    
                    <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-200">
                        {isAuthenticated && user?.role === 'admin' && (
                            <li className="sm:hidden  text-blue-600 text-[18px] hover:text-blue-700">
                                <NavLink to="/admin">Admin Dashboard</NavLink>
                            </li>
                        )}
                        <li>
                            <NavLink to="/userprofile" className="justify-between text-blue-600 text-[16px] hover:text-blue-500">
                                Profile
                                {isAuthenticated && (
                                    <span className="text-sm opacity-70 text-white">{user?.firstName}</span>
                                )}
                            </NavLink>
                        </li>
                        <li>
                            <label 
                                htmlFor="logout_modal" 
                                className="justify-between text-error"
                                onClick={handleSignUp}
                            >
                                {isAuthenticated ? "Log Out" : "Sign Up"}
                            </label>
                        </li>
                    </ul>
                </div>
            </div>
            
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
        </div>
    );
}

export default Header;