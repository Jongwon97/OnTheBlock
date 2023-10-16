import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Thumbnail, EmptyMsgContainer } from "@/components";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styled from "styled-components";
import Logo from "@/assets/logo_white.png";

function ThumbnailSwiper({ videoList, emptyMsg }) {
  return (
    <Swiper
      style={{
        paddingBottom: "10px",
        "--swiper-pagination-color": "#FFBA08",
        "--swiper-pagination-bullet-inactive-color": "#999999",
        "--swiper-pagination-bullet-inactive-opacity": "1",
        "--swiper-pagination-bullet-size": "0.5em",
        "--swiper-pagination-bullet-horizontal-gap": "0.3em",
      }}
      modules={[Pagination, Scrollbar, A11y]}
      spaceBetween={30}
      slidesPerView={3}
      scrollbar={{ draggable: true }}
    >
      {videoList &&
        videoList.map((video) => (
          <SwiperSlide key={video.videoId}>
            <Thumbnail videoData={video} />
          </SwiperSlide>
        ))}
      {(!videoList || videoList.length === 0) && (
        <EmptyMsgContainer emptyMsg={emptyMsg} height="200px"/>
      )}
    </Swiper>
  );
}

const S = {
};

export default ThumbnailSwiper;