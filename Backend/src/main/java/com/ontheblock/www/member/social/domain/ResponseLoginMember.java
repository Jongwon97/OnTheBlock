package com.ontheblock.www.member.social.domain;

import com.ontheblock.www.member.Member;
import lombok.Data;

@Data
public class ResponseLoginMember {
    private Long memberId;
    private String nickname;
    private int isNewMember;

    public ResponseLoginMember(Member member, int isNewMember){
        this.memberId=member.getId();
        this.nickname=member.getNickName();
        this.isNewMember=isNewMember;
    }
}
