const jsmediatags = require("jsmediatags");
const fs = require("fs");
const musicFolder = "../media/music/";
var trackArray = [];

createTracksJSON();

async function createTracksJSON() {
	
	await readTracks();
	writeTracks();
}

async function readTracks() {
	
	let fileList = fs.readdirSync(musicFolder);
	fileList.sort();

	for (const file of fileList) {
		await readID3Tags(file);
	}
}

async function readID3Tags(file) {

	let filePath = musicFolder + file;
	let trackObject = {};

	try {
		let output = await readMetadataAsync(filePath);
		var tags = output.tags;
		let backgroundPath = tags.album.toLowerCase();
		backgroundPath = backgroundPath.replaceAll(" ", "-").replaceAll(":","") + ".jpeg";
		
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

function writeTracks() {

	let trackObjects = JSON.stringify(trackArray, null, 2);

	fs.writeFile('tracks.json', trackObjects, (error) => {
		if (error) throw error;
	});
}