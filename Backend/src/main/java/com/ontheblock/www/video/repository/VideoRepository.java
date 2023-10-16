package com.ontheblock.www.video.repository;

import com.ontheblock.www.member.Member;
import com.ontheblock.www.video.domain.Video;
import com.ontheblock.www.video.dto.VideoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VideoRepository extends JpaRepository<Video, Long> {

    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from Video v order by v.createdTime desc limit 5")
    List<VideoResponse> findLatestVideos(); // 생성일자(createdTime)를 기준으로 내림차순 정렬하여 상위 5개를 조회

    // Video 조회시 member, comments도 함께 조회(fetch join)
    @Query("select v from Video v join fetch v.member m left join fetch v.comments c left join fetch c.member left join fetch v.song where v.id = :videoId order by c.createdTime desc")
    Optional<Video> findVideoByIdWithComments(@Param("videoId") Long videoId);

    // Video 제목 검색 조회
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from Video v join fetch v.member left join fetch v.song where v.name like :keyword order by v.watchCount desc")
    List<VideoResponse> findVideosBySearch(@Param("keyword") String keyword);

    //  합주할 Video 제목 검색 조회(합주한 인원이 5명 이하인 Video만 조회)
    @Query("select distinct v " +
            "from Video v " +
            "join fetch v.member m " +
            "join fetch v.videoSessions vs " +
            "left join fetch v.song s "+
            "where v.name like :keyword " +
            "and v in  (select vs2.video from VideoSession vs2 group by vs2.video having count(vs2.video) < 5)"+
            "order by v.watchCount desc"
    )
    List<Video> findVideosBySearchForCompose(@Param("keyword") String keyword);

    // follow한 유저의 최신 업로드 Video 리스트 조회
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v)" +
            " from MemberFollow mf" +
            " join mf.following f" +
            " join f.videos v" +
            " join fetch v.member m left join fetch v.song" +
            " where mf.follower = :member" +
            " order by v.createdTime desc limit 5")
    List<VideoResponse> findVideosByFollower(@Param("member") Member member);

    // 유저가 시청한 Video 조회
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from VideoWatch vw join vw.video v join fetch v.member m left join fetch v.song where vw.member = :member")
    List<VideoResponse> findVideosByWatch(@Param("member") Member member);

    // 유저가 좋아요 누른 Video 조회
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from VideoLike vl join vl.video v join fetch v.member m left join fetch v.song where vl.member = :member")
    List<VideoResponse> findVideosByLike(@Param("member") Member member);

    // 유저가 업로드한 Video 조회
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from Video v join fetch v.member m left join fetch v.song where v.member = :member")
    List<VideoResponse> findVideosByMyUpload(@Param("member") Member member);

    //추천 영상 Video list
    @Query("select distinct new com.ontheblock.www.video.dto.VideoResponse(v) from Video v join fetch v.member m left join fetch v.song where v.id in :recommend")
    List<VideoResponse> findVideosByRecommend(@Param("recommend") List<Long> recommend);

    //검색 영상 Video list
    @Query("select new com.ontheblock.www.video.dto.VideoResponse(v) from Video v where v.id in :search")
    List<VideoResponse> findVideosBySearch(@Param("search") List<Long> search);
}
