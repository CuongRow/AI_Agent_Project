package com.javamastery.repository;

import com.javamastery.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
    Page<User> findByEnabled(boolean enabled, Pageable pageable);

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_STUDENT'")
    List<User> findAllStudents();

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = 'ROLE_STUDENT' AND (u.lastActiveAt IS NULL OR u.lastActiveAt < :cutoffDate)")
    List<User> findInactiveStudents(@Param("cutoffDate") LocalDateTime cutoffDate);

    @Query("SELECT u.createdAt FROM User u")
    List<LocalDateTime> findAllCreatedAtDates();
}
