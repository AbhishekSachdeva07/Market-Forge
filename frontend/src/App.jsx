import { useEffect, useState } from 'react'
import './App.css'
import { useAppAnalytics } from './firebase/AnalyticsContext.jsx';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase/firebase';
import ComingSoon from './ComingSoon/ComingSoon.jsx';
import Dashboard from './dashboard/Dashboard.jsx';
import { Routes, Route } from "react-router-dom";
import SignInSide from './sign-in-side/SignInSide.jsx';
import MobileBlocked from './MobileBlocked/MobileBlocked.jsx';

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 992); // md/lg breakpoint
    };

    checkDevice();
    window.addEventListener("resize", checkDevice);

    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  const { logCustomEvent } = useAppAnalytics();

  useEffect(() => {
    const getFCMToken = async () => {
      try {
        const permission = await Notification.requestPermission();
        console.log("sucess")

        if (permission === 'granted') {

          const token = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FCM_CLIENT_TOKEN
          });

          console.log('FCM Token:', token);
        } else {
          console.log('Notification permission denied');
        }
      } catch (error) {
        console.error('FCM Error:', error);
      }
    };

    getFCMToken();
  }, []);

  const handleClick = () => {
    logCustomEvent('js_button_clicked', {
      interface_language: 'javascript',
      click_time: new Date().toLocaleTimeString()
    });
    alert('Logged successfully!');
  };

  console.log("isMobile",isMobile);
  if (isMobile) {
    return <MobileBlocked />;
  }

  return (
      <Routes>
        <Route path='/' element={<ComingSoon/>} />
        <Route path='/dashboard/:email' element={<Dashboard />} />
        <Route path='/signin' element={<SignInSide/>} />
      </Routes>
  );
}

export default App
