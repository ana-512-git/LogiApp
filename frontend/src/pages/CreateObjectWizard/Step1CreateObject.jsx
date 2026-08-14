import { useState } from 'react';
import './CreateObject.css';

export default function Step1CreateObject({ onComplete, onCancel }) {
    const [name, setName] = useState('');
    const [observations, setObservations] = useState('');
    const [source_url, setSourceURL] = useState('');
    const [category, setCategory] = useState('Bar');
    const [message, setMessage] = useState('');

    const handleNextStep = () => {
        if (!name || !category) {
            setMessage("Name is a required field!");
            return;
        }
        
        const obj = {
            name,
            observations,
            source_url,
            category
        }

        if (onComplete) {
            onComplete(obj);
        }
    }

    return (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className='form-title'>
                <h3>Step 1/2: Define object</h3>
            </div>
            <div className='form-fields'>
            <form onSubmit={handleNextStep}>
                <div className='all-fields'>
                <div className='input-field'>
                    <label>Object name:</label>
                    <input
                        type='text'
                        placeholder='e.g. Cola 2L / Prelungitor 3m'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required>
                    </input>
                </div>
                <div className='input-field'>
                    <label>Observations: </label>
                    <input
                        type="text"
                        value={observations}
                        onChange={(e) => setObservations(e.target.value)}
                        placeholder="e.g. 3 albe, 2 rosii / lipseste o piesa "
                    />
                </div>
                <div className='input-field'>
                    <label>Source: </label>
                    <input
                        type="text"
                        value={source_url}
                        onChange={(e) => setSourceURL(e.target.value)}
                        placeholder="e.g. https://example.com "
                    />
                </div>
                <div className='input-field'>
                    <label>Category: </label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} required>
                        <option value="Bar">Bar</option>
                        <option value="Bucatarie">Bucatarie</option>
                        <option value="Curatenie">Curatenie</option>
                        <option value="Birotica">Birotica</option>
                        <option value="Papetarie">Papetarie</option>
                        <option value="Boardgames">Boardgames</option>
                        <option value="Diverse">Diverse</option>
                    </select>
                </div>
                </div>
                <div className='action-btns'>
                    <button type='button' className='cancel-btn' onClick={onCancel}>Cancel</button>
                    <button type='submit' className='next-btn' onClick={() => handleNextStep()}>Next</button>
                </div>
            </form>
            </div>
            {message ? <p className='err'>{message}</p> : ''}
        </div>
    )
}