var AUDIO_PLAYER = document.getElementById("audio-player");
var VGM_TRACK = document.getElementById("vgm-track");
const NOW_PLAYING = "playing";

setAudioDefaults();
playVGMTrack(chooseRandomTrack());

AUDIO_PLAYER.onended = function() {
	playVGMTrack(chooseRandomTrack());
};

function playVGMTrack(track) {
	
	let lastPlayedTrack = document.getElementsByClassName(NOW_PLAYING)[0];
	
	if (lastPlayedTrack){
		lastPlayedTrack.classList.remove(NOW_PLAYING);
	}

	track.classList.add(NOW_PLAYING);
	VGM_TRACK.src = track.getAttribute("data-path");
	
	manageMediaControls(track);
	
	AUDIO_PLAYER.load();
	
	setGameBackgroundImage(track.getAttribute("background-path"));
}

function chooseRandomTrack() {
	
	let vgmTracks = document.getElementById("vgm-tracks");
	let listOfTracks = vgmTracks.getElementsByTagName('li');
	let numberOfTracks = listOfTracks.length;
	
	do {
		var randomTrackID = Math.floor(Math.random() * numberOfTracks);
	} while (listOfTracks[randomTrackID].classList.contains(NOW_PLAYING));
	
	return listOfTracks[randomTrackID];
}

function setGameBackgroundImage(background) {
	
	document.body.style.backgroundImage = "url('"+background+"')";	
}

function setAudioDefaults() {
	
	AUDIO_PLAYER.volume = 0.2;	
}

function manageMediaControls(track) {
	
	let trackInfo = track.innerText;			
	let trackInfoArray = trackInfo.split("-");

	let gameTitle = trackInfoArray[0].trim();
	let tracktitle = trackInfoArray[1].trim();

	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: tracktitle,
			artist: gameTitle,	
	  });
	}
}

function changeVolume(increment) {
	
	console.log("START: " + AUDIO_PLAYER.volume);
	newIncrement = (AUDIO_PLAYER.volume + increment).toFixed(2);
	
	if (newIncrement >= 0 && newIncrement <= 1){
		AUDIO_PLAYER.volume=newIncrement;
		console.log("END:"
		+
		AUDIO_PLAYER.volume);
	}
}
