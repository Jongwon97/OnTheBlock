package com.ontheblock.www.song.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ontheblock.www.song.domain.Song;
import com.ontheblock.www.song.service.SongService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/song")
public class SongController {

	private final SongService songService;

	@GetMapping("/name/check")
	public List<Song> getSongsByName(@RequestParam String songName) {
		return songService.getSongsByName(songName);
	}



}
