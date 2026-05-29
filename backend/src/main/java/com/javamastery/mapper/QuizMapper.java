package com.javamastery.mapper;

import com.javamastery.dto.AnswerResponse;
import com.javamastery.dto.QuestionResponse;
import com.javamastery.dto.QuizResponse;
import com.javamastery.entity.Answer;
import com.javamastery.entity.Question;
import com.javamastery.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface QuizMapper {

    @Mapping(target = "lessonId", source = "lesson.id")
    QuizResponse toResponse(Quiz quiz);

    QuestionResponse toQuestionResponse(Question question);

    AnswerResponse toAnswerResponse(Answer answer);

    List<QuizResponse> toResponseList(List<Quiz> quizzes);
}
