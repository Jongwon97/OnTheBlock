package com.ontheblock.www.videosession.repository;

import com.ontheblock.www.videosession.domain.VideoSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoSessionRepository extends JpaRepository< VideoSession, Long> {
}
