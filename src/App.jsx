import './index.css'
  import { useState, useEffect } from 'react';

  import supabase from './supabaseClient';
  import CustomAuth from './pages/CustomAuth';
import Dashboard from './pages/Dashboard';

  export default function App() {
    const [session, setSession] = useState(null);

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
      })

      return () => subscription.unsubscribe()
    }, [])

    if (!session) {
      return (<CustomAuth />)
    } else {
      return (
        <Dashboard/>
      )
    }
  }