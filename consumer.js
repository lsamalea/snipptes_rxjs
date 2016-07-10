$(function(){

    /// <reference path="typings/rx/rx.d.ts" />
    var webendpoint = "Employer";

    var repository = new Repository();


////// consumers of different data changes streams 
    repository.subscribe(webendpoint,{
        onNext: function (x) {         
            console.table('observer1: state: '+x.state+', data: ' + x.data);
        },
        onError: function (err) {
            console.log('Error: ' + err);
        },
        onComplete: function () {
            console.log('Completed');
        }});



//////// click event consumer and responsable of fire http rquest
    var clickStream = Rx.Observable.fromEvent(
                                            document.getElementById("doRequestButton"),
                                            "click"
                                            );


    var httpObservable = clickStream.map(function(){
        // do http request      
        
        var observable = repository.httpRequest({ url: webendpoint});
        return observable.retry(3)
    })
    .switchLatest();


    var subscription = httpObservable.subscribe(
        function (x) {         
            repository.setData(webendpoint, x);
        },
        function (err) {
            console.log('Error: ' + err);
        },
        function () {
            console.log('Completed');
        });



});
