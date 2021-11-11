const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]

const url =
//   `mongodb+srv://fullstack:${password}@cluster0-ostce.mongodb.net/test?retryWrites=true`
    `mongodb+srv://steve:${password}@cluster0.3oz0w.mongodb.net/phonebook-app?retryWrites=true&w=majority`
mongoose.connect(url)





const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)



// }
// else{
//     const person = new Person({
//     name: name,
//     number: number
//     })

//     person.save().then(result => {
//     console.log(`added ${name} number ${number} to phonebook`)
//     })
// }

if (process.argv.length === 3){
    console.log('phonebook:');
    Person.find({}).then(result => {
    result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
        })
    mongoose.connection.close()
    })
}
else{
    const person = new Person({
    name: name,
    number: number
    })

    person.save().then(result => {
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
    })

}