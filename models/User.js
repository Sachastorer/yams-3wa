import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        "name": String,
        "date": {
        "type": Date,
        "default": Date.now
        },
        "email": String,
        "password": String
    }
)

const UserModel = mongoose.model("users", UserSchema)

export default UserModel