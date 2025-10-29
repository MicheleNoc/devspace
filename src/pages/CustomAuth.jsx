import { useState } from "react";
import supabase from "../supabaseClient";

export default function CustomAuth() {
  const [mode, setMode] = useState("sign-in"); // 'sign-in' | 'sign-up'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (mode === "sign-in") {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setMessage("Accesso effettuato — verrai reindirizzato se necessario");
      } else {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        // For sign up we usually ask user to confirm email
        setMessage(
          "Registrazione inviata. Controlla la tua casella di posta per confermare."
        );
      }
    } catch (err) {
      setError(err.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center bg-blue-50 px-4 min-h-screen min-w-screen">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {mode === 'sign-in' ? 'Sign in' : 'Create account'}
        </h2>

        {error && <div className="mb-4 text-sm text-red-600">{error}</div>}
        {message && <div className="mb-4 text-sm text-green-600">{message}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center text-gray-700 text-lg font-semibold"> Welcome to DevSpace 🚀</div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-2"
              placeholder="••••••••"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 px-4 text-white rounded ${loading ? 'bg-green-100' : 'bg-green-600 hover:bg-blue-700'} disabled:opacity-60`}
            >
              {loading ? 'Processing...' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          {mode === 'sign-in' ? (
            <>
              Non hai un account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('sign-up'); setError(null); setMessage(null); }}>
                Registrati
              </button>
            </>
          ) : (
            <>
              Hai già un account?{' '}
              <button className="text-blue-600 hover:underline" onClick={() => { setMode('sign-in'); setError(null); setMessage(null); }}>
                Accedi
              </button>
            </>
          )}
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          {/* Optional: add links for privacy/terms etc */}
          By continuing you agree to our Terms.
        </div>
      </div>
    </div>
  )
}
