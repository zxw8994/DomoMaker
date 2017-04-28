let characterRenderer;   // Domo Renderer component
let characterForm;       // Domo Add Form Render Component
let CharacterFormClass;  // Domo Form React UI class
let CharacterListClass;  // Domo List React UI class

const handleCharacter = (e) => {
    e.preventDefault();
    
    //$("#domoMessage").animate({width:'hide'},350);
    
    // NEWLY ADDED || $("#domoJob").val() == ''
    if($("#domoName").val() == '' || $("#domoJob").val() == '') { 
        handleError("All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function() {
       characterRenderer.loadCharactersFromServer(); 
    });
    
    return false;
};

const renderCharacter = function() {
  return (
    <form id="characterForm"
        onSubmit={this.handleSubmit}
        name="characterForm"
        action="/maker"
        method="POST"
        className="characterForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="characterName" type="text" name="name" placeholder="Character Name"/>
        <label htmlFor="job">Job: </label>    
        <select id="characterJob" name="job">
            <option value="Barbarian">Barbarian</option>
            <option value="Bard">Bard</option>
            <option value="Cleric">Cleric</option>
            <option value="Druid">Druid</option>
            <option value="Fighter">Fighter</option>
            <option value="Monk">Monk</option>
            <option value="Paladin">Paladin</option>
            <option value="Ranger">Ranger</option>
            <option value="Rogue">Rogue</option>
            <option value="Sorcerer">Sorcerer</option>
            <option value="Warlock">Warlock</option>
            <option value="Wizard">Wizard</option>
        </select>
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="makeCharacterSubmit" type="submit" value="Make Character" />
      </form>
  );
};


const renderCharacterList = function() {
    if(this.state.data.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters yet</h3>
            </div>
        );
    }
    //onSubmit={() => {this.handleSubmit(character._id);}
    const characterNodes = this.state.data.map(function(character) {
        return (
            <div key={character._id}
            className="character" name="character" 
            method="POST" action="/deleteCharacter"
            >
              <h3 className="characterName"> Name: {character.name} </h3>
              <h3 className="characterJob"> Job: {character.job} </h3>
              <h3 className="characterLevel"> Level: {character.level=1} </h3>
              <input type="hidden" name="_id" value={character._id} />
              <input className="makeCharacterLevel" type="submit" value="Level-Up Character(Not Working)" />
              <input className="deleteCharacter" type="submit" value="Delete Character(Not Working)" />
            </div>        
        );                  
    });
    
    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};


const setup = function(csrf) {
    CharacterFormClass = React.createClass({
       handleSubmit: handleCharacter,
       render: renderCharacter,
    });
    
    CharacterListClass = React.createClass({
       loadCharactersFromServer: function() {
         sendAjax('GET','/getCharacters',null, function(data) {
            this.setState({data:data.characters}); 
         }.bind(this));
       },
       getInitialState: function() {
         return {data: []};  
       },
       componentDidMount: function() {
         this.loadCharactersFromServer();  
       },
        render: renderCharacterList
    });
    
    characterForm = ReactDOM.render(
        <CharacterFormClass csrf={csrf} />, document.querySelector("#makeCharacter")
    );
    
    characterRenderer = ReactDOM.render(
        <CharacterListClass />, document.querySelector("#characters")
    );
};

const getToken = () => {
    sendAjax('GET', '/getToken', null, (result) => {
       setup(result.csrfToken); 
    });
}

$(document).ready(function() {
   getToken(); 
});









