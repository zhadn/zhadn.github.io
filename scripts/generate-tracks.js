const jsmediatags = require("jsmediatags");
const fs = require("fs");
const musicFolder = "../media/music";
const jsonFile = "tracks.json";

var trackArray = [];

createTracksJSON();
	
async function createTracksJSON() {
	
	let zhadnMusicFolder = musicFolder + "/zhadn/";
	await readTracks(zhadnMusicFolder);
	writeTracks(zhadnMusicFolder);
	
	let communityMusicFolder = musicFolder + "/community/";
	await readTracks(communityMusicFolder);
	writeTracks(communityMusicFolder);
}

async function readTracks(playlistFolder) {
	
	let fileList = fs.readdirSync(playlistFolder);
	fileList.sort();

	for (const file of fileList) {
		if (file !== jsonFile) {
			await readID3Tags(playlistFolder, file);
		}
	}
}

async function readID3Tags(playlistFolder, file) {

	let filePath = playlistFolder + file;
	let trackObject = {};

	try {
		let output = await readMetadataAsync(filePath);
		var tags = output.tags;
		let backgroundPath = tags.album.toLowerCase();
		backgroundPath = backgroundPath.replaceAll(" ", "-").replaceAll(":","").replaceAll("'","") + ".jpeg";

		trackObject = {
				title: tags.title,
				game: tags.album,
				composer: tags.TCOM.data,
				year: tags.year,
				src: file,
				background: backgroundPath
		};
		trackArray.push(trackObject);
	}
	catch (e) {
		console.log(e.message);
	}
}

function readMetadataAsync(filePath) {

	return new Promise((resolve, reject) => {
		jsmediatags.read(filePath, {
			onSuccess: resolve,
			onError: reject
		});
	});
}

function writeTracks(playlistFolder) {

	let trackObjects = JSON.stringify(trackArray, null, 2);

	fs.writeFile(playlistFolder + jsonFile, trackObjects, (error) => {
		if (error) throw error;
	});
	
	trackArray = [];
}