// globals for audio player
var AUDIO_PLAYER = document.getElementById("audio-player");
var AUDIO_PLAYER_TRACK = document.getElementById("audio-player-track");

// globals for track collection information
var VGM_TRACKS = document.getElementById("vgm-tracks");
var VGM_TRACKS_COLLECTION = VGM_TRACKS.getElementsByTagName('li');
var VGM_TRACKS_COLLECTION_LENGTH = VGM_TRACKS_COLLECTION.length;

// globals for track controls and state information
var FIRST_TRACK = VGM_TRACKS_COLLECTION[0];
var CURRENT_TRACK = FIRST_TRACK;
var NEXT_TRACK = VGM_TRACKS_COLLECTION[1];
var PREVIOUS_TRACKS = new Array();
var PREVIOUS_TRACK_RETURN = false;
const NOW_PLAYING = "playing"; // css class

// set volume defaults, and load the first game track
setAudioDefaults();
loadVGMTrack(chooseRandomTrack());

// choose a random track after a track has finished playing
AUDIO_PLAYER.onended = function() {
	loadVGMTrack(chooseRandomTrack());
};

function setAudioDefaults() {
	
	AUDIO_PLAYER.volume = 0.2;	
}

function chooseRandomTrack() {
		
	do {
		var randomTrackID = Math.floor(Math.random() * VGM_TRACKS_COLLECTION_LENGTH);
	} while (VGM_TRACKS_COLLECTION[randomTrackID].classList.contains(NOW_PLAYING));
	
	return VGM_TRACKS_COLLECTION[randomTrackID];
}

function loadVGMTrack(track) {
	
	// set active track
	CURRENT_TRACK = track;

	// keep state of previous tracks | undefined on first load
	let finishedTrack = VGM_TRACKS.getElementsByClassName(NOW_PLAYING)[0];
	
	if (finishedTrack){
		finishedTrack.classList.remove(NOW_PLAYING);
		
		// Do not add tracks to the array if the listener is returning to previous tracks
		if (!PREVIOUS_TRACK_RETURN) {
			PREVIOUS_TRACKS.push(finishedTrack);
		} else {
			PREVIOUS_TRACK_RETURN = false;
		}
	}

	// set css styling for the active track, and set the next track
	track.classList.add(NOW_PLAYING);
	NEXT_TRACK = VGM_TRACKS.getElementsByClassName(NOW_PLAYING)[0].nextElementSibling;

	// use Media Session API for metadata and media playback interactions
	setMediaSession(track);
	
	// set a background image associated with the track
	setGameBackgroundImage(track.getAttribute("background-path"));
	
	// load track information and re-load the audio player
	AUDIO_PLAYER_TRACK.src = track.getAttribute("data-path");
	AUDIO_PLAYER.load();
}

function setMediaSession(track) {
	
	let trackInfo = track.innerText;			
	let trackInfoArray = trackInfo.split("-");

	let gameTitle = trackInfoArray[0].trim();
	let tracktitle = trackInfoArray[1].trim();

	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: tracktitle,
			artist: gameTitle,	
	  });
	
	navigator.mediaSession.setActionHandler("previoustrack", playPreviousVGMTrack);  
	navigator.mediaSession.setActionHandler("nexttrack", playNextVGMTrack);
	}
}

function setGameBackgroundImage(background) {
	
	document.body.style.backgroundImage = "url('"+background+"')";	
}

function playPreviousVGMTrack() {
	
	PREVIOUS_TRACK_RETURN = true;
	
	if (PREVIOUS_TRACKS.length) {
		loadVGMTrack(PREVIOUS_TRACKS.pop());
	} else {
		loadVGMTrack(CURRENT_TRACK);
	}
}

function playNextVGMTrack() {
	
	if (NEXT_TRACK){
		loadVGMTrack(NEXT_TRACK);
	} else {
		loadVGMTrack(FIRST_TRACK);
	}
}

function changeVolume(increment) {
	
	newIncrement = (AUDIO_PLAYER.volume + increment).toFixed(2);
	
	if (newIncrement >= 0 && newIncrement <= 1){
		AUDIO_PLAYER.volume=newIncrement;
	}
}