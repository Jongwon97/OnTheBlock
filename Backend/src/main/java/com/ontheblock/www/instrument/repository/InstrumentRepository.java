package com.ontheblock.www.instrument.repository;

import com.ontheblock.www.instrument.domain.MemberInstrument;
import com.ontheblock.www.member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.instrument.domain.Instrument;

import java.util.List;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Long> {

}
