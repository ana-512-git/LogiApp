export default function ItemCard({item}) {
    const {
        name,
        observations,
        location,
        category,
        quantity,
        quantity_measurement,
        is_quantity_aproximation,
        image_url,
    } = item;

    return(
        <>
        <div style={{backgroundColor:'red'}}>
            this is: {name}
        </div>
        </>
    );
}