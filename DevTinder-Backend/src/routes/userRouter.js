const express = require('express')
const {userAuth} = require("../middlewares/auth")
const ConnectionRequest = require("../models/connectionRequest")
const User = require('../models/user')

const userRouter = express.Router()

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills"

// /user/requests/received = get all the pending connection reuqest for the loggedInUser
userRouter.get(
    "/user/requests/received",
    userAuth,
    async (req,res) =>{
        try {

            const loggedInUser = req.user

            const connectionRequests = await ConnectionRequest.find({
                toUserId: loggedInUser._id,
                status: "interested"
            }).populate("fromUserId","firstName lastName photoUrl age gender about skills",) // we can also write like a string where the fields name are separated by space
            // }).populate("fromUserId",["firstName","lastName"],) // we can write like a array consisting of strings 

            res.json({
                message:"Data fetched Successfully",
                data: connectionRequests
            })

            

            
        } catch (error) {
            res.status(400).send("ERROR : ",+error.message)
        }
    }

)

// /user/connections  - > it fetches the list of users who has accepted the connection request from the loggedInUser
userRouter.get(
    "/user/connections",
    userAuth,
    async(req,res) =>{
        try {
            const loggedInUser = req.user

            const connectionRequests = await ConnectionRequest.find({
                $or:[
                    {toUserId:loggedInUser._id, status:"accepted"},
                    {fromUserId:loggedInUser._id, status:"accepted"},
                ]
            }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)

            const data = connectionRequests.map((row)=>{
                if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
                    return row.toUserId
                }
                  return  row.fromUserId
                
            })

            res.json({message:"Data fetched Successfully", data:data})

        } catch (error) {
            res.status(400).send("ERROR : "+ error.message)
        }
    }
)

userRouter.get(
    "/feed",
    userAuth,
    async (req,res) =>{
        try{
           
            const loggedInUser = req.user

            const page = parseInt(req.query.page) || 1
            let limit = parseInt(req.query.limit) || 10
            limit = limit>50 ? 50 : limit
            const skip = (page-1)*limit

             

            // find all the connection requests that logged in user has sent + received
            const connectionRequests = await ConnectionRequest.find({
                $or:[ {fromUserId: loggedInUser._id},{toUserId: loggedInUser._id}]
            })
            .select("fromUserId toUserId")
            // .populate("fromUserId","firstName") 
            // .populate("toUserId","firstName") // used populate to see the names to fromUser and toUser
            
            const hideUsersFromFeed  = new Set() // set is an array only but doesnt store duplicate values
            connectionRequests.forEach((req)=>{
                hideUsersFromFeed.add(req.fromUserId.toString())
                hideUsersFromFeed.add(req.toUserId.toString())
            })

            const users = await User.find({
                $and : [
                    {_id:{$nin: Array.from(hideUsersFromFeed)}},
                    {_id : {$ne: loggedInUser._id}}
                ]
            }).select(USER_SAFE_DATA).skip(skip).limit(limit)
            
        

            res.json({data: users} )
        }
        catch(error){
            res.status(400).json({message: error.message})
        }
    }
)

module.exports = userRouter