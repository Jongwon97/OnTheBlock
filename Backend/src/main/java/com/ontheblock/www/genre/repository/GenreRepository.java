package com.ontheblock.www.genre.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.ontheblock.www.genre.domain.Genre;

@Repository
public interface GenreRepository extends JpaRepository<Genre, Long> {


}
