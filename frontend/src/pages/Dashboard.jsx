import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const [role, setRole] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }

        try {
            const payloadBase64 = token.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            setRole(decodedPayload.role);
        } catch (err) {
            console.error('Invalid token format');
            localStorage.removeItem('token');
            navigate('/login');
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.setItem('token', null);
        navigate('/login');
    }

    return(
        <>
            <p>Good job! U successfully authenticated!</p>
            {role == 'admin' && 
                <p>Welcome to your protected dash</p>
            }
            <button onClick={handleLogout}>Logout</button><br></br><br></br>
            <input type='text' placeholder='Search for object by name'></input>
        </>
    );
}