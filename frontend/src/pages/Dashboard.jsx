import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ItemCard from '../../components/ItemCard';

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [role, setRole] = useState(null);
    const [status, setStatus] = useState();
    const [token, setToken] = useState();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const extractToken = () => {
        const tk =  localStorage.getItem('token');
        if (!tk) {
            navigate('/login');
            return null;
        }
        return tk;
    }

    useEffect(() => {
        const crtToken = extractToken();
        if (!crtToken) return;

        try {
            const payloadBase64 = crtToken.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            setRole(decodedPayload.role);
        } catch (err) {
            console.error('Invalid token format');
            localStorage.removeItem('token');
            navigate('/login');
        }

        getAllItems(crtToken);
    }, [navigate]);

    // TODO: also hardcoded to localhost
    const getAllItems = async (tk) => {
        const authTk = tk || extractToken();
        if (!authTk) return;
        try {
            const response = await fetch('http://localhost:5000/api/objects', {
                headers: {
                    Authorization: `Bearer ${authTk}`,
                },
            });

            const data = await response.json();
            
            if (!response.ok) {
                setStatus('error: ', data.error);
                return;
            }

            setItems(data);

        } catch(err) {
            console.error('Error loading inventory:', err);
            setStatus('Could not load inventory items.');
        }
    }

    return(
        <>
            <p>Good job! U successfully authenticated!</p>
            {role == 'admin' && 
                <p>Welcome to your protected dash</p>
            }
            <button onClick={handleLogout}>Logout</button><br></br><br></br>
            <input type='text' placeholder='Search for object by name'></input>
            <h2>Items, total {items.length}</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
                {items.map((item) => (
                <ItemCard key={item.id} item={item} />
                ))}
            </div>
            <button onClick={getAllItems}>reload items</button>
        </>
    );
}