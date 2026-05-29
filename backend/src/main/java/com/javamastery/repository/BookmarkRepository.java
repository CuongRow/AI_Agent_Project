package com.javamastery.repository;

import com.javamastery.entity.Bookmark;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {
    Optional<Bookmark> findByUserIdAndLessonId(Long userId, Long lessonId);
    Page<Bookmark> findByUserId(Long userId, Pageable pageable);
    List<Bookmark> findByUserId(Long userId);
    Boolean existsByUserIdAndLessonId(Long userId, Long lessonId);
}
