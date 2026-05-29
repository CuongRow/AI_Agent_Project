package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizResultResponse {
    private Long quizId;
    private double score;
    @Builder.Default
    private double passingScore = 70.0;
    private boolean passed;
    private List<QuestionResult> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QuestionResult {
        private Long questionId;
        private boolean correct;
        private Set<Long> selectedAnswerIds;
        private Set<Long> correctAnswerIds;
        private String explanation;
    }
}
