const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const _ = require('underscore');

let DomoModel = {};

// mongoose.Types.ObjectID is a function
// that converts string ID to a real mongo ID
const convertID = mongoose.Types.ObjectId;
const setName = (name) => _.escape(name).trim();
const setJob = (job) => _.escape(job).trim();

const DomoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    set: setName,
  },

  age: {
    type: Number,
    min: 0,
    required: true,
  },

  // NEW FOR DOMO E
  job: {
    type: String,
    required: true,
    trim: true,
    set: setJob,
  },
  
  // NEW FOR DOMO E
  level: {
    type: Number,
    min: 1,
    required: false,
  },

  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },

  createdData: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.statics.toAPI = (doc) => ({
  name: doc.name,
  age: doc.age,
  job: doc.job,    // NEWLY ADDED
  level: doc.level, // NEWLY ADDED
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: convertID(ownerId),
  };

  return DomoModel.find(search).select('name age job level').exec(callback);
  // added 'job' ^
};


DomoModel = mongoose.model('Domo', DomoSchema);

module.exports.DomoModel = DomoModel;
module.exports.DomoSchema = DomoSchema;

