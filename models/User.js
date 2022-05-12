import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
    {
        "name": String,
        "email": String,
        "password": String,
        "played": Boolean
    }
)

const UserModel = mongoose.model("users", UserSchema)

export default UserModel