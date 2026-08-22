import { useState } from 'react';
import '../CreateObjectWizard/CreateObject.css';

export default function CreateTicketWizard({ item, onClose, onCreateTicket }) {
    const [text, setText] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!text.trim()) {
            setError('Please describe the issue');
            return;
        }
        setError('');
        onCreateTicket(text.trim());
    };

    return (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className='form-title'>
                <h3>Create new ticket for {item.name}</h3>
            </div>
            <div className='form-fields'>
            <form onSubmit={handleSubmit}>
                <div className='all-fields'>
                <div className='input-field'>
                    <label>Ticket text:</label>
                    <input
                        type='text'
                        placeholder='e.g. stoc insuficient / s-a pierdut unul'
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required>
                    </input>
                </div>
                </div>
                {error && <p className='err'>{error}</p>}
                <div className='action-btns'>
                    <button type='button' className='cancel-btn' onClick={onClose}>Cancel</button>
                    <button type='submit' className='next-btn'>Create</button>
                </div>
            </form>
            </div>
        </div>
    )
}