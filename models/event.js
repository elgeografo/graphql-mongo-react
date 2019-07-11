const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        required:true
    },
    creator:{
        type: Schema.Types.ObjectId,
        ref: 'Event'
    }
})

module.exports = mongoose.model("Event", eventSchema);

// How to use this in grphiql
// mutation{
//     createEvent(eventInput:{title:"titulo 1", description: "description 1", price:9.99, date:"2019-07-07T19:23:40.376Z"}){
//       title
//       _id
//     }
//   }

// other example
// mutation{
//     createEvent(eventInput:{
//       title : "new event 2",
//       description : "description of the new event 2",
//       price : 9.99,
//       date : "2019-08-11T15:32:21.103Z"
//     }) {
//       date
//     }
//   }