import mongoose from 'mongoose'

const PastrieSchema = new mongoose.Schema(
    {
        "name": String,
        "number": Number,
        "order": Number
    }
)

// PastrieSchema.methods.decrementOne = async function (id) {
//     await this.updateOne({_id: id}, {$inc: {number: -1}})
// }

const PastrieModel = mongoose.model("pastries", PastrieSchema)

export default PastrieModel