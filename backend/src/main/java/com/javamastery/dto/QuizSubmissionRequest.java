package com.javamastery.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;
import java.util.Set;

@Data
public class QuizSubmissionRequest {

    @NotNull(message = "Quiz ID is required")
    private Long quizId;

    @NotEmpty(message = "Answers selection cannot be empty")
    private List<QuestionAnswerSelection> selections;

    // Optional: time the user spent on this quiz in seconds
    private Integer timeSpentSeconds;

    @Data
    public static class QuestionAnswerSelection {
        @NotNull(message = "Question ID is required")
        private Long questionId;

        @NotEmpty(message = "At least one selected answer ID is required")
        private Set<Long> selectedAnswerIds;
    }
}
