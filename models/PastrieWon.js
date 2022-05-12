import mongoose from 'mongoose'

const PastrieWonSchema = new mongoose.Schema(
    {
        "name": String,
        "created_at" : { type: Date, required: true, default: Date.now }
    }
)

// PastrieWonSchema.methods.add = async function(name) {
//     const pastrieWon = await new PastrieWonModel({name: name})
//     pastrieWon.save()
// }

const PastrieWonModel = mongoose.model("pastriesWon", PastrieWonSchema)

export default PastrieWonModel