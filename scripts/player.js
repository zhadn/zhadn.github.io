// globals for audio player
var AUDIO_PLAYER = document.getElementById("audio-player");
var AUDIO_PLAYER_TRACK = document.getElementById("audio-player-track");
var MOBILE = false;

// globals for track collection information
var VGM_TRACKS = document.getElementById("vgm-tracks");
var VGM_TRACKS_COLLECTION = [];
var VGM_TRACKS_COLLECTION_LENGTH = 0;

// globals for track controls and state information
var FIRST_TRACK = {};
var CURRENT_TRACK = {};
var NEXT_TRACK = {};
var PREVIOUS_TRACKS = [];
var PREVIOUS_TRACK_RETURN = false;

// globals for button controls
var PLAY_BUTTON = document.getElementById("play");
var MUTE_BUTTON = document.getElementById("mute");
var VOLUME_UP_BUTTON = document.getElementById("volume-up");
var VOLUME_DOWN_BUTTON = document.getElementById("volume-down");
var LOOP_BUTTON = document.getElementById("loop");
var PLAYLIST_BUTTON = document.getElementById("playlist");

// global text constants
var SITE_TITLE = document.getElementById("title");
const ZVGM_TITLE_TEXT = "Zhadn's VGM Playlist"
const COMMUNITY_TITLE_TEXT = "Zhadn's Community Playlist"
const PLAY_BUTTON_TEXT = "Play"; 
const PAUSE_BUTTON_TEXT = "Pause";
const MUTE_BUTTON_TEXT = "Mute";
const UNMUTE_BUTTON_TEXT = "Unmute";
const LOOP_BUTTON_TEXT = "Loop"
const LOOPING_BUTTON_TEXT = "Stop Looping"

// global path constants
const MUSIC_PATH = "media/music/"
const ZVGM_MUSIC_PATH = "media/music/zhadn/"
const COMMUNITY_MUSIC_PATH = "media/music/community/"
const BACKGROUND_PATH = "media/images/backgrounds/"

// CSS constants
const PLAYING = "playing";
const LOOPING = "looping"; 

// Playlists
const ZVGM_PLAYLIST_PATH = ZVGM_MUSIC_PATH + "tracks.json";
const COMMUNITY_PLAYLIST_PATH = COMMUNITY_MUSIC_PATH + "tracks.json";
var SWITCH_ZVGM = false;

// set volume defaults, and load the first game track
setAudioDefaults();
loadPlaylist();

// choose a random track after a track has finished playing
AUDIO_PLAYER.onended = function() {
	loadVGMTrack(chooseRandomTrack());
};

// control text of play / pause button
AUDIO_PLAYER.onplay = function() { PLAY_BUTTON.innerText = PAUSE_BUTTON_TEXT; };
AUDIO_PLAYER.onpause = function() { PLAY_BUTTON.innerText = PLAY_BUTTON_TEXT; };

// control display of volume control buttons
AUDIO_PLAYER.onvolumechange = function() {

	// allow volume controls when muted to set state to unmuted
	if (AUDIO_PLAYER.muted == 1) {
		AUDIO_PLAYER.muted = true;
		MUTE_BUTTON.innerText = UNMUTE_BUTTON_TEXT;
	} else {
		MUTE_BUTTON.innerText = MUTE_BUTTON_TEXT;
	}	
	
	// disable volume control increment at max volume 
	if (AUDIO_PLAYER.volume == 1) {
		VOLUME_UP_BUTTON.disabled = true;

		// custom mute controls at max volume
		if (AUDIO_PLAYER.muted == 1) {
			MUTE_BUTTON.innerText = UNMUTE_BUTTON_TEXT;
		}
	} else {
		VOLUME_UP_BUTTON.disabled = false;
	}

	// disable volume controls at min volume 
	if (AUDIO_PLAYER.volume == 0) {
		VOLUME_DOWN_BUTTON.disabled = true;

		// custom mute controls at min volume
		AUDIO_PLAYER.muted = true;
		MUTE_BUTTON.innerText = UNMUTE_BUTTON_TEXT;
	} else {
		VOLUME_DOWN_BUTTON.disabled = false;
	}
};

