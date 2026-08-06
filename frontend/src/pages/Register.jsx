import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [status, setStatus] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: change this here, its hardcoded to localhost
        try {
            const response = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({firstName, lastName, email, password,}),
            });

            const data = await response.json();

            if (!response.ok) {
                setStatus(`Error: ${data.error}`);
            } else {
                setFirstName('');
                setLastName('');
                setEmail('');
                setPassword('');
                
                localStorage.setItem('token', data.token);
                navigate('/dashboard');
            }
        } catch (err) {
            console.log("shit went wrong:", err);
            setStatus('Cannot connect to backend server');
        }
    }

    return(
        <>
        <h1>Register</h1>
            <div>
                <label>first name: </label>
                <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="first name" 
                />
            </div>
            <div>
                <label>last name: </label>
                <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="last name" 
                />
            </div>
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
            <button onClick={handleSubmit}>Create account</button>
            <p>{status}</p>
            <p>Already have an account?<Link to='/login'>Login</Link></p>
        </>
    )
}