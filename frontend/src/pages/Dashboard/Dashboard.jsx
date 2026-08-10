import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ItemCard from '../../../components/ItemCard';
import './Dashboard.css'

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [role, setRole] = useState(null);
    const [name, setName] = useState();
    const [status, setStatus] = useState();
    const [token, setToken] = useState();
    const navigate = useNavigate();
    const [categories, setCategories] = useState(['Bar', 'Bucatarie', 'Curatenie', 'Birotica', 'Papetarie', 'Boardgames', 'Diverse']);
    const [selectedCategories, setSelectedCategories] = useState([]);

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

    const handleSelectedCategory = (ctg) => {
        if (selectedCategories.includes(ctg)) {
            setCategories([...categories, ctg]);
            setSelectedCategories(selectedCategories.filter(x => x !== ctg));
        } else {
            setCategories(categories.filter(x => x !== ctg));
            setSelectedCategories([...selectedCategories, ctg]);
        }
    }

    useEffect(() => {
        const crtToken = extractToken();
        if (!crtToken) return;

        try {
            const payloadBase64 = crtToken.split('.')[1];
            const decodedPayload = JSON.parse(atob(payloadBase64));

            setRole(decodedPayload.role);
            setName(decodedPayload.first_name);
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
        <div className='dashboard-bg'>
            <div className='hdr'>
                <div className='left-hdr'>
                    <h1>Hi {name},</h1>
                    {role == 'staff' && <p>Wecome back!</p>}
                    {role == 'admin' && 
                        <p>Welcome back to your protected dash!</p>
                    }
                </div>
                <button className='profile-btn' onClick={handleLogout}>Logout</button>
            </div>
            <div className='pannel'>
                <div className='search-section'>
                    <div className='search-params'>
                        <h3>Search for item:</h3>
                        <form>
                            <input 
                                type='text' 
                                placeholder='Search for object by name'>
                            </input>
                            <div className='category-selection'>
                                <p>Category:</p>
                                <div className='selected-buttons'>
                                    {selectedCategories.map((ctg) => (
                                        <button className='category-btn selected' 
                                            type="button"
                                            onClick={() => handleSelectedCategory(ctg)}
                                            key={ctg}>
                                                {ctg}
                                            </button>))}
                                </div>
                                <div className='selection-buttons'>
                                    {categories.map((ctg) => (
                                        <button className='category-btn' 
                                            type="button" 
                                            onClick={() => handleSelectedCategory(ctg)} 
                                            key={ctg}>
                                                {ctg}
                                        </button>))}
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className='results'>
                        <h3>Results:</h3>
                        <div className='search-results'>
                            {items.map((item) => (
                            <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                    {/* <button onClick={getAllItems}>reload items</button> */}
                </div>
                <div className='side-pannel'></div>
            </div>
        </div>
    );
}