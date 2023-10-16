package com.ontheblock.www.genre.domain;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity(name = "MusicGenre")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Genre {

	@Id
	@Column(name = "genre_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "genre_name", nullable = false)
	private String genreName;

	public Genre(MemberGenre memberGenre){
		this.id= memberGenre.getGenre().getId();
		this.genreName=memberGenre.getGenre().getGenreName();
	}

}
