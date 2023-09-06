package com.ontheblock.www.videowatch.repository;

import com.ontheblock.www.videowatch.domain.VideoWatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VideoWatchRepository extends JpaRepository< VideoWatch, Long> {
}
