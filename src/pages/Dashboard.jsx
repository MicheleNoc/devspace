import React from 'react'
import supabase from '../supabaseClient'

export default function Dashboard() {
  return (  
    <div className="flex items-center justify-center bg-gray-50 px-4 min-h-screen min-w-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">Dashboard</h2>
        <div className="mb-4 text-sm text-gray-600">Welcome to your dashboard!</div>
        <div>
          <div className='text-green-500'>Logged in! </div>
          <div>
            <button type="button" className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded" onClick={() => supabase.auth.signOut()}>Sign Out</button>
          </div>
        </div>
      </div>
    </div>
    )
}