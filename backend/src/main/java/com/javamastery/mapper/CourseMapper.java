package com.javamastery.mapper;

import com.javamastery.dto.CourseResponse;
import com.javamastery.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CourseMapper {

    @Mapping(target = "lessonCount", source = "lessons", qualifiedByName = "calculateLessonCount")
    CourseResponse toResponse(Course course);

    List<CourseResponse> toResponseList(List<Course> courses);

    @Named("calculateLessonCount")
    default int calculateLessonCount(List<?> lessons) {
        return lessons != null ? lessons.size() : 0;
    }
}
