import '../CreateObjectWizard/CreateObject.css'
import { useState } from 'react';

export default function UpdateObjectWizard({ item, onClose, onRefresh, onDelete, onUpdate }) {
    const [quantity, setQuantity] = useState('');
        const [q_measurement, setQMeasurement] = useState('buc');
        const [location, setLocation] = useState('EC 105');
        const [is_approx, setIsApprox] = useState(false);
        const [stock, setStock] = useState(item.stocks || []);
        const [error, setError] = useState('');
        const [observations, setObservations] = useState(item.observations || null);
    
        const addToStock = () => {
            const stk = {quantity, q_measurement, location, is_approx};
            
            if (!quantity) {
                setError('Quantity cannot be null')
                return;
            }
    
            const existing_stk = stock.find(x => x.location === stk.location);
            if (existing_stk) {
                const existing_measurement = existing_stk.quantity_measurement || existing_stk.q_measurement;
                const existing_approx = existing_stk.is_quantity_aproximation ?? existing_stk.is_approx ?? false; 
                if (stk.q_measurement !== existing_measurement) {
                    setError('Quantity measurement must be the same at an existing location!');
                    return;
                }
                stk.quantity = Number(stk.quantity) + Number(existing_stk.quantity);
                stk.is_approx = existing_approx || stk.is_approx;
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
                setError('Object stock cannot be empty');
                return;
            }
            if (onUpdate) {
                onUpdate(observations, stock);
            }
        };
    
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
                        onChange={(e) => setObservations(e.target.value)}
                        >
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
                        >
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
                        stock.map((stk, idx) => {
                            const measurement = stk.q_measurement || stk.quantity_measurement || '';
                            const isApprox = stk.is_approx ?? stk.is_quantity_aproximation ?? false;
                            return (<div className='stock-entry' key={idx}>{stk.quantity} x {measurement} : {stk.location} {isApprox? '!' : ''} <button type="button" onClick={() => removeFromStock(stk)}>x</button></div>);
})
                    }</div>
                </div>
            <div className='action-btns'>
                <button type='button' className='delete-btn' onClick={onDelete}>Delete</button>

                <div className='non-delete-btns'>
                    <button type='button' className='cancel-btn' onClick={onClose}>Cancel</button>
                    <button type='button' className='next-btn' onClick={handleFinalize}>Finalize</button>
                </div>
            </div>
            </form>
            <p className='err'>{error}</p>
        </div>
    );
}