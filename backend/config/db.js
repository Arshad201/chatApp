const mongoose = require('mongoose');

const connectToDb  = async() =>{

    try {

        const conn = await mongoose.connect(process.env.URI,{
            useNewUrlParser : true,
            useUnifiedTopology : true,
            // useFindAndModify : true
        })

        console.log(`MongoDb connected : ${conn.connection.host}`)
        
    } catch (error) {
        console.log(`Error : ${error.message}`);
        process.exit();
    }

}

module.exports = connectToDb;