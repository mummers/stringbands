var mySpreadsheet = 'https://docs.google.com/spreadsheets/d/1xqGTbkgosPqSRCkZ6xKj1c01sRRZkg0qeNeN2hrkFSI/pubhtml?gid=882897653';
var bandsTemplate = Handlebars.compile($('#bands-template').html());

function loadResults() {
  $('#bands').sheetrock({
    url: mySpreadsheet,
    query: "select B,C,D,E order by B asc",
    rowTemplate: bandsTemplate,
    callback: function(error, options, response) {
      if (!error) {
        $('#bands').tablesorter();
        fakeThemes();
      }
    }
  });
}

loadResults();

Handlebars.registerHelper("normalize", function(input) {
  return input.toLowerCase().replace(/ +/g, "+").replace(/\\.+|,.+|'.+/g, "");
});

function fakeThemes(){
  var playerList = [
{name: "band1"},
{name: "band2"},
{name: "band3"},
{name: "band4"},
{name: "band5"},
{name: "band6"},
{name: "band7"},
{name: "band8"},
{name: "band9"},
{name: "band10"},
{name: "band11"},
{name: "band12"},
{name: "band13"},
{name: "band14"},
{name: "band15"},
{name: "band16"},

];

    for (var i = 0; i < playerList.length; i++) {
      var themeList=["Alice In Wonderland","American","Americana","Americana/Bayou","Americana/Rodeo","Angels","Angels And Devils","Animals","Anniversary","Anniversary/Music","Artist","Astronauts","Babies","Bakers","Batman","Bayou","Beach","Beatles","Beauty And The Beast","Bed Time","Beer","Bell Hops","Bells","Birds/Animals","Birds/Animals/Egyptian","Birds/Animals/Music","Birds/Latin/Animals","Birds/Prisoners/Animals","Blue/Sinatra","Bowery","Brazil/Carnival/Latin","British/Mary Poppins","Broadway/Hobos","Bugs","Bunnies/Rabits/Animals","Bunnies/Rabits/Animals/Easter","Cajun/Voodoo","Camping","Candles","Candy","Cards","Carnival","Carnivale/Animals/Latin","Cars","Cartoon","Casino","Cats/Animals","Cats/Jungle/Animals","Cavaliers","Cavalry And Native American Indians","Cavemen/Prehistoric","Celebration","Celebrity","Celebrity/Elvis","Celebrity/Music/Spike Jones","Celebrity/Theatre","Chefs","Children","Church Revival","Circus","City","Civil War","Classical","Cleaning","Clocks","Clowns","Clowns/Classical","Coffee","College","Colonial","Colonial/Mummers","Color","Construction","Cornucopia","Cowboys","Cowboys And Native American Indians","Dance","Devils","Disney","Disney Villains","Dixieland","Doctors","Dogs/Animals","Dolls","Dreams","Ducks/Animals","Earth","Egyptian","Egyptian/Mummies","Elves","Enchanted Forest","Ethnic/Alaskan","Ethnic/Arabian","Ethnic/Asian","Ethnic/Australian","Ethnic/Bulgarian","Ethnic/Canadian","Ethnic/Chinese","Ethnic/Dutch","Ethnic/English","Ethnic/French","Ethnic/German","Ethnic/Greek","Ethnic/India","Ethnic/Irish","Ethnic/Islander","Ethnic/Italian","Ethnic/Japanese","Ethnic/Jewish","Ethnic/Lithuanian","Ethnic/Mexican","Ethnic/Monacan","Ethnic/Multicultural","Ethnic/Native American Indians","Ethnic/Oriental","Ethnic/Polynesian","Ethnic/Roman","Ethnic/Russian","Ethnic/Scottish","Ethnic/Slavic","Ethnic/Spanish","Ethnic/Swiss","Ethnic/Tibetan","Ethnic/Turkish","Ethnic/Ukrainian","Eyes","Fans","Fantasy","Farmers/Farm/Barynard","Fiddler On The Roof","Fifties","Fire","Firemen","Fish/Mobsters/Gangsters","Fish/Sea","Fisherman","Flowers","Food","Food Around the World","Fountains","Fruit","Future","Gangs","Gangs/Music","Ghost Cowboys","Ghosts/Ghouls/Scary/Haunted/Monsters","Girls","Gnomes","Gold Miners","Golf","Greek Gods","Gypsy","Happy","Hats","Haunted Carnival","Haunted Disco","Haunted Farm","Haunted/Trains","Hawaiian","Hawaiian/Polynesian","Hearts","Hillbilly/Hillbillies","Hippies","Hobos","Holiday","Hotel","Hungary/Medieval","Hunters","Inatimate","Inatimate/Bedtime","Irish/Christmas","Jesters","Jewels","Jockey","Jokers","Jungle","Jungle/Mayan/Aztec","Jurassic Park","Keystone Kops","Kites","Knights","Lamps","Las Vegas","Latin/Fruit","Latin/Rio/Brazil","Love","Lumberjacks","Mad Scientist","Magic","Marching Band","Mardi Gras","Margaritaville","Masks/Masquerade","Masquerade","Masquerade Ball","Merry-Go-Round","Mexican Day Of The Dead","Military","Military/Army","Mimes","Minstrels","Minstrels/Southern","Mobsters/Gangsters","Money","Monkeys/Animals","Monopoly Game","Monsters","Monsters Inc.","Moon","Moon/Music","Mother","Motor Cyclists","Movies","Movies/Musicals","Mummers","Mummers/French/Canadian/Ethnic","Music","Music/Bandstand","Music/Classical","Music/Disco","Music/Motown","Music/Polkas","Music/Ragtime","Musical Instruments","Musketeers","Mystery","Nashville","Navy","Neverland","Nuns","Outdoors","Outer Space","Outer Space/Aliens","Pacific/Polynesian","Painters","Parade","Party","Patriotic","Pilgrims","Pirates","Polynesia","Prisoners","Puppets","Puppets/Marionettes","Rainbows","Red Garter","Religion","Riverboat/Riverside","Robin Hood","Robots","Rodeo Clowns","Romans","Romeo And Juliet","Royalty","Scarecrows","Seasons","Senior Citizens","Shakesphere","Shoes","Show","Show/Broadway","Show/Musicals","Show/Wizard Of Oz","Showboat","Sinatra","Smurfs","Southern","Southern/Bayou","Southern/Minstrels","Spies","Sports","Sports/Baseball","Sports/Boxing","Sports/Chess"];
      randomtheme = chance.pickone(themeList);
            var player = document.getElementById("band" + (i + 1));
            var playerscore = document.getElementById('band' + (i + 1) + "score")
            playerscore.innerText = randomtheme;

    }

}
