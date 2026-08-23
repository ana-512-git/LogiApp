import CreateTicketWizard from "./CreateTicketWizard";
import { useState, useEffect } from "react";
import '../CreateObjectWizard/CreateObject.css';

export default function TicketCreator({item, onClose, onCreateTicket}) {
    const [step, setStep] = useState('create');

    const handleSubmit = async (text) => {
        if (!text.trim()) {
            console.log('Please describe the issue');
            return;
        }

        const success = await onCreateTicket(text.trim());
        if (success) {
            setStep('confirmation');
        }
    };

    useEffect(() => {
        if (step === 'confirmation') {
            const timer = setTimeout(() => {
                if (onClose) onClose();
            }, 2000);

               return () => clearTimeout(timer);
        }
    }, [step, onClose]);

    
    return(
        <>
            {step === 'create' &&
                <CreateTicketWizard
                    item={item}
                    onClose={onClose}
                    onCreateTicket={handleSubmit}
                />
            }

            {step === 'confirmation' &&
                <div className="modal-content">
                    <p>Ticket created successfully!</p>
                </div>
            }
        </>
    );
}