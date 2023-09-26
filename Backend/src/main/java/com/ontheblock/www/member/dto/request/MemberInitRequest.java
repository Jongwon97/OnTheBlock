package com.ontheblock.www.member.dto.request;

import com.ontheblock.www.genre.domain.Genre;
import com.ontheblock.www.instrument.domain.Instrument;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class MemberInitRequest {
    Long memberId;
    String nickName;
    List<Instrument> instruments=new ArrayList<>();
    List<Genre> genres=new ArrayList<>();
}
