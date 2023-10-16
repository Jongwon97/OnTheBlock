package com.ontheblock.www.comment.repository;

import com.ontheblock.www.comment.domain.Comment;
import com.ontheblock.www.comment.dto.CommentResponse;
import com.ontheblock.www.video.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    @Query("select new com.ontheblock.www.comment.dto.CommentResponse(c) from Comment c join fetch c.member where c.video = :video")
    List<CommentResponse> findCommentsByVideo(@Param("video")Video video);
}
