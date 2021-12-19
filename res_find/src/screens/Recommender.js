import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    TabContent, TabPane, Nav,
    NavItem, NavLink, Row, Col
} from 'reactstrap';
import classnames from 'classnames';
import axios from 'axios';

function Recommender({ name }) {

    const [friends, setfriends] = useState([])
    const [people, setpeople] = useState([])
    const [resarr, setresarr] = useState([])
    const [resarrid, setresarrid] = useState([])
    const [resrec, setresrec] = useState([])
    const [cuisine, setcuisine] = useState('Cuisine')
    // State for current active Tab
    const [currentActiveTab, setCurrentActiveTab] = useState('1');

    // Toggle active state for Tab
    const toggle = tab => {
        if (currentActiveTab !== tab) setCurrentActiveTab(tab);
    }
    useEffect(() => {
        async function fetchData() {
            try {
                const nfriends = await (
                    await axios.get(`http://localhost:5000/getallnotfriends/${name}`)).data;
                // setfriends(results)
                const friendsres = await (
                    await axios.get(`http://localhost:5000/getallfriends/${name}`)).data;

                const restaurants = await (
                    await axios.get(`http://localhost:5000/getrestaurantsliked/${name}`)).data;

                for (let i = 0; i < restaurants.length; i++) {
                    restaurants[i]._fields.map(field => {
                        if (!resarrid.includes(field.properties.id)) {
                            setresarr(oldarr => [...oldarr, field.properties])
                            setresarrid(oldarr => [...oldarr, field.properties.id])
                        }
                    })

                }
                console.log(resarrid)
                console.log(resarr)
                // for (let i = 0; i < cuisines.length; i++) {
                //     if (!cuisinearr.includes(cuisines[i]._fields[0].properties.name)) {
                //         setcuisinearr(oldarr => [...oldarr, cuisines[i]._fields[0].properties.name])
                //     }
                // }
                // console.log(cuisinearr)
                for (let i = 0; i < friendsres.length; i++) {
                    if (!friends.includes(friendsres[i]._fields[0].properties.name)) {
                        setfriends(oldarr => [...oldarr, friendsres[i]._fields[0].properties.name])
                    }
                }
                console.log(friends)
                for (let i = 0; i < nfriends.length; i++) {
                    // setpeople([])
                    if (!people.includes(nfriends[i]._fields[0].properties.name)) {
                        setpeople(oldarr => [...oldarr, nfriends[i]._fields[0].properties.name])
                    }

                    console.log(people)
                }
            } catch (error) {
                console.log(error);

            }
        }

        fetchData();
    }, [])
    // const getallFriends = (name) => {
    //     async function fetchData() {
    //         try {
    //             const results = await (
    //                 await axios.get(`http://localhost:5000/getallfriends/${name}`)).data;
    //             // setfriends(results)
    //             for (let i = 0; i < results.length; i++) {
    //                 friendsarr.push(results[i]._fields[0].properties.name)
    //             }
    //             console.log(friendsarr)

    //         } catch (error) {
    //             console.log(error);

    //         }
    //     }
    //     fetchData();
    // }
    // const getallPersons = () => {
    //     async function fetchData() {
    //         try {
    //             const results = await (
    //                 await axios.get(`http://localhost:5000/getallpersons`)).data;
    //             // setfriends(results)
    //             for (let i = 0; i < results.length; i++) {
    //                 setpeople(oldarr=> [...oldarr,results[i]._fields[0].properties.name])
    //             }
    //             console.log(people)

    //         } catch (error) {
    //             console.log(error);

    //         }
    //     }
    //     fetchData();
    // }
    // const getcuisinesliked = (name) => {
    //     async function fetchData() {
    //         try {
    //             const results = await (
    //                 await axios.get(`http://localhost:5000/getcuisinesliked/${name}`)).data;
    //             // setfriends(results)
    //             for (let i = 0; i < results.length; i++) {
    //                 cuisinearr.push(results[i]._fields[0].properties.name)
    //             }
    //             console.log(cuisinearr)

    //         } catch (error) {
    //             console.log(error);

    //         }
    //     }
    //     fetchData();
    // }
    // const getrestaurantsliked = (name) => {
    //     async function fetchData() {
    //         try {
    //             const results = await (
    //                 await axios.get(`http://localhost:5000/getrestaurantsliked/${name}`)).data;
    //             // setfriends(results)
    //             for (let i = 0; i < results.length; i++) {
    //                 resarr.push(results[i]._fields[0].properties.name)
    //             }
    //             console.log(resarr)

    //         } catch (error) {
    //             console.log(error);

    //         }
    //     }
    //     fetchData();
    // }
    const getrestaurantrecommendation = (name, cuisine) => {
        setresrec([])
        async function fetchData() {
            try {
                const results = await (
                    await axios.get(`http://localhost:5000/getrestaurantrecommendation/${name}/${cuisine}`)).data;
                // setfriends(results)
                for (let i = 0; i < results.length; i++) {
                    setresrec(oldarr => [...oldarr, results[i]._fields])
                    // .map(field => {
                    //     console.log(field)
                    // })

                }


            } catch (error) {
                console.log(error);

            }
        }
        fetchData();
        console.log(resrec)
    }

    return (
        <div style={{
            display: 'block', width: 1500, padding: 30
        }}>
            <h4>Eat. Sleep. Repeat</h4>
            <Nav style={{ cursor: "pointer" }} tabs>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '1'
                        })}
                        onClick={() => { toggle('1'); }}
                    >
                        Friends
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '2'
                        })}
                        onClick={() => { toggle('2'); }}
                    >
                        People
                    </NavLink>

                </NavItem>

                <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '3'
                        })}
                        onClick={() => { toggle('3'); }}
                    >
                        Restaurants Liked
                    </NavLink>
                </NavItem>
                <NavItem>
                    <NavLink
                        className={classnames({
                            active:
                                currentActiveTab === '4'
                        })}
                        onClick={() => { toggle('4'); getrestaurantrecommendation('Sanju', 'Chinese') }}
                    >
                        Restaurant Recommendation
                    </NavLink>
                </NavItem>
            </Nav>
            <TabContent activeTab={currentActiveTab}>
                <TabPane tabId="1">
                    <Row>
                        <Col sm="4">
                            <div>
                                <table className="table table-bordered table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th>Friend Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {console.log(people)} */}
                                        {friends &&
                                            friends.map((friend) => {
                                                return (
                                                    <tr>
                                                        <td key={friend}>{friend}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="2">
                    <Row>
                        <Col sm="4">

                            <div>
                                <table className="table table-bordered table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th>Person Name</th>
                                            {/* <th>Button</th> */}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {console.log(people)} */}
                                        {people &&
                                            people.map((person) => {
                                                return (
                                                    <tr>
                                                        <td key={person}>{person}</td>
                                                        {/* <td><button onClick={() => makefriend(name, person)}>Make Friend</button></td> */}
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="3">
                    <Row>
                        <Col sm="8">
                            <div>
                                <table className="table table-bordered table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th>Restaurant Id</th>
                                            <th>Restaurant Name</th>
                                            <th>Average Cost For Two</th>
                                            <th>City</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {console.log(people)} */}
                                        {resarr &&
                                            resarr.map((restaurant) => {
                                                return (
                                                    <tr key={restaurant.id}>
                                                        <td>{restaurant.id}</td>
                                                        <td >{restaurant.name}</td>
                                                        <td >{restaurant.cost}</td>
                                                        <td >{restaurant.city}</td>
                                                    </tr>
                                                );
                                            })}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
                <TabPane tabId="4" style={{ marginTop: "10px" }}>

                    <input
                        style={{ width: "300px", marginRight: "30px" }}
                        type="text"
                        placeholder="Cuisine"
                        value={cuisine}
                        name="cuisine"
                        onChange={(e) => setcuisine(e.target.value)}
                    />
                    <button className='button' onClick={() => { getrestaurantrecommendation(name, cuisine) }}>Recommend</button>
                    <Row>
                        <Col sm="8">
                            <div>
                                <table className="table table-bordered table-striped table-dark">
                                    <thead>
                                        <tr>
                                            <th>Restaurant Name</th>
                                            <th>Recommend By</th>
                                            <th>Number of Recommendations</th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* {console.log(people)} */}
                                        {resrec &&
                                            resrec.map(rec => {
                                                return (
                                                    <tr key={rec[0]}>
                                                        <td>{rec[0]}</td>
                                                        <td >{rec[1].map(n =>{
                                                            return <h6>{n} </h6>
                                                        })}</td>
                                                        <td >{rec[2]}</td>
                                                    </tr>
                                                );
                                            })}



                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </Row>
                </TabPane>
            </TabContent>
        </div >
    );
}
export default Recommender;