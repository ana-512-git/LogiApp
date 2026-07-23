import { useState } from 'react';

export default function App() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    const testBackend = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/health');
      const data = await res.json();
      setStatus(`DB Connected! User count: ${data.userCount} | Input email was: ${email}`);
    } catch (err) {
      setStatus('Backend dead or offline!');
    }
  };

    return(
        <>
            <h1>Login</h1>
            <div>
                <label>email: </label>
                <input 
                type="text" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="email" 
                />
            </div>
            <div>
                <label>password: </label>
                <input 
                type="text" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="password" 
                />
            </div>
            <button onClick={testBackend}>test</button>
            <h3>Status output:</h3>
            <p style={{ color: 'red' }}>{status}</p>
        </>
    )
}