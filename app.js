const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const events = []
const Event = require('./models/event');
const User = require('./models/user');

//app.use(bodyParser.json())


app.use('/graphql',graphqlHttp({
    schema:buildSchema(`
        type Event {
            _id : ID!
            title : String!
            description: String!
            price: Float!
            date : String        
        }

        type User {
            _id: ID!
            email: String!
            password: String
        }

        input EventInput {
            title : String!
            description: String!
            price: Float!
            date : String
        }

        input UserInput {
            email: String!
            password: String!
        }

        type rootQuery {
            events:[Event!]!
        }
        type rootMutation {
            createEvent(eventInput:EventInput):Event
            createUser(userInput: UserInput):User
        }
        schema{
            query : rootQuery
            mutation : rootMutation
        }
    `),
    rootValue:{
        events: () => {
            return Event.find().then(events => {
                return events.map(event => {
                    return {...event._doc, _id: event._doc._id.toString()}
                })
            }).catch(err=>{
                console.log(err);
            })
            // Este find funciona con esta query en graphiql
            // query{
            //     events{
            //       title
            //       _id
            //     }
            //   }

        },
        createEvent: (args) => {
            console.log(args)
            //console.log(events)
            // const event = {
            //     _id : Math.random().toString(),
            //     title : args.eventInput.title,
            //     description: args.eventInput.description,
            //     price: +args.eventInput.price,
            //     date : args.eventInput.date
            // } 
            const event = new Event({
                title : args.eventInput.title,
                description: args.eventInput.description,
                price: +args.eventInput.price,
                date : new Date(args.eventInput.date),
                creator : '5d2483a57b779a26c838b32a' // Lo dejamos en el minuto 20
            })
            let createdEvent;
            return event
            .save()
            .then(result =>{
                createdEvent = {...result._doc, _id:result._doc._id.toString()}
                return User.findById('5d2483a57b779a26c838b32a');
            }).then(user =>{
                if(!user){
                    throw new Error("User does not exists")
                }
                user.createdEvents.push(event); // podríamos pasarle solo el ID del evento.
                return user.save();
            })
            .then( result =>{
                return createdEvent;
            })
            .catch(err =>{
                console.log(err);
                throw err;
            }) 
            console.log(event)
            events.push(event);
            return event;
        },
        createUser: args =>{
            return User.findOne({email:args.userInput.email}).then(user =>{
                if(user){
                    throw new Error('User already exists.')
                }
                return bcrypt.hash(args.userInput.password,12)
            })
            .then(hashedPassword => {
                const user = new User({
                    email : args.userInput.email,
                    password : hashedPassword
                })
                return user.save()
            })
            .then(result => {
                return {...result._doc, _id:result.id, password:null} // nunca devolvemos la password
            })
            .catch(err =>{
                throw err
            })
            

        }
       
    },
    graphiql:true

}));

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${
    process.env.MONGO_PASSWORD
}@kopter-test-9jdqy.mongodb.net/${process.env.MONGO_DB}?retryWrites=true&w=majority`)
.then(()=>{
    app.listen(3000);
})
.catch(err =>{
    console.log(err)
});

