package com.ontheblock.www.song.repository;

import com.ontheblock.www.song.domain.Song;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SongRepository extends JpaRepository<Song, Long> {

}
