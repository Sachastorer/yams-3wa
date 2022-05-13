import PastrieModel from "../models/Pastrie.js"
import PastrieWonModel from "../models/PastrieWon.js"

const randNumber = () => {
    return Math.floor(Math.random() * (6 - 1 + 1) + 1)
}

const diceRoll = () => {
    const nb = []

    nb[0] = randNumber()
    nb[1] = randNumber()
    nb[2] = randNumber()
    nb[3] = randNumber()
    nb[4] = randNumber()

    return nb
}

const getNbPastriesWon = (nb) => {

    const count = {}

    nb.forEach(el => {
        count[el] = (count[el] || 0) + 1
    });

    // console.log(nb)

    let hasYams = false
    let hasSquare = false
    let hasDoubleEven = false
    let even = 0

    for (const property in count) {
        if(count[property] > 4) hasYams = true
        if(count[property] > 3) hasSquare = true
        if(count[property] > 1) even ++
    }

    if(even > 1) {
        hasDoubleEven = true
    }

    if(hasYams) return 3
    if(hasSquare) return 2
    if(hasDoubleEven) return 1
    return 0
}

const handlePastries = async () => {
    const docs = await PastrieModel.find({number: {"$gte": 1}}).exec()
    if(docs.length < 1) return 0

    // console.log(docs)
    const ind = Math.floor(Math.random()*(docs.length))
    
    console.log(docs[ind]._id)

    await PastrieModel.updateOne({_id: docs[ind]._id}, {$inc: { number: -1 }})
    const pastrieWon = new PastrieWonModel({name: docs[ind].name})
    pastrieWon.save()

    return docs[ind].name
}

export { diceRoll, getNbPastriesWon, handlePastries }