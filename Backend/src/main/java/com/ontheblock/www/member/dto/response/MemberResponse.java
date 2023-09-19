package com.ontheblock.www.member.dto.response;

import com.ontheblock.www.member.Member;
import lombok.Data;

@Data
public class MemberResponse {
    Long memberId;
    String nickname;

    public MemberResponse(Member member){
        this.memberId = member.getId();
        this.nickname = member.getNickName();
    }

}
