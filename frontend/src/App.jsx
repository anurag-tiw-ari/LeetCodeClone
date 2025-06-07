import { Route,Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LogInPage from "./pages/LogInPage";
import SignUpPage from "./pages/SignUpPage";

function App()
{
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/login" element={<LogInPage/>}></Route>
        <Route path="/signup" element={<SignUpPage/>}></Route>
      </Routes>
    </>
  )
}

export default App;