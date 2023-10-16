package com.ontheblock.www.videowatch.repository;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.videowatch.domain.VideoWatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VideoWatchRepository extends JpaRepository< VideoWatch, Long> {
    Optional<VideoWatch> findVideoWatchByMemberAndVideo(Member member, Video Video);
}
