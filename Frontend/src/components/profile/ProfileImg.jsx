import styled from "styled-components";
import { CgProfile as ProfileIcon } from "react-icons/cg";

const stringToHslColor = (str, s, l) => {
var hash = 0;
for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
}

var h = hash % 360;
var result = "hsl(" + h + ", " + s + "%, " + l + "%)";
return result;
}

function ProfileImg({nickName, size}) {
    return (
      <>
        {nickName ? (
          <S.GeneratedProfileImg
            style={{
              backgroundColor: stringToHslColor(nickName, 80, 50),
              minWidth: `${size}px`,
              minHeight: `${size}px`,
              maxWidth: `${size}px`,
              maxHeight: `${size}px`,
            }}
          >
            <div style={{ fontSize: `${size / 2}px` }}>
              {nickName.charAt(0)}
            </div>
          </S.GeneratedProfileImg>
        ) : (
          <ProfileIcon size={size} color="#d7d7d7" />
        )}
      </>
    );
}

const S = {
  GeneratedProfileImg: styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    border: 3px solid #eee;
    border-radius: 50%;
    color: white;
  `,
};

export default ProfileImg;