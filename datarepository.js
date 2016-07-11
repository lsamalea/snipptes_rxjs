/// <reference path="typings/rx/rx.d.ts" />

var DATASTATE_NO_DATA = "NO_DATA";
var DATASTATE_HTTP_REQUEST = "HTTP_REQUEST";
var DATASTATE_DATA = "DATA";
var DATASTATE_ERROR = "ERROR";

function RepositoryData(state, data){
  this.state = state;
  this.data = data;
}

function Repository(){
  var observables = {};
  
  function getObservable(type){
//     debugger;
    if(!observables[type]){
      var subject = new Rx.BehaviorSubject( new RepositoryData(DATASTATE_NO_DATA, null));
      observables[type] = subject.asObservable();
    }    
    return observables[type];    
  }
  
  function getData(type){
    return getObservable(type).next().data;    
  }
  
  function getState(type){
    return getObservable(type).next().state;    
  }

  function setData(type, data){
    if(data){
      getObservable(type).source.onNext( new RepositoryData(DATASTATE_DATA, data));
    }else{
      getObservable(type).source.onNext( new RepositoryData(DATASTATE_NO_DATA, data));
    }
        
  }

  function setDataErr(type, err){
      getObservable(type).source.onNext( new RepositoryData(DATASTATE_ERROR, err));
  }

  function subscribe(type, observer){
      return getObservable(type).subscribe(observer);
  }

 function httpRequest(httpconfig){
    
    setData(new RepositoryData(DATASTATE_HTTP_REQUEST, ''));

    httpconfig.url = resolveUrl(httpconfig.url);

    return new Rx.Observable.create(function(observer){
            var interval = setTimeout(function(){
                observer.onError("Error: no server response data for :" + httpconfig.url);
                //observer.onNext("server response data for :" + httpconfig.url);
                //observer.onCompleted();
            },1000);

            return {
                dispose: function(){
                    clearTimeout(interval);
                }    
            };
    });
}

  
  return {
    
    getState: getState,
    getData:  getData,
    setData:  setData,
    setDataErr: setDataErr,
    getObservable: getObservable ,
    subscribe: subscribe,
    httpRequest: httpRequest   
  };
}


