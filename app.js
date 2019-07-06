const express = require('express');
const bodyParser = require('body-parser');
const graphqlHttp = require('express-graphql');
const {buildSchema} = require('graphql');
const app = express();

const events = []

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
            return events
        },
        createEvent: (args) => {
            console.log(args)
            //console.log(events)
            const event = {
                _id : Math.random().toString(),
                 title : args.eventInput.title,
                 description: args.eventInput.description,
                 price: +args.eventInput.price,
                 date : args.eventInput.date
            } 
            console.log(event)
            events.push(event);
            return event;
        }
       
    },
    graphiql:true

}));



app.listen(3000);