package com.javamastery.repository;

import com.javamastery.entity.QuizAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, Long> {

    List<QuizAttempt> findByUserIdOrderByAttemptedAtDesc(Long userId);

    List<QuizAttempt> findTop10ByUserIdOrderByAttemptedAtDesc(Long userId);

    List<QuizAttempt> findByUserIdAndQuizIdOrderByAttemptedAtDesc(Long userId, Long quizId);

    long countByUserId(Long userId);

    long countByUserIdAndPassedTrue(Long userId);

    @Query("SELECT COALESCE(AVG(qa.score), 0) FROM QuizAttempt qa WHERE qa.user.id = :userId")
    double findAverageScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT COALESCE(MAX(qa.score), 0) FROM QuizAttempt qa WHERE qa.user.id = :userId")
    double findMaxScoreByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.user.id = :userId AND qa.score >= :minScore AND qa.score < :maxScore")
    long countByUserIdAndScoreBetween(@Param("userId") Long userId, @Param("minScore") double minScore, @Param("maxScore") double maxScore);

    @Query("SELECT COUNT(qa) FROM QuizAttempt qa WHERE qa.user.id = :userId AND qa.score >= :minScore")
    long countByUserIdAndScoreGreaterThanEqual(@Param("userId") Long userId, @Param("minScore") double minScore);
}
