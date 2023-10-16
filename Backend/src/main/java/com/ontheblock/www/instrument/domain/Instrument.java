package com.ontheblock.www.instrument.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "Instrument")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Instrument {

	@Id
	@Column(name = "instrument_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "instrument_name", nullable = false)
	private String instrumentName;

	public Instrument(MemberInstrument memberInstrument){
		this.id= memberInstrument.getInstrument().getId();
		this.instrumentName=memberInstrument.getInstrument().getInstrumentName();
	}

}
