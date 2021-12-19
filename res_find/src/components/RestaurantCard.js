import React, { useState } from 'react';
import { Card, CardImg, CardBody, CardText, CardHeader, Button } from 'reactstrap';
import img from '../resources/restaurant.jpg';
import axios from 'axios';
function RenderRestaurantItem({name, handleClick, restaurant, onRestaurantClick }) {
    const [radius, setradius] = useState(1)
    // const name='Sanju'
    const personlike = (name,id)=> {
        async function fetchData() {
            try {
                const results = await (
                    await axios.post(`http://localhost:5000/personresrelation/${name}/${id}`)).data;
                // setfriends(results)
                // for (let i = 0; i < results.length; i++) {
                //     results[i]._fields.map(field => {
                //         resrec.push(field)
                //     })
                // }
                console.log(results)
                
        

            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
    }
    return (

        <Card key={restaurant.res_id} id="card">
            <CardHeader tag="h3" id="cardh">{restaurant.name}</CardHeader>
            <CardBody style={{ textAlign: "center" }} id='cardb'>
                <CardImg style={{ width: "100%", height: "200px" }} src={img} alt={restaurant.name} />

                <CardText>{restaurant.address}</CardText>
                <table>
                    <tbody>
                        <tr>
                            <td>Lat-Long</td>
                            <td>{restaurant.latitude.toPrecision(4)} &deg;N {restaurant.longitude.toPrecision(4)} &deg;E</td>
                        </tr>
                        <tr>
                            <td>Type</td>
                            <td>{restaurant.establishment}</td>
                        </tr>
                        <tr>
                            <td>City</td>
                            <td>{restaurant.city}</td>
                        </tr>
                        <tr>
                            <td>Open Time</td>
                            <td><i>{parseInt(restaurant.open_time.slice(0, 2))}</i>
                                {parseInt(restaurant.open_time.slice(0, 2)) === 12 ? <i> Pm</i> : <i> Am</i>}
                            </td>
                        </tr>
                        <tr>
                            <td>Close Time</td>
                            <td>
                                {parseInt(restaurant.close_time.slice(0, 2)) - 12 === -12 ? <i>12 Am</i> : <i>{parseInt(restaurant.close_time.slice(0, 2)) - 12} Pm</i>}
                            </td>
                        </tr>
                        <tr>
                            <td>Rating</td>
                            <td>{restaurant.aggregate_rating}</td>
                        </tr>
                        <tr>
                            <td>Cost for two</td>
                            <td>{restaurant.average_cost_for_two}</td>
                        </tr>
                        <tr>
                            <td>Cuisines</td>
                            <td>{restaurant.cuisines}</td>
                        </tr>
                        <tr>
                            <td>Highlights</td>
                            <td>{restaurant.highlights.slice(1, -1)}</td>
                        </tr>
                    </tbody>
                </table>
                <input
                style={{width:"100%", textAlign:"center",fontSize:"14px"}}
                    type="text"
                    placeholder="Radius"
                    value={radius}
                    name="radius"
                    onChange={(e) => setradius(e.target.value)}
                />
                <button className='button' style={{width:"100%", height:"30px", borderRadius:"0px", borderTop:"1px solid black"}} onClick={() => handleClick(parseInt(restaurant.res_id), radius, restaurant.latitude, restaurant.longitude)}>Click</button>
            </CardBody>
            <button
            className='button'
                onClick={() => {
                    onRestaurantClick(restaurant.latitude, restaurant.longitude, restaurant.name);
                }}
                style={{ width: "100%", backgroundColor: "lightcoral" , height:"30px",borderRadius:"0px", borderTop:"1px solid black"}}
            >Locate</button>
            <button
            className='button'
                onClick={() => personlike(name,restaurant.res_id)}
                style={{ width: "100%", backgroundColor: "red" , height:"30px", borderRadius:"0px", borderTop:"1px solid black"}}
            >Like</button>
        </Card>
    );
}
const Restaurants = ({ name, restaurants, onRestaurantClick, handleClick }) => {
    const [query, setQuery] = useState("")
    const restaurantslist = restaurants.filter(restaurant => {
        if (query === '') {
            return restaurant;
        } else if (restaurant.name.toLowerCase().includes(query.toLowerCase())) {
            return restaurant;
        }
    }).map((restaurant) => {
        return (
            <div key={restaurant.res_id}>
                <RenderRestaurantItem restaurant={restaurant} onRestaurantClick={onRestaurantClick} handleClick={handleClick} name={name}/>
            </div>
        );
    });

    return (
        <div className="container">
            <input id='rescard' placeholder="Enter Restaurant Name" onChange={event => setQuery(event.target.value)} />
            <div>
                {restaurantslist}
            </div>
        </div>
    );
}


export default Restaurants;