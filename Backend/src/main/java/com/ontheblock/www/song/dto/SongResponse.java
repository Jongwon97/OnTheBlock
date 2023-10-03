package com.ontheblock.www.song.dto;

import com.ontheblock.www.song.domain.Song;
import lombok.Data;

@Data
public class SongResponse {
    String name;
    String code;
    String artist;

    public SongResponse(Song song){
        this.name=song.getName();
        this.code=song.getCode();
        this.artist=song.getArtist();
    }
}
