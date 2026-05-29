package com.javamastery.mapper;

import com.javamastery.dto.LessonResponse;
import com.javamastery.entity.Lesson;
import com.javamastery.entity.Quiz;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LessonMapper {

    @Mapping(target = "courseId", source = "course.id")
    @Mapping(target = "quizId", source = "quizzes", qualifiedByName = "firstQuizId")
    @Mapping(target = "completed", ignore = true)
    @Mapping(target = "bookmarked", ignore = true)
    LessonResponse toResponse(Lesson lesson);

    List<LessonResponse> toResponseList(List<Lesson> lessons);

    @Named("firstQuizId")
    default Long firstQuizId(List<Quiz> quizzes) {
        return (quizzes != null && !quizzes.isEmpty()) ? quizzes.get(0).getId() : null;
    }
}
