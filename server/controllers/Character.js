
const models = require('../models');

const Character = models.Character;

const makerPage = (req, res) => {
  Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.render('app', { csrfToken: req.csrfToken(), characters: docs });
  });
};


const makeCharacters = (req, res) => {

if (!req.body.name || !req.body.job) {
    return res.status(400).json({ error: 'RAWR! Both name, age, and job are required' });
  }

  const characterData = {
    name: req.body.name,
    job: req.body.job,
    level: req.body.level,
    owner: req.session.account._id,
  };

  const newCharacter = new Character.CharacterModel(characterData);

  const characterPromise = newCharacter.save();

  characterPromise.then(() => res.json({ redirect: '/maker' }));

  characterPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Character already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return characterPromise;
};

const getCharacter = (request, response) => {
  const req = request;
  const res = response;

  return Character.CharacterModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured' });
    }

    return res.json({ characters: docs });
  });
};

//const deleteCharacter = (request, response) => {
//};

//const doQuest = (req, res) => {  
//}


module.exports.makerPage = makerPage;
module.exports.make = makeCharacters;
module.exports.getCharacters = getCharacter;

