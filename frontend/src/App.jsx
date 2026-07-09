import { useEffect, useState } from 'react'
import './App.css'
import { useAppAnalytics } from './firebase/AnalyticsContext.jsx';
import { getToken } from 'firebase/messaging';
import { messaging } from './firebase/firebase';
import ComingSoon from './ComingSoon/comingsoon.jsx';

function App() {

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

  return (<><ComingSoon/></>);
}

export default App
