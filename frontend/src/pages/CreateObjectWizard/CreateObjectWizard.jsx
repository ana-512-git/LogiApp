import { useEffect, useState } from 'react';
import Step1 from './Step1CreateObject';
import Step2 from './Step2CreateObject';

export default function CreateObjectWizard({ onClose, onRefresh}) {
    const [step, setStep] = useState(1);
    const [obj, setObj] = useState('');
    const [stock, setStock] = useState([]);
    const [message, setMessage] = useState('');

    const handleNextStep = (obj) => {
        setObj(obj);
        setStep(2);
    }

    useEffect(() => {
        if (step === 3) {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [step, onClose]);

    const handleCreateObject = async (stock) => {
        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authentication token missing, please log in first");
            return;
        }

        const payload = {
            name: obj.name,
            observations: obj.observations || null,
            source_url: obj.source_url || null,
            category: obj.category,
            stocks: stock
        }

        try {
            const response = await fetch('http://localhost:5000/api/objects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            }
            )

            const data = await response.json();

            if (!response.ok) {
                console.log("Failed to create object");
                setMessage("Object creation failed, pls try again")
                return;
            }

            setMessage("Object created successfully!");
            if (onRefresh) onRefresh();
            setStep(3);
        } catch (err) {
            console.log("sth went wrong");
        }
    }

    return(
        <div>
            {step === 1 && 
            <Step1
                onComplete={handleNextStep}
                onCancel = {onClose}
            />}
            {step === 2 && 
            <Step2
                onComplete={handleCreateObject}
                onCancel={onClose}
            />}

            {step === 3 && 
                <div className='modal-content'>
                    <p>{message}</p>
                </div>
            }
        </div>
    );
}