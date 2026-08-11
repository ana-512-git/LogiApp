import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import ItemCard from '../../../components/ItemCard';
import './Dashboard.css'

export default function Dashboard() {
    const [items, setItems] = useState([]);
    const [role, setRole] = useState(null);
    const [name, setName] = useState();
    const navigate = useNavigate();
    const [categories, setCategories] = useState(['Bar', 'Bucatarie', 'Curatenie', 'Birotica', 'Papetarie', 'Boardgames', 'Diverse']);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [locations, setLocations] = useState(['EC 105', 'EC 004', 'Precis', 'P16']);
    const [selectedLocations, setSelectedLocations] = useState([]);


    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    }

    const extractToken = () => {
        const tk = localStorage.getItem('token');
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

    const handleSelectedLocation = (loc) => {
        if (selectedLocations.includes(loc)) {
            setLocations([...locations, loc]);
            setSelectedLocations(selectedLocations.filter(x => x !== loc));
        } else {
            setLocations(locations.filter(x => x !== loc));
            setSelectedLocations([...selectedLocations, loc]);
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
                console.log('error: ', data.error);
                return;
            }

            setItems(data);

        } catch (err) {
            console.error('Error loading inventory:', err);
        }
    }

    const normalizeText = (text) => {
        if (!text) return '';
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const filteredItems = items.filter(x => {
        const matchesName = x.name.toLowerCase().includes(normalizeText(searchQuery));
        const matchesObs = x.observations && x.observations.toLowerCase().includes(normalizeText(searchQuery));
        const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(x.category);
        const matchesLocation = () => {
            if (selectedLocations.length === 0) return true;
            if (!x.stocks) return false;

            for (const s of x.stocks) {
                if (selectedLocations.includes(s.location)) {
                    return true;
                }
            }
            return false;
        }

        return (matchesName || matchesObs) && matchesCategory && matchesLocation();
    });

    return (
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
                        <form onSubmit={(e) => e.preventDefault()}>
                            <input
                                type='text'
                                placeholder='Search for object by name'
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}>
                            </input>
                            <div className='selectors'>
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

                                <div className='category-selection'>
                                    <p>Location:</p>
                                    <div className='selected-buttons'>
                                        {selectedLocations.map((loc) => (
                                            <button className='category-btn selected'
                                                type="button"
                                                onClick={() => handleSelectedLocation(loc)}
                                                key={loc}>
                                                {loc}
                                            </button>))}
                                    </div>
                                    <div className='selection-buttons'>
                                        {locations.map((loc) => (
                                            <button className='category-btn'
                                                type="button"
                                                onClick={() => handleSelectedLocation(loc)}
                                                key={loc}>
                                                {loc}
                                            </button>))}
                                    </div>
                                </div>
                            </div>


                        </form>
                    </div>
                    <div className='results'>
                        <h3>Results ({filteredItems.length}):</h3>
                        <div className='search-results'>
                            {filteredItems.map((item) => (
                                <ItemCard key={item.id} item={item} />
                            ))}
                        </div>
                    </div>
                </div>
                <div className='side-pannel'></div>
            </div>
        </div>
    );
}