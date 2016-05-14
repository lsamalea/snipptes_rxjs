
var NO_DATA = "NO_DATA";
var NEW_SUBMIT = "NEW_SUBMIT";
var DATA = "DATA";

function RepositoryData(state, data){
  this.state = state;
  this.data = data;
}

function Repository(){
  var subjects = {};
  var i = 0;
  function submitQuery(type){  
//     debugger;
    getObservable(type).onNext(new RepositoryData(NEW_SUBMIT, null));
    return setTimeout( function(){
       getObservable(type).onNext( new RepositoryData(DATA, i++));
    }, 1000);
  }
  
  function getObservable(type){
//     debugger;
    if(!subjects[type]){
      subjects[type] = new Rx.BehaviorSubject( new RepositoryData(NO_DATA, null));
    }    
    return subjects[type];    
  }
  
  function getData(type){
    return getObservable(type).next().data;    
  }
  
  function getState(type){
    return getObservable(type).next().state;    
  }
  
  return {
    
    getState: getState,
    getData:  getData,
    getObservable: getObservable,
    submitQuery: submitQuery
  };
}

var repository = new Repository();

repository.getObservable("Employer").subscribe(
    function (x) {         
        console.table('observer1: state: '+x.state+', data: ' + x.data);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });


repository.submitQuery("Employer");

setTimeout( function(){
  repository.submitQuery("Employer");  
}, 1000);


setTimeout( function(){
  console.log("observer2 is going to subscribe");
  
  repository.getObservable("Employer").subscribe(
    function (x) {         
        console.table('observer2: state: '+x.state+', data: ' + x.data);
    },
    function (err) {
        console.log('Error: ' + err);
    },
    function () {
        console.log('Completed');
    });
  
}, 4000);

setTimeout( function(){
  repository.submitQuery("Employer");  
}, 5000);
