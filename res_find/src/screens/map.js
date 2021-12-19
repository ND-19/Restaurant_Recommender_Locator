import React, { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import Restaurants from '../components/RestaurantCard';
import L from 'leaflet';
import iconhome from '../resources/home.svg'
import iconres from '../resources/restaurant.svg'
import '../button.css'

function DraggableMarker({ dragposition, setdragposition, setp1, setp2 }) {
    const customMarkerHome = L.icon({ iconUrl: iconhome, iconSize: [38, 95], })
    // console.log(customMarker)
    const [draggable, setDraggable] = useState(false)
    // const [position, setPosition] = useState(center)
    const markerRef = useRef(null)
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                const marker = markerRef.current
                if (marker != null) {
                    setdragposition(marker.getLatLng())
                    setp2(marker.getLatLng().lat)
                    setp1(marker.getLatLng().lng)
                }
            },
        }),
        [],
    )
    const toggleDraggable = useCallback(() => {
        setDraggable((d) => !d)
    }, [])

    return (
        <Marker
            icon={customMarkerHome}
            draggable={draggable}
            eventHandlers={eventHandlers}
            position={dragposition}
            ref={markerRef}>
            <Popup minWidth={90}>
                <span onClick={toggleDraggable}>
                    {draggable
                        ? 'Marker is draggable'
                        : 'Click here to make marker draggable'}
                </span>
            </Popup>
        </Marker>
    )
}
function Map({ name }) {
    const customMarkerRes = L.icon({ iconUrl: iconres, iconSize: [38, 95], })
    const [markers, setmarkers] = useState([])
    const [p1, setp1] = useState()  //longitude
    const [p2, setp2] = useState()  //latitude
    const [resname, setresname] = useState('')
    const [city, setcity] = useState('Mumbai')
    const [cities, setcities] = useState([])
    const [radius, setradius] = useState(1)
    const [rating, setrating] = useState(4.5)
    const [costl, setcostl] = useState(500)
    const [costu, setcostu] = useState(1000)
    const [opentime, setopentime] = useState('8:00:00')
    const [closetime, setclosetime] = useState('23:00:00')
    const ratingarr = [0.5, 1.5, 2.5, 3.5, 4.5]
    const costuarr = [500, 1000, 1500, 3000, 5000, 10000, 30000]
    const costlarr = [0, 500, 1000, 1500, 3000, 5000, 10000]
    const opentimearr = ['8:00:00', '9:00:00', '10:00:00', '11:00:00', '12:00:00']
    const closetimearr = ['20:00:00', '21:00:00', '22:00:00', '23:00:00', '23:59:59']
    // const point = `POINT(${p1} ${p2})`
    const [position, setposition] = useState([0, 0]);
    const [dragposition, setdragposition] = useState([0, 0]);
    const [resposition, setresposition] = useState(false);
    // const [name, setname] = useState('')

    //Get users location
    useEffect(() => {
        AtHome();
    }, [])

    const [point, setpoint] = useState(`POINT(${p1} ${p2})`)


    // Set the cities and initially get those restaurants which are near user's location
    useEffect(() => {
        async function fetchData() {
            try {
                const output = await (
                    await axios.get(`http://localhost:5000/api/distance/getallcities`)).data;
                setcities(output)
                const results = await (
                    await axios.get(`http://localhost:5000/api/distance/getdistance/${point}`)).data;
                setmarkers(results)
                // let newposition = [...position]

                // newposition[0] = results[0].latitude
                // newposition[1] = results[0].longitude
                // // console.log(newposition)
                // setp1(results[3].longitude)
                // setp2(results[3].latitude)

                setposition([results[3].latitude, results[3].longitude])
                setresposition(false)
            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
        // loadUserDetails();
    }, [point]);

    const AtHome = () => {
        if (!navigator.geolocation) {
            console.log('Geolocation is not supported by your browser');
        } else {
            console.log('Locating...');
            navigator.geolocation.getCurrentPosition((position) => {
                setresposition(false)
                setp2(position.coords.latitude);
                setp1(position.coords.longitude);
                setdragposition([position.coords.latitude, position.coords.longitude])
                setposition([position.coords.latitude, position.coords.longitude])
                setpoint(`POINT(${position.coords.longitude} ${position.coords.latitude})`)

            }, () => {
                console.log('Unable to retrieve your location');
            });
        }
    }

    const withinRadius = () => {

        async function fetchData() {
            try {
                const results = await (
                    await axios.get(`http://localhost:5000/api/distance/userdistancewithin/${point}/${radius}`)).data;
                setmarkers(results)
                console.log(results)
                // console.log(newposition)
                // setresposition(false)
                // setposition([lat,long])

            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
    }
    //To get all the restaurants within certain radius from a selected restaurant
    const handleClick = (id, radius, lat, long) => {
        // setradius(radius)
        async function fetchData() {
            try {
                const results = await (
                    await axios.get(`http://localhost:5000/api/distance/distancewithin/${id}/${radius}`)).data;
                setmarkers(results)
                console.log(results)

                // console.log(newposition)
                setresposition(false)
                setposition([lat, long])

            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
    };


    const onRestaurantClick = (lat, long, name) => {
        console.log(lat, long)
        setposition([lat, long])
        setresname(name)
        setresposition(true)
    }

    const handleSubmit = () => {
        setcity(city)
        async function fetchData() {

            try {
                const results = await (
                    await axios.get(`http://localhost:5000/api/distance/getrestaurants/${city}/${rating}/${costl}/${costu}/${opentime}/${closetime}`)).data;
                setmarkers(results)
                // let newposition = [...position]
                // newposition[0] = 
                // newposition[1] = 

                // setp1(results[3].longitude)
                // setp2(results[3].latitude)
                console.log(`${p1} ${p2}`)
                setposition([results[3].latitude, results[3].longitude])
                // setdragposition(newposition)

            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
    }
    function ChangeMapView({ position }) {
        const map = useMap();
        map.setView(position, map.getZoom());
        // console.log(resposition)
        if (resposition) {
            map.openPopup(resname, position)
            setTimeout(() => {
                map.closePopup()
            }, 8000);
        }

        return null;
    }


    return (
        <div className="box">
            <div id="map">
                <div className='querybox'>
                    <div id='selectbox'>
                        <div className='div1'>
                            <select value={city} onChange={(e) => setcity(e.target.value)}>
                                <option> Select City</option>
                                {
                                    cities.map((city) => (<option key={city.city} value={city.city}>{city.city}</option>))
                                }
                            </select>
                        </div>
                        <div className='div2'>
                            <select value={rating} onChange={(e) => setrating(e.target.value)}>
                                <option> Select Rating</option>
                                {
                                    ratingarr.map((rate) => (<option key={rate} value={rate}>Above {rate}</option>))
                                }
                            </select>
                        </div>
                        <div className='div3'>
                            <select value={costl} onChange={(e) => setcostl(e.target.value)}>
                                <option> Select Lower Limit</option>
                                {
                                    costlarr.map((lcost) => (<option key={lcost} value={lcost}>Above {lcost}</option>))
                                }
                            </select>
                        </div>
                        <div className='div4'>
                            <select value={costu} onChange={(e) => setcostu(e.target.value)}>
                                <option> Select Upper Limit</option>
                                {
                                    costuarr.map((ucost) => (<option key={ucost} value={ucost}>Below {ucost}</option>))
                                }
                            </select>
                        </div>
                        <div className='div5'>
                            <select value={opentime} onChange={(e) => setopentime(e.target.value)}>
                                <option> Select Opentime</option>
                                {
                                    opentimearr.map((open) => (<option key={open} value={open}>After {open}</option>))
                                }
                            </select>
                        </div>
                        <div className='div6'>
                            <select value={closetime} onChange={(e) => setclosetime(e.target.value)}>
                                <option> Select Closetime</option>
                                {
                                    closetimearr.map((close) => (<option key={close} value={close}>Before {close}</option>))
                                }
                            </select>
                        </div>
                        <div className='div7'>
                            <button className='button' onClick={handleSubmit}>Click</button>
                        </div>
                    </div>
                    <div className='coordbox'>
                        <div className='div1'>
                            <input
                                type="text"

                                placeholder="Point1"
                                value={p1}
                                name="point1"
                                onChange={(e) => setp1(e.target.value)}
                            />
                        </div>
                        <div className='div2'>

                            <input
                                type="text"

                                placeholder="Point2"
                                value={p2}
                                name="point2"
                                onChange={(e) => setp2(e.target.value)}
                            />
                        </div>
                        <div className='div3'>

                            <button className='button' onClick={() => { setpoint(`POINT(${p1} ${p2})`); }}>Click</button>
                        </div>
                        <div className='div4'>

                            <input
                                type="text"

                                placeholder="Radius"
                                value={radius}
                                name="radius"
                                onChange={(e) => setradius(e.target.value)}
                            />
                        </div>
                        <div className='div5'>

                            <button className='button' onClick={withinRadius}>Radius</button>
                        </div>
                        <div className='div6'>

                            <button className='button' onClick={AtHome}>Home</button>
                            {/* {console.log(rating)} */}

                        </div>
                        {/* <div id='div7'>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Name"
                                value={name}
                                name="name"
                                onChange={(e) => setname(e.target.value)}
                            />

                        </div>
                        <div className='div8'>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="City"
                                value={usercity}
                                name="city"
                                onChange={(e) => setusercity(e.target.value)}
                            />

                        </div>
                        <div className='div9'>

                            <button className='button' onClick={() => addPerson(name)}>Enter</button>

                        </div> */}
                    </div>
                </div>
                {/* {console.log(position)} */}
                <div style={{ boxShadow: "rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px" }}>
                    <MapContainer center={position} zoom={13} scrollWheelZoom={true}>
                        <ChangeMapView position={position} />
                        <TileLayer
                            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

                        />
                        {markers.map(marker => (

                            <Marker key={marker.res_id} icon={customMarkerRes} position={[marker.latitude, marker.longitude]}>
                                <Popup>
                                    <table>
                                        <tbody>
                                            {marker.distance && (<tr>
                                                <td>Distance from current location</td>
                                                <td>{marker.distance.toPrecision(2)} km</td>
                                            </tr>)}

                                            <tr>
                                                <td>Name</td>
                                                <td>{marker.name}</td>
                                            </tr>
                                            <tr>
                                                <td>Type</td>
                                                <td>{marker.establishment}</td>
                                            </tr>
                                            <tr>
                                                <td>Address</td>
                                                <td>{marker.address}</td>
                                            </tr>
                                            <tr>
                                                <td>City</td>
                                                <td>{marker.city}</td>
                                            </tr>
                                            <tr>
                                                <td>Locality</td>
                                                <td>{marker.locality}</td>
                                            </tr>
                                            <tr>
                                                <td>Open Time</td>
                                                <td><i>{parseInt(marker.open_time.slice(0, 2))}</i>
                                                    {parseInt(marker.open_time.slice(0, 2)) === 12 ? <i> Pm</i> : <i> Am</i>}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td>Close Time</td>
                                                <td>
                                                    {parseInt(marker.close_time.slice(0, 2)) - 12 === -12 ? <i>12 Am</i> : <i> {parseInt(marker.close_time.slice(0, 2)) - 12} Pm</i>}
                                                </td>

                                            </tr>
                                            <tr>
                                                <td>Rating</td>
                                                <td>{marker.aggregate_rating}</td>
                                            </tr>
                                            <tr>
                                                <td>Cost for two</td>
                                                <td>{marker.average_cost_for_two}</td>
                                            </tr>
                                            <tr>
                                                <td>Cuisines</td>
                                                <td>{marker.cuisines}</td>
                                            </tr>
                                            <tr>
                                                <td>Highlights</td>
                                                <td>{marker.highlights}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </Popup>
                            </Marker>
                        ))}
                        <DraggableMarker dragposition={dragposition} setdragposition={setdragposition} setp1={setp1} setp2={setp2} />
                        {/* {console.log(position)} */}
                    </MapContainer>
                </div>
            </div>
            <div className="scroll">
                <Restaurants name={name} restaurants={markers} onRestaurantClick={onRestaurantClick} handleClick={handleClick} />
            </div>
        </div>
    )
}

export default Map
