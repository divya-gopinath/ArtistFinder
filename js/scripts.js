var currentQueryMap;
var accessToken;

var searchAlbums = function (query) {
	$.ajax({
	  url: 'https://api.spotify.com/v1/search',
	  headers: {'Authorization': 'Bearer ' + accessToken},
	  data: {'q':query, 'type':'artist', 'limit':'5'},
	  type: 'GET'
	}).then(function(data) {
	  currentQueryMap = {};
	  $('#artist-table').append("<tr id='test'><th></th><th></th></tr>" + 
	    $.map(data.artists.items, function (artist, index) {
	    	var artistUrl = artist.images;
	    	if(jQuery.isEmptyObject(artistUrl)) { 
	    		artistUrl = 'https://cdn.pixabay.com/photo/2017/02/25/22/04/user-icon-2098873_1280.png';
	    	} else {
	    		artistUrl = artistUrl[0].url; 
	    	}
	    	var artistName = artist.name;
	    	var artistId = artist.id;
	    	currentQueryMap[artistName] = artistId;
	    	return '<tr class="paddedRow"><td>' + '<img src=' + artistUrl + ' style="width:36px;height:36px;">' + '</td><td> <button type="button" id="artistbutton">'  + artistName + '</button></td></tr>';
	    }).join()
      );
	});
};

var getTopTracks = function (artistId) { 
	root = 'https://api.spotify.com/v1/artists/';
	$.ajax({
	  url: root + artistId + '/top-tracks',
	  headers: {'Authorization': 'Bearer ' + accessToken},
	  data: {'country':'US'},
	  type: 'GET'
	}).then(function(data) {
	  $('#player').append(
	    $.map(data.tracks, function (track, index) {
	    	var uri = track.uri;
	    	return '<iframe src="https://open.spotify.com/embed?uri=' + uri + '" width="300" height="80" frameborder="0" allowtransparency="true"></iframe>';
	    }).join()
      );
	});
};

var getToken = function () { 
	var client = 'ZjFhZDFhNjFmODE0NGZiODg1YmJjNzFmMDQ3YzJhZGQ6MDFmNzlhY2M4Yzc3NDI0ZDlmOTgxODE5NTk4NjU5MmE=';
	$.ajax({
	  url: 'https://cors-anywhere.herokuapp.com/https://accounts.spotify.com/api/token', // bypass CORS
	  headers: {'Authorization': 'Basic ' + client},
	  data: { 'grant_type':'client_credentials'},
	  type: 'POST'
	}).then(function(data) {
	  accessToken = data.access_token;
	});
}


$(document).ready(function(){
	getToken();
	$('#button').click(function(){
	    var query = document.getElementById("query").value.toString();
	    $( '#player' ).empty();
	    searchAlbums(query);
	});

	$('.container').on('click', '#artistbutton', function(){
    	var artistName = $(this).text();
    	var artistId = currentQueryMap[artistName];
    	$( '#artist-table' ).empty();
    	getTopTracks(artistId);
	});
});





