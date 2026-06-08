package com.javamastery.dto;

import com.javamastery.entity.QuestionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminQuizDto {
    private Long id;
    private Long lessonId;
    private String title;
    private List<AdminQuestionDto> questions;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminQuestionDto {
        private Long id;
        private String content;
        private String explanation;
        private QuestionType questionType;
        private List<AdminAnswerDto> answers;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AdminAnswerDto {
        private Long id;
        private String answerText;
        private boolean correct;
    }
}
