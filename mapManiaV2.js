var myMap;

class setLocation {
  constructor(title, cords, info) {
    this.title = title;
    this.cords = cords;
    this.info = info;
  }
}

var romeoville = new setLocation(
  "Romeoville",
  {lat: 41.648,lng: -88.090},
  "Nothing special, just my home town",
)

var wonderLake = new setLocation(
  "Wonder Lake",
  {lat: 42.393,lng: -88.353},
  "I would come to Wonder Lake every year for a family reunion, and I just think its so beautiful.",
)

var artOfAnimation = new setLocation(
  "Disney Art of Animation",
  {lat: 28.350,lng: -81.549},
  "I have been to Disney World twice, and have always stayed at the Art of Animation.",
)

var shedd = new setLocation(
  "The Shedd Aquarium",
  {lat: 41.868,lng: -87.614},
  "I have always loved visiting the Shedd. I have always loved fish, and the Shedd is a great place to see them.",
)

var zoo = new setLocation(
  "Brookfield Zoo",
  {lat: 41.834,lng: -87.830},
  "Having one of the largest zoos in America so close by has been wonderful. I specifically set the latlng to a statue of the Walrus Olga, as it is one of my favorite places at the zoo",
)
var braidwood = new setLocation(
  "Braidwood",
  {lat: 41.834,lng: -88.220},
  "Nothing super special here either, this is just where I currently live with my Girlfriend",
)

var ampitheatre = new setLocation(
  "Hollywood Casino Ampitheatre",
  {lat: 41.544,lng: -87.777},
  "I have seen so many great concerts here: Ozzy Osbourne, Black Sabbath, Iron Maiden, Slipknot, Lamb of God, to name a few",
)

var forge = new setLocation(
  "The Forge",
  {lat: 41.328,lng: -88.082},
  "A small venue that I have seen plenty of great bands at: Cattle Decapitation, Suffocation, Trivium, Ensiferum, and many others",
)

var sevenBridges = new setLocation(
  "Cinemark at 7 Bridges",
  {lat: 41.768,lng: -88.070},
  "Not a luxuary theatre, but this is my go to theatre. 7 Bridges has one of the best imax screens around, its nearby, and it has the best ticket prices",
)

var animalKingdom = new setLocation(
  "Disney world Animal Kingdom",
  {lat: 28.357,lng:-81.590},
  "The first time I went to Animal Kingdom, it was one of the few times that I felt awe. The nature theme is beautiful, and my first visit I walked into a Macaw show, and it was amazing.",
)

var locationArray = [romeoville, braidwood, wonderLake, animalKingdom, artOfAnimation, sevenBridges, forge, ampitheatre, zoo, shedd]
var center;
var testMarker;
var marker;
var i;
var score = 0;
var scanLimit = 10;

//this is the function that intializes the map element
function initMap() {
  myMap = new google.maps.Map(document.getElementById("mapDiv"), {
    center: { lat: 41.768, lng: -88.070 },
    mapTypeControl: false,
    zoom: 2,
  });
  randomLevel();
  myMap.addListener("zoom_changed",() => {
  })
  myMap.addListener("idle", () => {
    center = myMap.getCenter()
  })
}
//if scanlimit is above 0 it will check the bounds of the map and see if the level is within
function scanArea(){
  if(scanLimit != 0){
    if (myMap.getBounds().contains({lat: locationArray[i].cords.lat,lng: locationArray[i].cords.lng})){
      document.getElementById("scanResults").value = "Location Inbounds"
    }else
      document.getElementById("scanResults").value = "Location Not Inbounds"
    
    scanLimit -= 1;
    document.getElementById("scans").value = "Scans: "+ scanLimit;
  }else
  document.getElementById("scan").disabled = true;
}

//this will select a random location from the array and if there are no leveles left
//it will check the score, and if at least half of the levels are found, then the player wins
//if 4 or less are found, the player loses
function randomLevel(){
  if(locationArray.length != 0){
   i = Math.floor(Math.random() * locationArray.length);
     marker=  new google.maps.Marker({
      position: {lat: locationArray[i].cords.lat,lng: locationArray[i].cords.lng},
      map: myMap,
      visible: false,
     title: locationArray[i].title,
    });
      var infowindow = new google.maps.InfoWindow({
        content: locationArray[i].info
     })
     marker.addListener("click", () =>{
        infowindow.open(myMap,marker);
      })
  } else if(score => 5){
      window.alert("you win");
      document.getElementById("scan").disabled = true;
      document.getElementById("cheat").disabled = true;
      document.getElementById("confirmMarker").disabled = true;
  } else{
    window.alert("You lose");
  }
}

//the following code was added with help of w3c for the modal 
function displayHelp(){
  document.getElementById("helpPopup").style= "display: block";
}

function hideHelp(){
  document.getElementById("helpPopup").style= "display: none";
}
window.onclick = function(event) {
  if (event.target == document.getElementById("helpPopup")) {
    document.getElementById("helpPopup").style= "display: none";
  }
}
//end of w3c code

//place marker and start game
function placeMarker(){
  testMarker = new google.maps.Marker({
    position: {lat: center.lat(),lng: center.lng()},
    map: myMap,
    draggable:true,
    title: "Your marker",
  });
  document.getElementById("startGame").disabled = true;
  document.getElementById("confirmMarker").disabled = false;
  document.getElementById("scan").disabled = false;
  document.getElementById("cheat").disabled = false;
}

//makes the level's location visible, checks the location, disables the the dragging of the level marker
//splices the current level from the array, and starts the next level
function confirmMarker(){
  marker.setVisible(true);
  testMarker.setDraggable(false);
  checkDistance();
  locationArray.splice(i,1);
  placeMarker();
  randomLevel();
}

//if the players marker is within a .100 X .100 lat and lng square, they will score a point
//if not the player does not get a point
//this also resets the scan limit
function checkDistance(){
  var levelLat = Math.abs(Math.floor(locationArray[i].cords.lat*1000));
  var levelLng = Math.abs(Math.floor(locationArray[i].cords.lng*1000));
  var testLat = Math.abs(Math.floor(testMarker.getPosition().lat()*1000));
  var testLng = Math.abs(Math.floor(testMarker.getPosition().lng()*1000));
  var latDistance = Math.abs(levelLat - testLat);
  var lngDistance = Math.abs(levelLng - testLng);
  if ( latDistance<=50 && lngDistance<=50){
    score += 1
    document.getElementById("score").value = "Score: " + score;
  }
  scanLimit = 10;
  document.getElementById("scan").disabled = false;
}
//cheaters function skips the level, and starts the next level
function skipLevel(){
  marker.setVisible(true);
  score += 1;
  document.getElementById("score").value = "Score: " + score;
  locationArray.splice(i,1);
  randomLevel();
}
