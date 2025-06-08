import { useSelector,useDispatch } from "react-redux";
import { logoutUser } from "../authSlice.js";

function Header()
{
    const {user,isAuthenticated} = useSelector((state)=>state.auth)
    const dispatch = useDispatch();
    const handleLogOut = ()=>
        {
          
            if(isAuthenticated)
            dispatch(logoutUser())
          
        }

    return(
      <div className="navbar bg-base-100 shadow-xl fixed top-0 px-8 ">
        <div className="flex-1">
            <a className="btn btn-ghost text-xl">Coding Platform</a>
        </div>
        <div className="flex-none">
            <ul className="menu menu-horizontal px-1">
      <li>
                <details>
                <summary>{user?.firstName || "Profile"}</summary>
                <ul className="bg-base-100 rounded-t-none p-2 ">
                    <li>{/* The button to open modal */}
                    <label htmlFor="my_modal_6" className="btn">{isAuthenticated? "Log Out":"Sign Up"}</label>
                    </li>
                </ul>
                </details>
            </li>
            </ul>
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