# zhadn.github.io
Welcome to Zhadn's VGM Playlist.

# Github pages
GitHub Pages hosts [zhadn.github.io](http://zhadn.github.io/) directly from this repository.

To build the site and make it available on a local server, run `jekyll serve`.

# Media
Images and backgrounds follow different naming conventions.

## Images
All images are `1920x1080` and saved as `.jpeg`.

Images are named per this example:

- `Game`: "Donkey Kong Country"
- `Name`: `donkey-kong-country.jpeg`

## Music
All music files are uploaded in the `.mp3` file format.

Music is named per this example:

- `Game`: "Donkey Kong Country"
- `Title`: "Aquatic Ambience"
- `Name`: `donkey-kong-country_aquatic-ambience.mp3`

Note that `game` and `title` follow the "dash-case" naming scheme and are separated by an underscore (`_`).

## Privacy (Windows)
Before uploading media files, open **Properties**, select **Details**, and then select "Remove Properties and Personal Information". 

On the next dialog, remove any / all properties from the metadata of the file.

# Generating Tracks
`generate-tracks.js` is a custom script that updates the `tracks.json` files in playlist folders.

To automatically generate JSON for any playlist, run the following command from the `scripts` folder:

```
node generate-tracks.js
```

## jsmediatags
This project uses [jsmediatags](https://github.com/aadsm/jsmediatags) to parse the ID3 metadata tags included in `.mp3` files.

`jsmediatags` relies on the [xhr2](https://www.npmjs.com/package/xhr2) package for reading and parsing files, which is why it is included in this project.
