// App.jsx

// Importing the Routes and Route components from react-router to handle routing in the app
import { Routes, Route } from "react-router";

// Importing custom components used in the app
import AppBackground from "./startup_components/AppBackground";     // Sets up the background

import AuthLayout from "./startup_components/AuthLayout";                                   // Welcome or landing screen
import WelcomeScreen from "./startup_components/login_components/WelcomeScreen";  // Login/SignUp form component
import Login from "./startup_components/login_components/Login";            // Login form component
import SignUp from "./startup_components/login_components/Signup";          // Sign-up/registration form component

// import Home from "./app_components/FinalHome";                           // Main component shown after login (dashboard, etc.)
import Home from "./app_components/Home";                           // Main component shown after login (dashboard, etc.)
import Dashboard from "./app_components/home_components/content_components/Dashboard";
import SensorGraph from "./app_components/home_components/content_components/Analysis";
import Dataset from "./app_components/home_components/content_components/Dataset"
// import AccountPage from "./app_components/home_components/content_components/Account"
import AboutPage from "./app_components/home_components/content_components/About"
import LiveStreamPage from "./app_components/home_components/content_components/LiveStream"
import Logs from "./app_components/home_components/content_components/Logs"
import Control from "./app_components/home_components/content_components/Control"



// Main App component
function App() {
  return (
    <>
      {/* Rendering the AppBackground component to set the background visuals */}
      <Routes>
        <Route path="/" element={<AuthLayout />}>                          
          <Route path="/" element={<WelcomeScreen />} />  {/* Welcome screen route (root path) */}
          <Route path="/login" element={<Login />} />     {/* Login screen route */}
          <Route path="/signup" element={<SignUp />} />   {/* Sign Up screen route */}
        </Route>

        <Route path='/' element={<Home/>}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path='/analysis' element={<SensorGraph />}/>
          <Route path='/dataset' element={<Dataset />}/>
          <Route path='/control'element={<Control />}/>
          <Route path='/logs' element={<Logs />}/>
          {/* <Route path='/account' element={<AccountPage />}/> */}
          <Route path='/about' element={<AboutPage />}/>
          <Route path='/livestream' element={<LiveStreamPage />}/>
          <Route path='/logout'/> 
        </Route>

        {/* <Route path='/dashboard' element={<Home />}/>
        <Route path='/analysis' element={<Home />}/>
        <Route path='/dataset' element={<Home />}/>
        <Route path='/control' element={<Home />}/>
        <Route path='/logs' element={<Home />}/>
        <Route path='/account' element={<Home />}/>
        <Route path='/about' element={<Home />}/>
        <Route path='/livestream' element={<Home />}/>
        <Route path='/logout' element={<Home />}/> */}

      </Routes>

    </>
  )
}

// Exporting the App component as default
export default App;
