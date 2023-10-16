package com.ontheblock.www.genre.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ontheblock.www.genre.domain.Genre;
import com.ontheblock.www.genre.service.MemberGenreService;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/genre")
@RequiredArgsConstructor
public class MemberGenreController {

	private final MemberGenreService memberGenreService;

	// 모든 장르 정보 반환
	@GetMapping("/findAll")
	public ResponseEntity<List<Genre>> getAllGenres() {
		return new ResponseEntity<List<Genre>>(memberGenreService.getAllGenres(), HttpStatus.OK);
	}

	// 멤버별 관심 장르 등록
	@PostMapping("/member/check")
	public ResponseEntity<Void> addMemberGenre(HttpServletRequest request, @RequestBody List<Genre> genres) {
		Long id = (Long)request.getAttribute("id");
		memberGenreService.addMemberGenre(id, genres);
		return ResponseEntity.status(HttpStatus.CREATED).build();
	}

	// 멤버의 관심 장르 목록 조회
	@GetMapping("/get/member/check")
	public ResponseEntity<List<Genre>> getMemberGenre(HttpServletRequest request) {
		Long id = (Long)request.getAttribute("id");
		List<Genre> genres = memberGenreService.getMemberGenre(id);
		if (genres != null) {
			return ResponseEntity.ok(genres);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

}
