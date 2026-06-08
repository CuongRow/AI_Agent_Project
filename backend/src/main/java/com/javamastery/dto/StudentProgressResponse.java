package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentProgressResponse {
    private Long id;
    private String username;
    private String email;
    private LocalDateTime lastActiveAt;
    private boolean enabled;
    private String avatarUrl;
    private long completedLessonsCount;
    private double averageQuizScore;
    private List<QuizAttemptResponse> quizAttempts;
}
