package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizAttemptResponse {
    private Long id;
    private Long quizId;
    private String quizTitle;
    private String courseName;
    private double score;
    private int totalQuestions;
    private int correctAnswers;
    private boolean passed;
    private Integer timeSpentSeconds;
    private LocalDateTime attemptedAt;
}
