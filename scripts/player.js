var AUDIO_PLAYER = document.getElementById("audio-player");
var VGM_TRACK = document.getElementById("vgm-track");
const NOW_PLAYING = "playing";

setAudioDefaults();
loadVGMTrack(chooseRandomTrack());

AUDIO_PLAYER.onended = function() {
	loadVGMTrack(chooseRandomTrack());
};

function loadVGMTrack(track) {
	
	let currentTrack = document.getElementsByClassName(NOW_PLAYING)[0];
	
	if (currentTrack){
		currentTrack.classList.remove(NOW_PLAYING);
	}

	track.classList.add(NOW_PLAYING);
	VGM_TRACK.src = track.getAttribute("data-path");
	
	manageMediaControls(track);
	
	AUDIO_PLAYER.load();
	
	setGameBackgroundImage(track.getAttribute("background-path"));
}

// Unused
function restartVGMTrack() {
	
	let currentTrack = document.getElementsByClassName(NOW_PLAYING)[0];
	
	if (currentTrack){
		let nextTrack = currentTrack.nextSibling;
		loadVGMTrack(currentTrack);
	}
}

function playNextVGMTrack() {
	
	let vgmTracks = document.getElementById("vgm-tracks");
	let firstTrack = vgmTracks.getElementsByTagName('li')[0];
	let nextTrack = vgmTracks.getElementsByClassName(NOW_PLAYING)[0].nextElementSibling;
	
	if (nextTrack){
		loadVGMTrack(nextTrack);
	} else {
		loadVGMTrack(firstTrack);
	}
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
	  
	  navigator.mediaSession.setActionHandler('nexttrack', () => playNextVGMTrack());
	}
}

function changeVolume(increment) {
	
	newIncrement = (AUDIO_PLAYER.volume + increment).toFixed(2);
	
	if (newIncrement >= 0 && newIncrement <= 1){
		AUDIO_PLAYER.volume=newIncrement;
	}
}
