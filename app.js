const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();
const mongoose = require('mongoose');

const events = []

const Event = require('./models/event');

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

        input EventInput {
            title : String!
            description: String!
            price: Float!
            date : String
        }

        type rootQuery {
            events:[Event!]!
        }
        type rootMutation {
            createEvent(eventInput:EventInput):Event
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
                date : new Date(args.eventInput.date)
            })
            return event.save().then(result =>{
                console.log(result);
                return {...result._doc}
            }).catch(err =>{
                console.log(err);
                throw err;
            }) 
            console.log(event)
            events.push(event);
            return event;
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

