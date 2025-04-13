// App.jsx

// Importing the Routes and Route components from react-router to handle routing in the app
import { Routes, Route } from "react-router";

// Importing custom components used in the app
  // Importing components for user authentication
    import AuthLayout from "./app_components/startup_components/AuthLayout";                         // Serves as the base for the Welcome Screen
    import WelcomeScreen from "./app_components/startup_components/login_components/WelcomeScreen";  // Choose between Login or SignUp
    import Login from "./app_components/startup_components/login_components/Login";                  // Login form component
    import SignUp from "./app_components/startup_components/login_components/Signup";                // Sign-up/registration form component

  // Importing components for the project content such as environmental parameter monitoring, prediction, and control.
    import Home from "./app_components/home_components/Home";                           // Main component shown after login (dashboard, etc.)
    import Dashboard from "./app_components/home_components/content_components/Dashboard/Dashboard";
    import SensorGraph from "./app_components/home_components/content_components/Data Analytics/Analytics";
    import Dataset from "./app_components/home_components/content_components/Data/Dataset";
    import AboutPage from "./app_components/home_components/content_components/About/About";
    import LiveStreamPage from "./app_components/home_components/content_components/LiveStream/LiveStream";
    import Logs from "./app_components/home_components/content_components/Sensor_Logs/SensorLogs";
    import Control from "./app_components/home_components/content_components/Env Parameter Control/Control";

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