function setAudioDefaults() {
	
	// check the user agent string to set a different experience for mobile devices
	const user_agent = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
	if (user_agent.test(navigator.userAgent)) { MOBILE = true };

	// set a default volume for the audio player
	AUDIO_PLAYER.volume = 0.2;	
}

function loadPlaylist() {
	
	if (!SWITCH_ZVGM) {
		fetch(ZVGM_PLAYLIST_PATH, {
			method: 'GET',
		})
		.then(response => response.json())
		.then((data) => {
			buildPlaylist(data, ZVGM_MUSIC_PATH);
			SWITCH_ZVGM = true;
		});
	} else {
		fetch(COMMUNITY_PLAYLIST_PATH, {
			method: 'GET',
		})
		.then(response => response.json())
		.then((data) => {
			buildPlaylist(data, COMMUNITY_MUSIC_PATH);
			SWITCH_ZVGM = false;
		});	
	}
}

function buildPlaylist(playlistData, musicPath) {

	let firstElement = VGM_TRACKS.firstElementChild;
	
	while (firstElement) {	
        firstElement.remove();
        firstElement = VGM_TRACKS.firstElementChild;
    }

	for (trackObject of playlistData) {
		
		let trackElement = document.createElement("li");
		let spanElement = document.createElement("span");

		trackElement.setAttribute("data-title", trackObject.title);
		trackElement.setAttribute("data-game", trackObject.game);
		trackElement.setAttribute("data-composer", trackObject.composer);
		trackElement.setAttribute("data-year", trackObject.year);		
		trackElement.setAttribute("data-music-path", musicPath + trackObject.src);
		trackElement.setAttribute("data-background-path", BACKGROUND_PATH + trackObject.background);
		
		spanElement.innerText = trackObject.game + ": " + trackObject.title;

		trackElement.addEventListener("click", 
			function (e) {
				trackClick(e);
			});
		
		if (MOBILE) {
			trackElement.appendChild(spanElement);
		} else {
			// Add additional track information, like composer and year, for desktop devices
			let spanInformationElement = document.createElement("span");
			spanInformationElement.innerText = trackObject.composer + ", " + trackObject.year;
			spanInformationElement.style.fontStyle = "italic";

			// Justify the left content (game, title) from the right content (composer[s], year)
			trackElement.style.justifyContent = "space-between";

			trackElement.appendChild(spanElement);
			trackElement.appendChild(spanInformationElement);
		}
		VGM_TRACKS.appendChild(trackElement);
	}
	

	VGM_TRACKS_COLLECTION = VGM_TRACKS.getElementsByTagName('li');
	VGM_TRACKS_COLLECTION_LENGTH = VGM_TRACKS_COLLECTION.length;
	
	FIRST_TRACK = VGM_TRACKS_COLLECTION[0];
	CURRENT_TRACK = FIRST_TRACK;;
	NEXT_TRACK = VGM_TRACKS_COLLECTION[1];
	
	loadVGMTrack(chooseRandomTrack());
}

function chooseRandomTrack() {
	
	do {
		var randomTrackID = Math.floor(Math.random() * VGM_TRACKS_COLLECTION_LENGTH);
	} while (VGM_TRACKS_COLLECTION[randomTrackID].classList.contains(PLAYING));
	
	return VGM_TRACKS_COLLECTION[randomTrackID];
}

