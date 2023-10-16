import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Thumbnail } from "@/components";
import "swiper/css";
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import styled from "styled-components";

// ThumbnailSwiper로 완전히 대체된거면 삭제요망.
function ThumbnailContainer() {
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
      <SwiperSlide style={{ cursor: "pointer" }}>
        <Thumbnail/>
      </SwiperSlide>
      <SwiperSlide style={{ cursor: "pointer" }}>
        <Thumbnail/>
      </SwiperSlide>
      <SwiperSlide style={{ cursor: "pointer" }}>
        <Thumbnail/>
      </SwiperSlide>
    </Swiper>
  );
}

const S = {
  
}

export default ThumbnailContainer;