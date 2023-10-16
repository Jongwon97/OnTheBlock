package com.ontheblock.www.videosession.repository;

import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.videosession.domain.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface VideoSessionRepository extends JpaRepository< VideoSession, Long> {
    @Query("select vs from VideoSession vs join fetch vs.session s join fetch s.member m join fetch s.instrument i where vs.video = :video")
    List<VideoSession> findVideoSessionByVideo(@Param("video") Video video);

}
