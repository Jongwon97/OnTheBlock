import { client, clientWithToken } from "./client";

const SongURL = 'song/';

export const getSongByName = (songName) => {
    return clientWithToken().get(SongURL + 'name/check', { params: { songName }});

};



