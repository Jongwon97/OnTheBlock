package com.ontheblock.www.song.domain;

import com.ontheblock.www.song.dto.SongRequest;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "song_id")
    private Long id;

    private String genre;

    private float danceability;

    private float energy;

    private float instrumentalness;

    private float liveness;

    private float loudness;

    private float speechiness;

    private float acousticness;

    private float tempo;

    private float valence;

    private int popular;

    private int year;

    @Column(nullable = false)
    private String name;    // 곡 이름

    @Column(nullable = false)
    private String code; // 스포티파이에서 id

    @Column(nullable = false)
    private String artist; // 가수
}
