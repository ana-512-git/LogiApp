import './ItemCard.css';

export default function ItemCard({item}) {
    const {
        name,
        observations,
        location,
        category,
        quantity,
        quantity_measurement,
        is_quantity_aproximation,
    } = item;

    return(
        <>
        <div className="card">
            <div className='left-info'>
                <p className='obj-name'>{name}</p>
                { observations ? <p className='obs'>Obs: {observations}</p> : '' }
                <div className='category'>
                    <p className='category-p'>{category}</p>
                </div>
            </div>

            <div className='right-info'>
                { quantity_measurement ? <p> {quantity} x {quantity_measurement} : {location}</p> : <p>{quantity} : {location}</p>}
                { is_quantity_aproximation ? <p className='alert'>Approximation: Actual quantity may differ!</p> : ''}
            </div>

        </div>
        </>
    );
}