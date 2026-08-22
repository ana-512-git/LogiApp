import { useEffect, useState } from "react";
import UpdateObjectWizard from "./UpdateObjectWizard";

export default function UpdateDeleteObjectWizard({item, onClose, onRefresh}) {
    const [step, setStep] = useState('edit');
    const [message, setMessage] = useState('');

    const onDelete = () => {
        setStep('check');
    }

    useEffect(() => {
        if (step === 'confirmation') {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [step, onClose]);

    const handleDeleteObject = async () => {
        const token = localStorage.getItem('token');

            try {
                const response = await fetch (`http://localhost:5000/api/objects/${item.id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization' : `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.log('error happened: ', data.error);
                    return;
                }
                setMessage("Object deleted successfully!");
                setStep('confirmation');

                if (onRefresh) {
                    onRefresh();
                }
            } catch (err) {
                console.log('error happened: ', err);
            }
    }

    const handleUpdate = async (updatedObservations, updatedStocks) => {
        if (updatedStocks.length === 0) {
            console.log("Object stock cannot be null");
            return;
        }

        const payload = {
            observations: updatedObservations || null,
            stocks: updatedStocks
        };
        const token = localStorage.getItem('token');

        try {
            const response = await fetch (`http://localhost:5000/api/objects/${item.id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization' : `Bearer ${token}`
                    },
                    body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data.error);
                return;
            }

            setMessage("Object updated successfully!");
            setStep('confirmation');
            if (onRefresh) onRefresh();
        } catch (err) {
            console.error('Update error:', err);
        }
    }

    return (
        <div onClick={(e) => e.stopPropagation()}>
            {step === 'edit' && <UpdateObjectWizard
                item={item}
                onClose={onClose}
                onRefresh={onRefresh}
                onDelete={onDelete}
                onUpdate={handleUpdate}
            />}

            {step === 'check' && 
                <div className='modal-content'>
                        <p>Are you sure you want to delete {item.name}?</p>
                        <div className='action-btns'>
                            <button onClick={() => setStep('edit')}>Cancel</button>
                            <button className='next-btn' onClick={() => handleDeleteObject()}>Delete</button>
                        </div>
                    </div>
            }

            {step === 'confirmation' &&
                <div className="modal-content">
                    <p>{message}</p>
                </div>
            }
        </div>
    )
}