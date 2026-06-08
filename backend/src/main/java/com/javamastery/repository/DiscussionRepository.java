package com.javamastery.repository;

import com.javamastery.entity.Discussion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DiscussionRepository extends JpaRepository<Discussion, Long> {
    
    @Query("SELECT d FROM Discussion d JOIN FETCH d.user u WHERE d.lesson.id = :lessonId AND d.parent IS NULL ORDER BY d.createdAt ASC")
    List<Discussion> findRootDiscussionsByLessonId(@Param("lessonId") Long lessonId);

    @Query("SELECT d FROM Discussion d JOIN FETCH d.user u JOIN FETCH d.lesson l WHERE d.parent IS NULL ORDER BY d.createdAt DESC")
    List<Discussion> findAllRootDiscussionsGlobal();
}
