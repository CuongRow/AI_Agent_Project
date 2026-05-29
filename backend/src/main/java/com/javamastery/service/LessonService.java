package com.javamastery.service;

import com.javamastery.dto.LessonResponse;
import com.javamastery.entity.Lesson;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.mapper.LessonMapper;
import com.javamastery.repository.BookmarkRepository;
import com.javamastery.repository.LessonRepository;
import com.javamastery.repository.ProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LessonService {

    private final LessonRepository lessonRepository;
    private final ProgressRepository progressRepository;
    private final BookmarkRepository bookmarkRepository;
    private final LessonMapper lessonMapper;

    @Transactional(readOnly = true)
    public Page<LessonResponse> getLessonsByCourse(Long courseId, Long userId, Pageable pageable) {
        return lessonRepository.findByCourseId(courseId, pageable)
                .map(lesson -> enrichLessonResponse(lesson, userId));
    }

    @Transactional(readOnly = true)
    public LessonResponse getLessonById(Long id, Long userId) {
        Lesson lesson = lessonRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + id));
        return enrichLessonResponse(lesson, userId);
    }

    private LessonResponse enrichLessonResponse(Lesson lesson, Long userId) {
        LessonResponse response = lessonMapper.toResponse(lesson);
        if (userId != null) {
            response.setCompleted(
                progressRepository.findByUserIdAndLessonId(userId, lesson.getId())
                    .map(p -> p.isCompleted())
                    .orElse(false)
            );
            response.setBookmarked(
                bookmarkRepository.existsByUserIdAndLessonId(userId, lesson.getId())
            );
        }
        return response;
    }
}
