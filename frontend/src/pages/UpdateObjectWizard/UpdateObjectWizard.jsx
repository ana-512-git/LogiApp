import '../CreateObjectWizard/CreateObject.css'
import { useState } from 'react';

export default function UpdateObjectWizard({ item, onClose, onRefresh }) {
    const [quantity, setQuantity] = useState('');
        const [q_measurement, setQMeasurement] = useState('buc');
        const [location, setLocation] = useState('EC 105');
        const [is_approx, setIsApprox] = useState(false);
        const [stock, setStock] = useState(item.stocks || []);
        const [error, setError] = useState('');
        const [observations, setObservations] = useState(item.observations || null);
        const [stockToRemove, setStockToRemove] = useState([]);
        const [stockToAdd, setStockToAdd] = useState([]);
    
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

        const onCancel = () => {
            return;
        }

        const removeFromStock = (stk) => {
            setStockToRemove([...stockToRemove, stk]);
            setStock(stock.filter(x => x.location !== stk.location));
        }
    
    return(
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className='form-title'>
                <h3>Edit {item.name}:</h3>
            </div>
            <form>
                <div className='all-fields'>
                <div className='input-field'>
                    <label>Observations:</label>
                    <input
                        type='text'
                        placeholder='e.g. lipseste o piesa'
                        value={observations}
                        onChange={(e) => setQuantity(e.target.value)}
                        required>
                    </input>
                </div>
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
                <div className='input-field cbx'>
                    <input
                        type='checkbox'
                        checked={is_approx}
                        onChange={(e) => setIsApprox(e.target.checked)}
                    ></input>
                    <label>This is an approximation</label>
                </div>
                <div className='input-field'>
                    <button type='button' onClick={() => addToStock()}>Add stock entry</button>
                </div>
                </div>
                <div className='stock'>
                    <p>Stock:</p>
                    <div className='stock-entries'>
                    {stock.length === 0 ? ' - nothing yet, please add stock info -' :
                        stock.map((stk, idx) => (
                            <div className='stock-entry' key={idx}>{stk.quantity} x {stk.q_measurement} : {stk.location} {stk.is_approx ? '!' : ''} <button onClick={() => removeFromStock(stk)}>x</button></div>
                        ))
                    }</div>
                </div>
            <div className='action-btns'>
                <button type='button' className='delete-btn'>Delete</button>

                <div className='non-delete-btns'>
                    <button type='button' className='cancel-btn' onClick={onCancel}>Cancel</button>
                    <button type='button' className='next-btn' onClick={() => handleFinalize()}>Finalize</button>
                </div>
            </div>
            </form>
            <p className='err'>{error}</p>
        </div>
    );
}