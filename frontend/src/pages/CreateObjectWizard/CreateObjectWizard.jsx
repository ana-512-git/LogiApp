import { use, useState } from 'react';
import Step1 from './Step1CreateObject';
import Step2 from './Step2CreateModal';

export default function CreateObjectWizard() {
    const [step2, setStep2] = useState(false);
    const [obj, setObj] = useState('');
    const [stock, setStock] = useState([]);

    const handleNextStep = (obj) => {
        setObj(obj);
        setStep2(true);
    }

    const handleCreateObject = async (stock) => {
        setStock(stock);
        createObject();
    }

    const createObject = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            setMessage("Authentication token missing, please log in first");
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/objects/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(obj, stock)
            }
            )

            const data = await response.json();

            if (!response.ok) {
                setMessage("Failed to create object");
                return;
            }
        } catch (err) {
            console.log("sth went wrong");
            setMessage("An error occured: ", err.message);
        }
    }

    return(
        <div>
            {step2 ? 
            <Step2 
                onComplete={handleCreateObject}
            /> : 
            <Step1
                onComplete={handleNextStep}
            />}
        </div>
    );
}