package com.ontheblock.www.instrument.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.instrument.domain.Instrument;

@Repository
public interface InstrumentRepository extends JpaRepository<Instrument, Integer> {

}
