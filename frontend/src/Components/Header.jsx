import { useSelector,useDispatch } from "react-redux";
import { logoutUser } from "../authSlice.js";
import { useNavigate } from "react-router";
import { Link } from "react-router";

function Header()
{
    const {user,isAuthenticated} = useSelector((state)=>state.auth)
    console.log("user:",user)
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogOut = ()=>
        {
          
            if(isAuthenticated)
            dispatch(logoutUser())
          
        }
    const handleSignUp = ()=>{

        if(!isAuthenticated)
        {
            navigate("/signup")
        }
    }

    return(
      <div className="navbar bg-base-100 shadow-xl fixed top-0 px-8 z-5 ">
        <div className="flex-1">
            <a className="btn btn-primary btn-sm lg:text-xl text-xs ">Coding Platform</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
                { 
                isAuthenticated && user?.role=='admin' ? 
                 <li><Link to="/admin" className="btn mr-2">Admin Dashboard</Link></li> : null
                }
      <li>
                <details>
                <summary className="btn btn-soft">{user?.firstName || "Profile"}</summary>
                <ul className="bg-base-100 rounded-t-none p-2 ">
                    <li>{/* The button to open modal */}
                    <label htmlFor="my_modal_6" className="btn btn-soft " onClick={handleSignUp}>{isAuthenticated? "Log Out":"Sign Up"}</label>
                    </li>
                </ul>
                </details>
            </li>
            </ul>
        </div>
         <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
        <div className="w-10 rounded-full">
          <img
            alt="Tailwind CSS Navbar component"
            src={ user?.image ? user.image : "https://th.bing.com/th/id/OIP.-OwdeGjbVmQWf62Ynk9_8AHaHa?r=0&w=720&h=720&rs=1&pid=ImgDetMain"} />
        </div>
      </div>
                            {   isAuthenticated ? <>
                        <input type="checkbox" id="my_modal_6" className="modal-toggle" />
                        <div className="modal top-0 left-0 fixed justify-center items-center h-screen w-screen" role="dialog">
                        <div className="modal-box">
                            <p className="py-4 text-2xl text-center">Are you sure you want to logout?</p>
                            <div className="modal-action flex justify-evenly">
                                <label htmlFor="my_modal_6" className="btn btn-primary">NO</label>
                            <label onClick={handleLogOut} className="btn btn-md btn-soft">Log Out</label>
                            </div>
                        </div>
                        </div> </>: null
                    }
        </div>
    )
}

export default Header;