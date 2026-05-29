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
public class QuestionResponse {
    private Long id;
    private String content;
    private QuestionType questionType;
    private List<AnswerResponse> answers;
}
