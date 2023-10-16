package com.ontheblock.www.song.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ontheblock.www.song.domain.Song;
import com.ontheblock.www.song.repository.SongRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SongService {

	private final SongRepository songRepository;

	@Transactional(readOnly = true)
	public List<Song> getSongsByName(String name) {
		if (name.length() < 1) {
			throw new IllegalArgumentException("The name is too short");
		}

		return songRepository.findByNameContaining(name);
	}

}
