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
var PREVIOUS_TRACKS = [];
var PREVIOUS_TRACK_RETURN = false;

// globals for button controls
var PLAY_BUTTON = document.getElementById("play");
var MUTE_BUTTON = document.getElementById("mute");
var VOLUME_UP_BUTTON = document.getElementById("volume-up");
var VOLUME_DOWN_BUTTON = document.getElementById("volume-down");

// global constants
const NOW_PLAYING = "playing"; // css class
const PLAY_BUTTON_TEXT = "Play"; 
const PAUSE_BUTTON_TEXT = "Pause";
const MUTE_BUTTON_TEXT = "Mute";
const UNMUTE_BUTTON_TEXT = "Unmute";

// set volume defaults, and load the first game track
setAudioDefaults();
loadVGMTrack(chooseRandomTrack());

// choose a random track after a track has finished playing
AUDIO_PLAYER.onended = function() {
	loadVGMTrack(chooseRandomTrack());
};

// control display of volume control buttons
AUDIO_PLAYER.onvolumechange = function() {
		
	// disable volume control increment at max volume 
	if (AUDIO_PLAYER.volume == 1) {
		VOLUME_UP_BUTTON.disabled = true;
	} else {
		VOLUME_UP_BUTTON.disabled = false;
	}
	
	// disable volume controls at min volume 
	if (AUDIO_PLAYER.volume == 0 || AUDIO_PLAYER.muted) {
		AUDIO_PLAYER.muted = true;
		MUTE_BUTTON.innerText = UNMUTE_BUTTON_TEXT;
		VOLUME_UP_BUTTON.disabled = true;
		VOLUME_DOWN_BUTTON.disabled = true;
	} else {
		MUTE_BUTTON.innerText = MUTE_BUTTON_TEXT;
		VOLUME_DOWN_BUTTON.disabled = false;
	}
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
	setGameBackgroundImage(track.getAttribute("data-background-path"));
	
	// load track information and re-load the audio player
	AUDIO_PLAYER_TRACK.src = track.getAttribute("data-music-path");
	AUDIO_PLAYER.load();
	
	// ensure play button switched to pause button text
	PLAY_BUTTON.innerText = PAUSE_BUTTON_TEXT;
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

function playVGMTrack() {
	
	if (AUDIO_PLAYER.paused) {
		AUDIO_PLAYER.play();
		PLAY_BUTTON.innerText = PAUSE_BUTTON_TEXT;
	} else {
		AUDIO_PLAYER.pause();
		PLAY_BUTTON.innerText = PLAY_BUTTON_TEXT;
	}
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

function muteVGMPlayer() {
	
	if (!AUDIO_PLAYER.muted) {
		AUDIO_PLAYER.muted = !AUDIO_PLAYER.muted;
	} else {
		AUDIO_PLAYER.muted = !AUDIO_PLAYER.muted;
		
		// set a minimum volume when unmuting the audio player from a muted state
		if (AUDIO_PLAYER.volume == 0) {
			AUDIO_PLAYER.volume = 0.1;
		}
	}
}

function changeVolume(dt) {
	
	let volumeChange = AUDIO_PLAYER.volume + dt;
	let newVolume = volumeChange.toFixed(2);
	
	// add volume dt according to +/- volume controls
	if (newVolume >= 0 && newVolume <= 1){
		AUDIO_PLAYER.volume = newVolume;
	} 
	
	// set volume to 1 for positive increments on ~0.91 to ~0.99  
	if (newVolume >= 1) { AUDIO_PLAYER.volume = 1; }
	
	// set volume to 0 for negative decrements on ~0.01 to ~0.09 
	if (newVolume <= 0) { AUDIO_PLAYER.volume = 0; }
}