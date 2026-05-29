package com.javamastery.service;

import com.javamastery.entity.Lesson;
import com.javamastery.entity.Progress;
import com.javamastery.entity.User;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.LessonRepository;
import com.javamastery.repository.ProgressRepository;
import com.javamastery.repository.UserRepository;
import com.javamastery.dto.BookmarkResponse;
import com.javamastery.dto.StudentDashboardResponse;
import com.javamastery.repository.BookmarkRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final BookmarkRepository bookmarkRepository;

    @Transactional(readOnly = true)
    public StudentDashboardResponse getStudentDashboard(Long userId) {
        long completedLessonsCount = progressRepository.countByUserIdAndCompletedTrue(userId);
        long totalLessonsCount = lessonRepository.count();
        double progressPercentage = totalLessonsCount > 0 
                ? (double) completedLessonsCount / totalLessonsCount * 100.0 
                : 0.0;

        List<BookmarkResponse> bookmarkedLessons = bookmarkRepository.findByUserId(userId).stream()
                .map(bookmark -> BookmarkResponse.builder()
                        .id(bookmark.getId())
                        .lessonId(bookmark.getLesson().getId())
                        .lessonTitle(bookmark.getLesson().getTitle())
                        .courseId(bookmark.getLesson().getCourse().getId())
                        .courseTitle(bookmark.getLesson().getCourse().getTitle())
                        .bookmarkedAt(bookmark.getBookmarkedAt())
                        .build())
                .collect(Collectors.toList());

        return StudentDashboardResponse.builder()
                .completedLessonsCount(completedLessonsCount)
                .totalLessonsCount(totalLessonsCount)
                .progressPercentage(progressPercentage)
                .bookmarkedLessons(bookmarkedLessons)
                .build();
    }

    @Transactional
    public void markLessonCompleted(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Progress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElse(Progress.builder()
                        .user(user)
                        .lesson(lesson)
                        .build());

        if (!progress.isCompleted()) {
            progress.setCompleted(true);
            progress.setCompletedAt(LocalDateTime.now());
            progressRepository.save(progress);
        }
    }

    @Transactional
    public void markLessonIncomplete(Long userId, Long lessonId) {
        Progress progress = progressRepository.findByUserIdAndLessonId(userId, lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Progress not found for this lesson"));

        progress.setCompleted(false);
        progress.setCompletedAt(null);
        progressRepository.save(progress);
    }
}
