import { useState } from 'react';
import './CreateModal.css';

export default function CreateModal() {
    const [name, setName] = useState('');
    const [observations, setObservations] = useState('');
    const [source_url, setSrcUrl] = useState('');
    const [category, setCategory] = useState();
    const [stock, setStock] = useState([]);

    const [quantity, setQuantity] = useState();
    const [quantity_measurement, setQuantityMeasurement] = useState('');
    const [is_quantity_aproximation, setIsQuantityApproximation] = useState(false);
    const [location, setLocation] = useState('');

    const addStock = () => {
        const stock_entry = {
            quantity,
            quantity_measurement,
            is_quantity_aproximation,
            location
        }

        // check if there is already
    }

    return (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create new item:</h2>
            <form>
                <div className='input-field'>
                    <label>Object name: </label>
                    <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="e.g. Prelungitor 2m " 
                    />
                </div>
                <div className='input-field'>
                    <label>Observations: </label>
                    <input 
                    type="text" 
                    value={observations} 
                    onChange={(e) => setObservations(e.target.value)} 
                    placeholder="e.g. 3 albe, 2 rosii " 
                    />
                </div>
                <div className='input-field'>
                    <label>Source: </label>
                    <input 
                    type="text" 
                    value={source_url} 
                    onChange={(e) => setSrcUrl(e.target.value)} 
                    placeholder="e.g. https://example.com " 
                    />
                </div>
                <div className='input-field'>
                    <label for="category">Choose a category:</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="" disabled selected>-- Select an option --</option>
                        <option value="Bar">Bar</option>
                        <option value="Bucatarie">Bucatarie</option>
                        <option value="Curatenie">Curatenie</option>
                        <option value="Birotica">Birotica</option>
                        <option value="Papetarie">Papetarie</option>
                        <option value="Boardgames">Boardgames</option>
                        <option value="Diverse">Diverse</option>
                    </select>
                </div>
                <div className='input-field'>
                    <label>Stock:</label>
                    <div className='inner-form'>
                        <form>
                            <div className='input-field'>
                                <label>Quantity:</label>
                                <input
                                    type="number"
                                    placeholder="e.g. 4">
                                </input>
                            </div>
                            <div className='input-field'>
                                <label>Quantity Measurement:</label>
                                <input
                                    type="text"
                                    placeholder="e.g. buc / topuri / cutii / baxuri">
                                </input>
                            </div>
                            <div className='input-field'>
                                <label for="location">Location:</label>
                                <select>
                                    <option value="" disabled selected>-- Select an option --</option>
                                    <option value="EC 105">EC 105</option>
                                    <option value="EC 004">EC 004</option>
                                    <option value="Precis">Precis</option>
                                    <option value="P16">P16</option>
                                </select>
                            </div>
                            <div className='input-field'>
                                <input
                                    type="radio"
                                    value="false">
                                </input>
                                <label>This is the exact quantity</label>

                                <input
                                    type="radio"
                                    value="true">
                                </input>
                                <label>This is an approximation</label>
                            </div>
                        </form>
                    </div>
                    <button>Add stock entry</button>
                </div>
            </form>
                            
            <button onClick={() => setIsModalOpen(false)}>
                Cancel
            </button>
            <button>
                Confirm
            </button>
        </div>
    )
}