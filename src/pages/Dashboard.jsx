import Layout from '../components/Layout'

export default function Dashboard({ profileUsername, setSession }) {
  return (
    <Layout profileUsername={profileUsername} onLogout={() => setSession(null)}>
      {/* Contenuto vuoto - mostra solo layout con sidebar e navbar */}
    </Layout>
  )
}   