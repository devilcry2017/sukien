

//controller-------------------------------------------------------------------
//category
if(all.ckbCat && all.ckbCat !== ''){
    //delete cat
    const evNewEvent = await EvNewEvent.query().where('news_id', all.id)
    if(evNewEvent.length > 0){
        for (let item2 of evNewEvent){
          const ev = await EvNewEvent.findBy('id', item2.id)
          await ev.delete()
        }
    }

    //add new cat
    for(let val of all.ckbCat) {
       const evNewEvent =  new EvNewEvent()
       evNewEvent.news_id = evNews.id
       evNewEvent.event_id = val
       await evNewEvent.save()
    }
}


const eventAll = await Event.query().where('language_code',session.get('lang_ad')).orderBy('event_sort', 'asc')
                      .fetch()

const evNewEvent = await EvNewEvent.query()
                      .where('news_id',id)
                      .fetch()

async evNewsEditCat({ session, response, params}){
    const id = params.id
    const evNewEvent = await EvNewEvent.query().where('news_id',id)
    response.send(evNewEvent)
}

//views edit-------------------------------------------------------------------
{{lang_ad.ev_cat}}

@raw
<div class="checkbox" ng-repeat="val2 in event">
  <label>
    <input type="checkbox" name="ckbCat" value="{{val2.id}}"
    checklist-model="user.event " checklist-value="val2.id"
    >
    {{val2.event_description}}
  </label>
</div>
@endraw

//anguialer js
app.controller('evNewsCat',function($scope,$rootScope,$http){
    var _csrf = document.querySelector('[name="_csrf"]').value;
    $scope.evNewsCat = [];

    $http.get("/api/v1.0/evNews/events").then(function(res,status,xhr) {
        $scope.evNewsCat = res.data;
    });
    $scope.sort = function(keyname){
        $scope.sortKey = keyname;   //set the sortKey to the param passed
        $scope.reverse = !$scope.reverse; //if true make it false and vice versa
    }
})

$http.get("/api/v1.0/evNews/events").then(function(res,status,xhr) {
    $scope.event = res.data;
});
