import './TicketCard.css';

export default function TicketCard({ticket}) {
    const creatorFullName = `${ticket.creator_first_name || ''} ${ticket.creator_last_name || ''}`.trim() || 'Unknown User';
    const formatTicketDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('ro-RO', {
            hour: '2-digit',
            minute: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour12: false,
            timeZone: 'Europe/Bucharest'
        }).format(date).replace(',', '');
    };

    return(
        <div className="ticket">
            <div className='info-header'>
                <div className='left-info'>
                    <p>{ticket.object_name}</p>
                </div>
                <div className='right-info'>
                    <p className='timestamp'>{formatTicketDate(ticket.timestamp)}</p>
                    <p>{creatorFullName}</p>
                </div>
            </div>
            <p>{ticket.text}</p>
            <div className='mark-done-div'>
                <button className='mark-done-btn'>Mark done</button>
            </div>
        </div>
    )
}