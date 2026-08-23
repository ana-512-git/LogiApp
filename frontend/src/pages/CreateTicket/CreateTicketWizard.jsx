import { useState } from 'react';
import '../CreateObjectWizard/CreateObject.css';

export default function CreateTicketWizard({ item, onClose, onCreateTicket }) {
    const [text, setText] = useState('');

    const handleCreateTicket = (e) => {
        e.preventDefault();
        if (onCreateTicket) {
            onCreateTicket(text);
        }
    };

    return (
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className='form-title'>
                <h3>Create new ticket for {item.name}</h3>
            </div>
            <div className='form-fields'>
            <form onSubmit={handleCreateTicket}>
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
                <div className='action-btns'>
                    <button type='button' className='cancel-btn' onClick={onClose}>Cancel</button>
                    <button type='submit' className='next-btn'>Create</button>
                </div>
            </form>
            </div>
        </div>
    )
}