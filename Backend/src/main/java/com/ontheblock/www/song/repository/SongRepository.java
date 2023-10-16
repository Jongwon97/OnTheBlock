package com.ontheblock.www.song.repository;

import java.util.List;

import com.ontheblock.www.song.domain.Song;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SongRepository extends JpaRepository<Song, Long> {
	
	// List<Song> findByNameContaining(String name);
	
	// 검색어를 포함하는 곡을 인기도 순으로 조회
	@Query("SELECT s FROM Song s WHERE s.name LIKE %:name% ORDER BY s.popular DESC")
	List<Song> findByNameContaining(@Param("name") String name);
	
	
}
