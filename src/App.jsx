import './index.css'
  import { useState, useEffect } from 'react';

  import supabase from './supabaseClient';
  import CustomAuth from './pages/CustomAuth';
  import Welcome from './pages/Welcome';

  export default function App() {
    const [session, setSession] = useState(null)
    const [authUser, setAuthUser] = useState(null) // supabase user object
    const [profileUsername, setProfileUsername] = useState(null)
    const [loadingProfile, setLoadingProfile] = useState(false)

    // fetch currently authenticated user on mount
    useEffect(() => {
      const fetchUserData = async () => {
        const { data: userData, error } = await supabase.auth.getUser()
        if (error) {
          console.error('Error fetching user data:', error)
          return
        }
        setAuthUser(userData?.user ?? null)
      }

      fetchUserData()
    }, [])

    useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
      })

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        // session may contain user info
        setAuthUser(session?.user ?? null)
      })

      return () => subscription.unsubscribe()
    }, [])

  // fetch profile username when session / authUser is available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!authUser) return
      setLoadingProfile(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', authUser.id)
        .maybeSingle()
      setLoadingProfile(false)
      if (error) {
        console.error('Error fetching profile username:', error)
        setProfileUsername(null)
        return
      }
      setProfileUsername(data?.username ?? null)
    }

    fetchProfile()
  }, [authUser])

  if (!session) {
    return <CustomAuth />
  }

  if (!authUser) {
    return <div className="p-8">Loading user...</div>
  }

  if (loadingProfile) {
    return <div className="p-8">Loading profile...</div>
  }

  // if no username in profiles -> show Welcome component (lets user set username)
  if (!profileUsername) {
    return <Welcome onProfileCreated={(u) => setProfileUsername(u)} />
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl mb-4">Welcome to DevSpace, {profileUsername}!</h1>
      <p className="mb-4">You are now logged in.</p>
      <button
        className="px-4 py-2 bg-red-500 text-white rounded"
        onClick={async () => {
          await supabase.auth.signOut()
          setSession(null)
        }}
      >
        Sign Out
      </button>
    </div>
  )
  }