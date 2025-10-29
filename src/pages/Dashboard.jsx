import supabase from '../supabaseClient'

export default function Dashboard({ profileUsername, setSession }) {
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