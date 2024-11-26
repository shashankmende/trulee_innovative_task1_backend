const Ticket = require("../models/ticket")


const createTicket = async(req,res)=>{
    try {
        console.log(req.body)
        const {issueType,description,status}=req.body 
        if (!issueType){
            return res.status(400).send({message:"Issue type is required"})
        }
        if (!description){
            return res.status(400).send({message:"Description is required"})
        }
        const ticket = await Ticket.create({issueType,description,status})
        return res.status(201).send({
            message:"Ticket created successfully",
            success:true,
            ticket
        })
    } catch (error) {
        console.log(error)
        return res.status(500).send({
            message:"Failed to create ticket",
            success:false,
            error
        })
    }
}

const getTicket = async(req,res)=>{
    try {
        const tickets = await Ticket.find().sort({createdAt:-1})
        return res.status(200).send({
            success:true,
            message:"Tickets retrieved successfully",
            tickets
        })


    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Failed to retrieve tickets",
            error
        })
    }
}

module.exports = {createTicket,getTicket}