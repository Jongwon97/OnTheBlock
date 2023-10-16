package com.ontheblock.www.genre.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.ontheblock.www.genre.domain.Genre;
import com.ontheblock.www.genre.domain.MemberGenre;
import com.ontheblock.www.genre.repository.GenreRepository;
import com.ontheblock.www.genre.repository.MemberGenreRepository;
import com.ontheblock.www.member.Member;
import com.ontheblock.www.member.repository.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberGenreService {

	private final MemberRepository memberRepository;
	private final GenreRepository genreRepository;
	private final MemberGenreRepository memberGenreRepository;

	// 모든 Genre 조회해서 반환
	@Transactional
	public List<Genre> getAllGenres() {
		return genreRepository.findAll();
	}

	// 관심있는 장르 등록 - MemberGenre
	@Transactional
	public void addMemberGenre(Long memberId, List<Genre> genres) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("No such user exists"));

		// 해당 멤버의 MemberGenre 다 삭제
		List<MemberGenre> memberGenres = memberGenreRepository.findByMember(member);
		if (memberGenres != null) {
			memberGenreRepository.deleteAll(memberGenres);
		}
		// 새로 등록
		List<MemberGenre> newMemberGenres = new ArrayList<>();
		for (Genre genre : genres) {
			MemberGenre memberGenre = MemberGenre.builder()
				.member(member)
				.genre(genre)
				.build();
			newMemberGenres.add(memberGenre);
		}
		memberGenreRepository.saveAll(newMemberGenres);
	}

	// 멤버별 관심 장르목록 조회
	@Transactional
	public List<Genre> getMemberGenre(Long memberId) {
		Member member = memberRepository.findById(memberId)
			.orElseThrow(() -> new IllegalArgumentException("No such user exists"));
		List<MemberGenre> memberGenres = memberGenreRepository.findByMemberGenres(member);
		// 불러온 memberGenres 가 비어있는 경우
		if (!memberGenres.isEmpty()) {
			List<Genre> genres = new ArrayList<>();
			for (MemberGenre m : memberGenres) {
				genres.add(new Genre(m));
			}
			return genres;
		} else {
			return null;
		}
	}

}
