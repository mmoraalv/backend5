import { Router } from 'express'
import MessageModel from '../models/messages.models.js'

const messageRouter = Router()

// Route to get all the messages
messageRouter.get('/', async (req, res) => {
  const { limit } = req.query

  try {
    const foundMessages = await MessageModel.find().limit(limit)

    res.status(200).send({ result: 'OK', message: foundMessages })
  }

  catch (error) {
    res.status(400).send({ error: `Error consulting the messages: ${error}` })
  }
})

// Route to add a new message
messageRouter.post('/', async (req, res)=>{
  const { email, message } = req.body

  try {
    const addedMessage = await MessageModel.create({
      email, message
    })

    res.status(200).send({ result: 'OK', message: addedMessage})
  }

  catch (error) {
    res.status(400).send({ error: `Error creating the message: ${error}` })
  }
})

export default messageRouter