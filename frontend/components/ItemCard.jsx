import './ItemCard.css';

export default function ItemCard({item, role, onEdit, onCreateTicket}) {
    const {
        id,
        name,
        observations,
        source_url,
        category,
        stocks = []
    } = item;

    return(
        <>
        <div className="card">
            <div className='left-info'>
                <div className='text-info'>
                    <h3 className='obj-name'>{name}</h3>
                    { observations ? <p className='obs'>Obs: {observations}</p> : '' }
                </div>
                
                { source_url ? <a href={source_url}>Source link</a> : '' }
                <div className='category'>
                    <p className='category-p'>{category}</p>
                </div>
            </div>

            <div className='right-info'>
                { stocks.length == 0 ? <p>!No stock available</p> : 
                    (stocks.map((stk) => (
                        <div key={stk.id} className='stock-entry'>
                            { stk.quantity_measurement ? <p> {stk.quantity} x {stk.quantity_measurement} : {stk.location}</p> : <p>{stk.quantity} : {stk.location}</p>}
                            { stk.is_quantity_aproximation ? <div className='alert' title='This is an approximation, actual quantity may differ!'>!</div> : ''}
                        </div>
                    )))
                }
                <div className='actions'>
                    <button className='item-page-btn' onClick={() => onCreateTicket(item)}>Create ticket</button>
                    {role === 'admin' ? 
                        <button className='item-page-btn'
                            onClick={() => onEdit(item)}
                            >Edit
                        </button> : ''
                    }
                </div>
            </div>

        </div>
        </>
    );
}