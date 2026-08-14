import { useState } from 'react';
import './Step2CreateModal.css';

export default function Step2CreateModal({ onComplete, onCancel }) {
    const [quantity, setQuantity] = useState('');
    const [q_measurement, setQMeasurement] = useState('buc');
    const [location, setLocation] = useState('EC 105');
    const [is_approx, setIsApprox] = useState(false);
    const [stock, setStock] = useState([]);
    const [error, setError] = useState('');

    const addToStock = () => {
        const stk = {quantity, q_measurement, location, is_approx};
        
        if (!quantity) {
            setError('Quantity cannot be null')
            return;
        }

        const existing_stk = stock.find(x => x.location === stk.location);
        if (existing_stk) {
            stk.quantity = Number(stk.quantity) + Number(existing_stk.quantity);
            setStock([...stock.filter(x => x.location !== stk.location), stk]);
        } else {
            setStock([...stock, stk]);
        }
        setQuantity('');
        setQMeasurement('buc');
        setLocation('EC 105');
        setIsApprox(false);
        setError('');
    }

    const removeFromStock = (stk) => {
        setStock(stock.filter(x => x.location !== stk.location));
    }

    const handleFinalize = () => {
        if (stock.length === 0) {
            setError('Cannot have objects with stock 0');
            return;
        }

        if (onComplete) {
            onComplete(stock);
        }
    }

    return (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Step 2/2: Create stock</h3>
            <div>Existing stock:
                {stock.length === 0 ? 'Nothing rn' :
                    stock.map((stk, idx) => (
                        <div key={idx}>{stk.quantity} x {stk.q_measurement} : {stk.location} {stk.is_approx ? '!' : ''} <button onClick={() => removeFromStock(stk)}>x</button></div>
                    ))
                }
            </div>
            <form>
                <div className='input-field'>
                    <label>Quantity:</label>
                    <input
                        type='number'
                        step='any'
                        placeholder='e.g. 7/ 1.5'
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        required>
                    </input>
                </div>
                <div className='input-field'>
                    <label>Quantity Measurement:</label>
                    <select value={q_measurement} onChange={(e) => setQMeasurement(e.target.value)} required>
                        <option value='buc'>buc</option>
                        <option value='cutie'>cutie</option>
                        <option value='bax'>bax</option>
                        <option value='sticla'>sticla</option>
                        <option value='set'>set</option>
                        <option value='punga'>punga</option>
                        <option value='litru'>litru</option>
                        <option value='gram'>gram</option>
                        <option value='top'>top</option>
                    </select>
                </div>
                <div className='input-field'>
                    <label>Location:</label>
                    <select value={location} onChange={(e) => setLocation(e.target.value)} required>
                        <option value='EC 105'>EC 105</option>
                        <option value='EC 004'>EC 004</option>
                        <option value='Precis'>Precis</option>
                        <option value='P16'>P16</option>
                    </select>
                </div>
                <div className='input-field'>
                    <input
                        type='checkbox'
                        checked={is_approx}
                        onChange={(e) => setIsApprox(e.target.checked)}
                    ></input>
                    <label>This is an approximation</label>
                </div>
                <button type='button' onClick={() => addToStock()}>Add entry</button>
                <button type='button' onClick={() => handleFinalize()}>Finalize</button>
            </form>
            <p>{error}</p>
        </div>
    );
}