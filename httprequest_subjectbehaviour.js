/// <reference path="typings/rx/rx.d.ts" />

// {.... {"no data"}......{"submit"}..... {....... "new data"}......{"submit"}.......{....."new data"}......}.switchLatest()

var behaviorSubject = new Rx.BehaviorSubject(
                             Rx.Observable.just({state: "no data", value: "A"})
                         );

var switchObservable = behaviorSubject.switchLatest();                        

console.log('first observer: init in waiting for data');

// first observer
switchObservable.subscribe(function(data){
    console.log("first observer", data);
},function(data){
    console.error(data);
},function(data){
    console.info(data);
});



// execute doRequest
switchObservable.source.onNext(
                    Rx.Observable.just({state: "submit", value: "A"})
                   );



switchObservable.source.onNext( 
       Rx.Observable.interval(1000)
                    .take(1)
                    .map(function(){ 
                            return {state: "new data", value: "A"};
                    })
 );


console.log('second observer: init in waiting for data');
// second observer                                          
switchObservable.subscribe(function(data){
    console.log("second observer", data);
},function(data){
    console.error(data);
},function(data){
    console.info(data);
});


switchObservable.source.onNext( 
       Rx.Observable.interval(1000)
                    .take(1)
                    .map(function(){ 
                            return {state: "new data", value: "A"};
                    })
 );


setTimeout(function(){
    
    console.log('third observer: init in waiting for data');
    console.time('subscribe third');
    // third observer                                          
    switchObservable.subscribe(function(data){
        console.log("third observer", data);
        console.timeEnd('subscribe third');
    },function(data){
        console.error(data);
    },function(data){
        console.info(data);
    });
}, 1500)


// solution to previour problem
// {.... {"no data"}......{"submit"}..... {....... "end submit"}.{"new data"}.....{"submit"}.......{....."en submit"}.{"new data"}......}.switchLatest()