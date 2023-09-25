import {Schema, model} from "mongoose";

//definir schemas
const stringRequired = {
    type: String,
    required: true
}

const userSchema = new Schema({
    first_name: stringRequired,
    last_name: stringRequired,
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    password: stringRequired,
    rol: {
        type: String,
        default: 'user'
    },
    age: {
        type: Number,
        required: true
    }
})

export const userModel = model('users', userSchema)