"use strict";

var characterRenderer = void 0; // Domo Renderer component
var characterForm = void 0; // Domo Add Form Render Component
var CharacterFormClass = void 0; // Domo Form React UI class
var CharacterListClass = void 0; // Domo List React UI class

var handleCharacter = function handleCharacter(e) {
    e.preventDefault();

    //$("#domoMessage").animate({width:'hide'},350);

    // NEWLY ADDED || $("#domoJob").val() == ''
    if ($("#domoName").val() == '' || $("#domoJob").val() == '') {
        handleError("All fields are required");
        return false;
    }

    sendAjax('POST', $("#characterForm").attr("action"), $("#characterForm").serialize(), function () {
        characterRenderer.loadCharactersFromServer();
    });

    return false;
};

var renderCharacter = function renderCharacter() {
    return React.createElement(
        "form",
        { id: "characterForm",
            onSubmit: this.handleSubmit,
            name: "characterForm",
            action: "/maker",
            method: "POST",
            className: "characterForm"
        },
        React.createElement(
            "label",
            { htmlFor: "name" },
            "Name: "
        ),
        React.createElement("input", { id: "characterName", type: "text", name: "name", placeholder: "Character Name" }),
        React.createElement(
            "label",
            { htmlFor: "job" },
            "Job: "
        ),
        React.createElement(
            "select",
            { id: "characterJob", name: "job" },
            React.createElement(
                "option",
                { value: "Barbarian" },
                "Barbarian"
            ),
            React.createElement(
                "option",
                { value: "Bard" },
                "Bard"
            ),
            React.createElement(
                "option",
                { value: "Cleric" },
                "Cleric"
            ),
            React.createElement(
                "option",
                { value: "Druid" },
                "Druid"
            ),
            React.createElement(
                "option",
                { value: "Fighter" },
                "Fighter"
            ),
            React.createElement(
                "option",
                { value: "Monk" },
                "Monk"
            ),
            React.createElement(
                "option",
                { value: "Paladin" },
                "Paladin"
            ),
            React.createElement(
                "option",
                { value: "Ranger" },
                "Ranger"
            ),
            React.createElement(
                "option",
                { value: "Rogue" },
                "Rogue"
            ),
            React.createElement(
                "option",
                { value: "Sorcerer" },
                "Sorcerer"
            ),
            React.createElement(
                "option",
                { value: "Warlock" },
                "Warlock"
            ),
            React.createElement(
                "option",
                { value: "Wizard" },
                "Wizard"
            )
        ),
        React.createElement("input", { type: "hidden", name: "_csrf", value: this.props.csrf }),
        React.createElement("input", { className: "makeCharacterSubmit", type: "submit", value: "Make Character" })
    );
};

var renderCharacterList = function renderCharacterList() {
    if (this.state.data.length === 0) {
        return React.createElement(
            "div",
            { className: "characterList" },
            React.createElement(
                "h3",
                { className: "emptyCharacter" },
                "No Characters yet"
            )
        );
    }
    //onSubmit={() => {this.handleSubmit(character._id);}
    var characterNodes = this.state.data.map(function (character) {
        return React.createElement(
            "div",
            { key: character._id,
                className: "character", name: "character",
                method: "POST", action: "/deleteCharacter"
            },
            React.createElement(
                "h3",
                { className: "characterName" },
                " Name: ",
                character.name,
                " "
            ),
            React.createElement(
                "h3",
                { className: "characterJob" },
                " Job: ",
                character.job,
                " "
            ),
            React.createElement(
                "h3",
                { className: "characterLevel" },
                " Level: ",
                character.level = 1,
                " "
            ),
            React.createElement("input", { type: "hidden", name: "_id", value: character._id }),
            React.createElement("input", { className: "makeCharacterLevel", type: "submit", value: "Level-Up Character(Not Working)" }),
            React.createElement("input", { className: "deleteCharacter", type: "submit", value: "Delete Character(Not Working)" })
        );
    });

    return React.createElement(
        "div",
        { className: "characterList" },
        characterNodes
    );
};

var setup = function setup(csrf) {
    CharacterFormClass = React.createClass({
        displayName: "CharacterFormClass",

        handleSubmit: handleCharacter,
        render: renderCharacter
    });

    CharacterListClass = React.createClass({
        displayName: "CharacterListClass",

        loadCharactersFromServer: function loadCharactersFromServer() {
            sendAjax('GET', '/getCharacters', null, function (data) {
                this.setState({ data: data.characters });
            }.bind(this));
        },
        getInitialState: function getInitialState() {
            return { data: [] };
        },
        componentDidMount: function componentDidMount() {
            this.loadCharactersFromServer();
        },
        render: renderCharacterList
    });

    characterForm = ReactDOM.render(React.createElement(CharacterFormClass, { csrf: csrf }), document.querySelector("#makeCharacter"));

    characterRenderer = ReactDOM.render(React.createElement(CharacterListClass, null), document.querySelector("#characters"));
};

var getToken = function getToken() {
    sendAjax('GET', '/getToken', null, function (result) {
        setup(result.csrfToken);
    });
};

$(document).ready(function () {
    getToken();
});
"use strict";

var handleError = function handleError(message) {
  $("#errorMessage").text(message);
  $("#characterMessage").animate({ width: 'toggle' }, 350);
};

var redirect = function redirect(response) {
  $("#characterMessage").animate({ width: 'hide' }, 350);
  window.location = response.redirect;
};

var sendAjax = function sendAjax(type, action, data, success) {
  $.ajax({
    cache: false,
    type: type,
    url: action,
    data: data,
    dataType: "json",
    success: success,
    error: function error(xhr, status, _error) {
      var messageObj = JSON.parse(xhr.responseText);
      handleError(messageObj.error);
    }
  });
};
