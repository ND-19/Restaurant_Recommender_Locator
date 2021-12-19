const neo4j = require('neo4j-driver')
const uri = 'bolt://localhost'
const driver = neo4j.driver(uri, neo4j.auth.basic('neo4j', '1234'),{ disableLosslessIntegers: true })
const session = driver.session()
const cuisines = ['Chinese', 'Italian', 'Mexican']
const city = 'Mumbai'

async function load(city) {
    try {
        await session.run(
            `LOAD CSV WITH HEADERS FROM \'file:///C:/Users/nityansh/Desktop/SGD_project/data/restaurants_in_India.csv\' AS row WITH row WHERE row.city='${city}' AND NOT row.cuisines IS NULL ` +
            'MERGE (r:Restaurant{id:row.res_id,name:row.name,cost:row.average_cost_for_two,city:row.city}) ' +
            'MERGE (city:City{id:row.city_id,name:row.city}) ' +
            'MERGE (cuisine:Cuisine{name:row.cuisines}) ' +
            'MERGE (r)-[:SERVES]->(cuisine) ' +
            'MERGE (r)-[:LOCATED_IN]->(city) '
        )
    } catch (err) {
        console.log(err)
    } finally {
        session.close()
    }
}
//On Signing up User will be added as a Person
async function addPerson(person_name) {
    try {
        const result = await driver.session().run(`MERGE (p:Person{name:'${person_name}'})`)
        const records = result.records
    
        for (let i = 0; i < records.length; i++) {
            console.log(records[i]._fields)
        }
    } catch (err) {
        console.log(err)
    }
}
// From a list of Persons User will use makeFriend to create a relationship of friendship with a particular person
async function makeFriend(person1,person2) {
    try {
        const result = await driver.session().run(`MATCH (p1:Person{name:'${person1}'}) MERGE (p2:Person{name:'${person2}'}) MERGE (p1)-[:IS_FRIEND_OF]->(p2) RETURN p2`)
        return result.records
    
        // for (let i = 0; i < records.length; i++) {
        //     console.log(records[i]._fields)
        // }
    } catch (err) {
        console.log(err)
    }
}
//get all the friends of a particular user
async function getallFriends(person) {
    try {
        const result = await driver.session().run(`MATCH(p:Person{name:'${person}'})-[:IS_FRIEND_OF]->(p2:Person) RETURN p2`)
        return result.records
    } catch (err) {
        console.log(err)
    }
}
async function getallNotFriends(person) {
    try {
        const result = await driver.session().run(`MATCH (p:Person{name:'${person}'}) MATCH (p1:Person) WHERE p<>p1 AND NOT EXISTS((p)-[:IS_FRIEND_OF]->(p1)) RETURN p1`)
        return result.records
    
    } catch (err) {
        console.log(err)
    }
}
async function getallPersons() {
    try {
        const result = await driver.session().run(`MATCH (p:Person) RETURN p`)
        return result.records
    
    } catch (err) {
        console.log(err)
    }
}

async function getCuisinesLiked(person_name) {
    try {
        const result = await driver.session().run(`MATCH (c:LikedCuisine)<-[:LIKES]-(p:Person{name:'${person_name}'}) RETURN c`)
        return result.records
    
    } catch (err) {
        console.log(err)
    }
}
async function getRestaurantsLiked(person_name) {
    try {
        const result = await driver.session().run(`MATCH(r:Restaurant)<-[:LIKES]-(p:Person{name:'${person_name}'}) RETURN r`)
        return result.records

    } catch (err) {
        console.log(err)
    }
}

async function getPersonRecommendation(person_name) {
    try {
        const result = await driver.session().run(`MATCH (p1:Person {name: '${person_name}'})-[:LIKES]->(cuisine1:LikedCuisine)
        WITH p1, collect(id(cuisine1)) AS p1Cuisine
        MATCH (p2:Person)-[:LIKES]->(cuisine2:LikedCuisine) WHERE p1 <> p2
        WITH p1, p1Cuisine, p2, collect(id(cuisine2)) AS p2Cuisine
        RETURN p1.name AS from,
               p2.name AS to,
               gds.alpha.similarity.jaccard(p1Cuisine, p2Cuisine) AS similarity
               ORDER BY to, similarity DESC
        `)
        return result.records

    } catch (err) {
        console.log(err)
    }
}

async function getRestaurantRecommendation(person_name,cuisine) {
    try {
        const result = await driver.session().run(`MATCH (p:Person {name: '${person_name}'}),
        (p)-[:IS_FRIEND_OF]->(friend),
        (restaurant:Restaurant)-[:LOCATED_IN]->(:City {name: '${city}'}),
        (restaurant)-[:SERVES]->(c:Cuisine),
        (friend)-[:LIKES]->(restaurant)
  WHERE c.name CONTAINS '${cuisine}'
  RETURN restaurant.name as restaurantName, collect(friend.name) AS recommendedBy, count(*) AS numberOfRecommendations
  ORDER BY numberOfRecommendations DESC
        `)

        return result.records

    } catch (err) {
        console.log(err)
    }
}

async function person_res_relation(person_name, res_id) {
    try {
        const result = await driver.session()
            .run(`MATCH (p:Person{name:'${person_name}'}) MERGE (r:Restaurant {id:'${res_id}'}) MERGE (p)-[:LIKES]->(r) RETURN r,p LIMIT 1`)

        return result.records

    } catch (err) {
        console.log(err)
    }
}
async function person_cuisine_relation(person_name, cuisines) {
    cuisines.map(async cuisine => {
        try {
            const result = await driver.session().
                // tx.run('MATCH (r:Restaurant{name:\'Anupam Sweet\'})-[:SERVES]->(cuisine) RETURN cuisine')
                run(`MATCH (p:Person{name:'${person_name}'}) MERGE (cuisine:LikedCuisine {name:'${cuisine}'}) MERGE (p)-[:LIKES]->(cuisine) RETURN cuisine,p LIMIT 1`)
            // tx.run('MATCH (p:Person) RETURN p')
            console.log(records[0])
            return result.records
            
            // res.json(records[0])
            // for (let i = 0; i < records.length; i++) {
            // records[i]._fields.forEach(field => {
            //     console.log(field)
            //     res.json(field) 
            // });

            // }
        } catch (err) {
            console.log(err)
        }
    })
}


// // on application exit:
// await driver.close()

// load(city)
// getPersonRecommendation('Sanju')
// getRestaurantRecommendation('Sanju','Chinese')
// getCuisinesLiked('Sanju')
// makeFriend('Sanju', 'Dhoni')
// getallFriends('Sanju')
// getRestaurantsLiked('Sanju')
// addPerson('Kohli')
// person_res_relation('Ramesh','Foodland')
// person_cuisine_relation('Ramesh', cuisines)
module.exports={
    getCuisinesLiked,
    getPersonRecommendation,
    getRestaurantsLiked,
    getallPersons,
    getallFriends,
    getallNotFriends,
    person_cuisine_relation,
    person_res_relation,
    load,
    addPerson,
    makeFriend,
    getRestaurantRecommendation
}