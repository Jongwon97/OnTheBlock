package com.ontheblock.www.member;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

@Getter
@Entity
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="member_id")
    private Long id;

    private String email;
    private String description;
    private String token;
}
