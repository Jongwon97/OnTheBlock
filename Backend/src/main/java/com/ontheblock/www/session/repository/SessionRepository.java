package com.ontheblock.www.session.repository;

import com.ontheblock.www.session.domain.Session;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SessionRepository extends JpaRepository<Session, Long> {

}
