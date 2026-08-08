import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [status, setStatus] = useState('');

    const navigate = useNavigate();

    const handleLogin = async(e) => {
        e.preventDefault();

        // TODO: change this here, its hardcoded to localhost
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus(`Error: ${data.error}`);
            } else {
                localStorage.setItem('token', data.token);
                navigate('/dashboard'); 

                setStatus(`Success: ${data.message}`);
                setEmail('');
                setPassword('');
            }
        } catch (err) {
            console.log("shit went wrong:", err);
            setStatus('Cannot connect to backend server');
        }
    };

    return(
        <>
            <h1>Login</h1>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Login</button>
            </form>
            <br></br>
            No account? <Link to='/register'>Register here</Link>
            <p>{status}</p>
        </>
    )
}