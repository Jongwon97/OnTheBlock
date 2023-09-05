package com.ontheblock.www.videolike.repository;

import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.videolike.domain.VideoLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoLikeRepository extends JpaRepository<VideoLike, Long> {
    long countByVideo(Video video);
}
