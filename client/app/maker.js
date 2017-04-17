let domoRenderer;   // Domo Renderer component
let domoForm;       // Domo Add Form Render Component
let DomoFormClass;  // Domo Form React UI class
let DomoListClass;  // Domo List React UI class

const handleDomo = (e) => {
    e.preventDefault();
    
    $("#domoMessage").animate({width:'hide'},350);
    
    // NEWLY ADDED || $("#domoJob").val() == ''
    if($("#domoName").val() == '' || $("#domoAge").val() == '' || $("#domoJob").val() == '') { 
        handleError("RAWR! All fields are required");
        return false;
    }
    
    sendAjax('POST', $("#domoForm").attr("action"), $("#domoForm").serialize(), function() {
       domoRenderer.loadDomosFromServer(); 
    });
    
    return false;
};

const renderDomo = function() {
  return (
    <form id="domoForm"
        onSubmit={this.handleSubmit}
        name="domoForm"
        action="/maker"
        method="POST"
        className="domoForm"
    >
        <label htmlFor="name">Name: </label>
        <input id="domoName" type="text" name="name" placeholder="Domo Name"/>
        <label htmlFor="age">Age: </label>
        <input id="domoAge" type="text" name="age" placeholder="Domo Age"/>
        <label htmlFor="job">Age: </label>                                      
        <input id="domoJob" type="text" name="job" placeholder="Domo Job"/> 
        <input type="hidden" name="_csrf" value={this.props.csrf} />
        <input className="makeDomoSubmit" type="submit" value="Make Domo" />
      </form>
  );
};// NEWLY ADDED PLUS ^


const renderDomoList = function() {
    if(this.state.data.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos yet</h3>
            </div>
        );
    }
    
    const domoNodes = this.state.data.map(function(domo) {
        return (
            //<div key={domo._id} className="domo" method="POST">
            <div key={domo._id} className="domo">
              <img src="/assets/img/domoface.jpeg" alt="domo face" className="domoFace" />
              <h3 className="domoName"> Name: {domo.name} </h3>
              <h3 className="domoAge"> Age: {domo.age} </h3>
              <h3 className="domoJob"> Job: {domo.job} </h3>
              <h3 className="domoLevel"> Level: {domo.level=1} </h3>
              <input type="hidden" name="_id" value={domo._id} />
              <input className="makeDomoLevel" type="submit" value="Level-Up Domo" />
            </div>        
        );                  
    });// NEWLY ADDED ^ className="domoJob">  className="domoLevel"> Pt1.
    
    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};


const setup = function(csrf) {
    DomoFormClass = React.createClass({
       handleSubmit: handleDomo,
       render: renderDomo,
    });
    
    DomoListClass = React.createClass({
       loadDomosFromServer: function() {
         sendAjax('GET','/getDomos',null, function(data) {
            this.setState({data:data.domos}); 
         }.bind(this));
       },
       getInitialState: function() {
         return {data: []};  
       },
       componentDidMount: function() {
         this.loadDomosFromServer();  
       },
        render: renderDomoList
    });
    
    domoForm = ReactDOM.render(
        <DomoFormClass csrf={csrf} />, document.querySelector("#makeDomo")
    );
    
    domoRenderer = ReactDOM.render(
        <DomoListClass />, document.querySelector("#domos")
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









