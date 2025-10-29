import {useEffect, useState} from 'react'
import supabase from '../supabaseClient'

export default function Welcome({ onProfileCreated }) { 
  const [username, setUsername] = useState('');
  const [profileExists, setProfileExists] = useState(null) // null=loading, false=no profile, true=has profile
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      // Get the currently authenticated user
        const { data: userData, error: userError } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error getting user:', userError)
          return
        }

        const user = userData?.user
        if (!user) {
          console.log('No authenticated user')
          return
        }

        // Use the user id to fetch profile
        const { data, error } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle()

        if (error) {
          console.error('Error fetching profile:', error)
          return
        }

        if (!data) {
            console.log('No profile data found')
            setProfileExists(false)
            setIsEditing(true)
        } else {
          setUsername(data.username)
          setProfileExists(true)
          setIsEditing(false)
        }

        console.log('User ID:', user.id)
      }

      fetchProfile()
    }, [])

    const insertUsername = async (newUsername) => {
      const { data: userData } = await supabase.auth.getUser()
      const user = userData?.user
      if (!user) {
        console.log('No authenticated user')
        return
      }

      try {
        // Use upsert to create or update the profile row for this user
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, username: newUsername }, { onConflict: 'id' })

        if (error) {
          console.error('Error upserting username:', error)
          return
        }

  setUsername(newUsername)
  setProfileExists(true)
  setIsEditing(false)
  if (typeof onProfileCreated === 'function') onProfileCreated(newUsername)
      } catch (err) {
        console.error('Unexpected error upserting username:', err)
      }
    }
  return (
    <div className="flex items-center justify-center bg-gray-50 px-4 min-h-screen min-w-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
        <div className="mb-4 text-sm text-gray-600">Welcome to your dashboard!</div>
        <div>
          <div className='text-green-500'>Logged in! Welcome 
            {profileExists === true && username ? (
              <span> {username}</span>
            ) : (profileExists === false || isEditing) ? (
              <>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setIsEditing(true)}
                  placeholder="Enter your username"
                  className="border border-gray-300 p-2 rounded"
                />
                <button type="button" className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded" onClick={() => insertUsername(username)} disabled={!username.trim()}>Set Username</button>
              </>
            ) : (
              <span className="text-gray-400">Loading...</span>
            )}
          </div>
          <div>
            <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
    )
}