import './index.css'
  import { useState, useEffect } from 'react';

  import supabase from './supabaseClient';
  import CustomAuth from './CustomAuth';

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
        <div>
          <div className='text-green-500'>Logged in!</div>
          <div>
            <button className="btn btn-primary" onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
      )
    }
  }