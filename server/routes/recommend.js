const express=require('express')

const recommenderModel =require('../models/recommender')
const router = express.Router()


router.get('/', async (req,res)=>{
    const result = await recommenderModel.load()
    res.json(result)
})
router.post('/addperson/:name', async (req,res)=>{
    const result = await recommenderModel.addPerson(req.params.name)
    res.json(result)
})
router.post('/makefriend/:n1/:n2', async (req,res)=>{
    const result = await recommenderModel.makeFriend(req.params.n1,req.params.n2)
    res.json(result)
})
router.get('/getallfriends/:name', async (req,res)=>{
    const result = await recommenderModel.getallFriends(req.params.name)
    res.json(result)
})
router.get('/getallnotfriends/:name', async (req,res)=>{
    const result = await recommenderModel.getallNotFriends(req.params.name)
    res.json(result)
})
router.get('/getallpersons', async (req,res)=>{
    const result = await recommenderModel.getallPersons()
    res.json(result)
})
router.get('/getcuisinesliked/:name', async (req,res)=>{
    const result = await recommenderModel.getCuisinesLiked(req.params.name)
    res.json(result)
})
router.get('/getrestaurantsliked/:name', async (req,res)=>{
    const result = await recommenderModel.getRestaurantsLiked(req.params.name)
    res.json(result)
})
router.get('/getpersonrecommendation/:name', async (req,res)=>{
    const result = await recommenderModel.getPersonRecommendation(req.params.name)
    res.json(result)
})
router.get('/getrestaurantrecommendation/:name/:cuisine', async (req,res)=>{
    const result = await recommenderModel.getRestaurantRecommendation(req.params.name,req.params.cuisine)
    res.json(result)
})
router.post('/personresrelation/:name/:resid', async (req,res)=>{
    const result = await recommenderModel.person_res_relation(req.params.name,req.params.resid)
    res.json(result)
})
// router.post('/personcuisinerelation/:name/:cuisine', async (req,res)=>{
//     const result = await recommenderModel.getPersonRecommendation(req.params.name,req.params.cuisine)
//     res.json(result)
// })

module.exports = router