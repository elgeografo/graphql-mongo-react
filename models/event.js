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
})

module.exports = mongoose.model("Event", eventSchema);

// mutation{
//     createEvent(eventInput:{title:"titulo 1", description: "description 1", price:9.99, date:"2019-07-07T19:23:40.376Z"}){
//       title
//       _id
//     }
//   }