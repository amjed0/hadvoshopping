// const MongoClient = require('mongodb').MongoClient

// const State = {
//   db: null
// };

// module.exports.connect = function (done) {
//   if (State.db) {
//     console.log('✅ Using existing DB connection');
//     return done();
//   }
//   const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping';

//   MongoClient.connect(url)
//     .then((client) => {
//       State.db = client.db('shopping');
//       console.log(`✅ MongoDB connected to 'shopping' database`);
//       done();
//     })
//     .catch((err) => {
//       done(err);
//     });
// };

// module.exports.get = function () {
//   return State.db;
// };
const MongoClient = require('mongodb').MongoClient;

const State = {
  db: null,
  client: null
};

module.exports.connect = async function (done) {
  // If already connected, do not open a new connection
  if (State.db) {
    console.log('✅ Using existing DB connection');
    return typeof done === 'function' ? done() : true;
  }

  // 1. Prioritize Vercel's Environment Variable, fallback to local
  const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopping';

  try {
    console.log('🔄 Connecting to MongoDB...');
    const client = await MongoClient.connect(url);
    State.client = client;
    
    // 2. Automatically grab the database name from the URI string, 
    // or fallback to 'shopping' if it isn't specified in the URI
    State.db = client.db('shopping'); 
    
    console.log(`✅ MongoDB connected successfully`);
    if (typeof done === 'function') done();
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err);
    if (typeof done === 'function') done(err);
    throw err;
  }
};

module.exports.get = function () {
  return State.db;
};