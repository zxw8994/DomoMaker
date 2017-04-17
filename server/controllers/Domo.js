
const models = require('../models');

const Domo = models.Domo;

const makerPage = (req, res) => {
  Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), domos: docs });
  });
};


const makeDomo = (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.job) { // NEWLY ADDED || !req.body.job
    return res.status(400).json({ error: 'RAWR! Both name, age, and job are required' });
  } // NEWLY ADDED ^

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    job: req.body.job,  // NEWLY ADDED
    level: req.body.level, // NEWLY ADDED
    owner: req.session.account._id,
  };

  const newDomo = new Domo.DomoModel(domoData);

  const domoPromise = newDomo.save();

  domoPromise.then(() => res.json({ redirect: '/maker' }));

  domoPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return domoPromise;
};

const getDomos = (request, response) => {
  const req = request;
  const res = response;

  return Domo.DomoModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ domos: docs });
  });
};


module.exports.makerPage = makerPage;
module.exports.make = makeDomo;
module.exports.getDomos = getDomos;