function loadVGMTrack(track) {
	
	// set active track
	CURRENT_TRACK = track;
	
	// keep state of previous tracks | undefined on first load
	let finishedTrack = VGM_TRACKS.getElementsByClassName(PLAYING)[0];
	
	if (finishedTrack){
		finishedTrack.classList.remove(PLAYING);
		clearLoopingLogic(finishedTrack);
		
		// do not add tracks to the array if the listener returns to previous tracks
		if (!PREVIOUS_TRACK_RETURN) {
			PREVIOUS_TRACKS.push(finishedTrack);
			} else {
			PREVIOUS_TRACK_RETURN = false;
		}
	}
	
	// set css styling for the active track, and set the next track
	track.classList.add(PLAYING);
	NEXT_TRACK = VGM_TRACKS.getElementsByClassName(PLAYING)[0].nextElementSibling;
	
	// use Media Session API for metadata and media playback interactions
	setMediaSession(track);
	
	// set a background image associated with the track
	setGameBackgroundImage(track.getAttribute("data-background-path"));
	
	// load track information and re-load the audio player
	AUDIO_PLAYER_TRACK.src = track.getAttribute("data-music-path");
	AUDIO_PLAYER.load();
}

function setMediaSession(track) {
	
	if ('mediaSession' in navigator) {
		navigator.mediaSession.metadata = new MediaMetadata({
			title: track.getAttribute("data-title"),
			artist: track.getAttribute("data-game"),
		});
		
		navigator.mediaSession.setActionHandler("previoustrack", playPreviousVGMTrack);  
		navigator.mediaSession.setActionHandler("nexttrack", playNextVGMTrack);
	}
}

function setGameBackgroundImage(background) {
	
	document.body.style.backgroundImage = `url(${background})`;

	if (MOBILE) {
		// increase size of background images on mobile devices
		document.body.style.backgroundSize = `400% 400%`;
	} else {
		document.body.style.backgroundSize = `cover`;
	}
}

function trackClick(e) {
	
	loadVGMTrack(e.currentTarget);
}

function playPauseVGMTrack() {
	
	if (AUDIO_PLAYER.paused) {
		AUDIO_PLAYER.play();
		} else {
		AUDIO_PLAYER.pause();
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
			AUDIO_PLAYER.volume = 0.2;
		}
	}
}

function changeVolume(dt) {
	
	// unmute audio when volume controls change
	if (AUDIO_PLAYER.muted == 1) { AUDIO_PLAYER.muted = 0};

	let volumeChange = AUDIO_PLAYER.volume + dt;
	let newVolume = volumeChange.toFixed(2);
	
	// add volume dt according to +/- volume controls
	if (newVolume >= 0 && newVolume <= 1){
		AUDIO_PLAYER.volume = newVolume;
	} 

	// set volume to 0 for negative decrements on ~0.01 to ~0.04 
	if (newVolume <= 0) { AUDIO_PLAYER.volume = 0; }
	
	// set volume to 1 for positive increments on ~0.96 to ~0.99  
	if (newVolume >= 1) { AUDIO_PLAYER.volume = 1; }
}

function loopVGMTrack() {
	
	if (!AUDIO_PLAYER.loop) {
		AUDIO_PLAYER.loop = !AUDIO_PLAYER.loop;
		CURRENT_TRACK.classList.add(LOOPING);
		LOOP_BUTTON.innerText = LOOPING_BUTTON_TEXT;
		} else {
		AUDIO_PLAYER.loop = !AUDIO_PLAYER.loop;
		CURRENT_TRACK.classList.remove(LOOPING);
		LOOP_BUTTON.innerText = LOOP_BUTTON_TEXT;
	}
}

function changePlaylist() {
	
	loadPlaylist();
	
	if (SWITCH_ZVGM) {
		SITE_TITLE.firstChild.innerText = COMMUNITY_TITLE_TEXT;
		PLAYLIST_BUTTON.innerText = ZVGM_TITLE_TEXT;
	} else  {
		SITE_TITLE.firstChild.innerText = ZVGM_TITLE_TEXT;
		PLAYLIST_BUTTON.innerText = COMMUNITY_TITLE_TEXT;
	}
}

function clearLoopingLogic(finishedTrack) {
	
	finishedTrack.classList.remove(LOOPING);
	LOOP_BUTTON.innerText = LOOP_BUTTON_TEXT;
	AUDIO_PLAYER.loop = false;
}