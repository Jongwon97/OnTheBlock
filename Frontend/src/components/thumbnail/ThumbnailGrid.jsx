import { Thumbnail } from "@/components";
import styled from "styled-components";

function ThumbnailGrid({ videoList }) {
  return (
    <S.Grid>
      {videoList &&
        videoList.map((video) => (
          <Thumbnail key={video.videoId} videoData={video}/>
        ))}
    </S.Grid>
  );
}

const S = {
  Grid: styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
  `,
};

export default ThumbnailGrid;
