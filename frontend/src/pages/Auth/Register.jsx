import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Form.css';
import open_eye from '../../../media/open_eye.png';
import closed_eye from '../../../media/closed_eye.png';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [status, setStatus] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [toggleImg, setToggleImg] = useState(closed_eye);
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

    const toggleShowPass = () => {
            setShowPass(!showPass);
            if (showPass)
                setToggleImg(closed_eye);
            else
                setToggleImg(open_eye);
    }

    return(
        <>
        <div className='form'>
            <div className='form-title'>
                <h1>Register</h1>
            </div>
            <div className='form-fields'>
                <form onSubmit={handleSubmit}>
                    <div className='form-inputs'>
                        <div className='input-field'>
                            <label>First name: </label>
                            <input 
                            type="text" 
                            value={firstName} 
                            onChange={(e) => setFirstName(e.target.value)} 
                            placeholder="Jane" 
                            />
                        </div>
                        <div className='input-field'>
                            <label>Last name: </label>
                            <input 
                            type="text" 
                            value={lastName} 
                            onChange={(e) => setLastName(e.target.value)} 
                            placeholder="Doe" 
                            />
                        </div>
                        <div className='input-field'>
                            <label>Email: </label>
                            <input 
                            type="text" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="example@gmail.com" 
                            />
                        </div>
                        <div className='input-field'>
                            <div className='password-field'>
                                <label>Password: </label>
                                <div className='password-input'>
                                    <input 
                                    type={showPass ? "text" : "password"} 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    placeholder="********" 
                                    />
                                    <button type="button" className='toggle' onClick={toggleShowPass}>
                                        <img src={toggleImg}></img>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='input-field'>
                            <button type='submit'>Create account</button>
                        </div>
                        <p>Already have an account?<Link to='/login'>Login</Link></p>
                    </div>
                </form>
            </div>
            <div className='form-final'>
                <p className='error'>{status}</p>
            </div>
        </div>
        </>
    )
}