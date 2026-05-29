package com.javamastery.service;

import com.javamastery.dto.*;
import com.javamastery.entity.User;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.mapper.UserMapper;
import com.javamastery.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final ProgressRepository progressRepository;
    private final BookmarkRepository bookmarkRepository;
    private final UserMapper userMapper;

    @Transactional(readOnly = true)
    public AnalyticsResponse getAnalytics() {
        long totalUsers = userRepository.count();
        long totalCourses = courseRepository.count();
        long totalLessons = lessonRepository.count();
        long totalQuizzes = quizRepository.count();
        long totalQuestions = questionRepository.count();

        long totalProgress = progressRepository.count();
        long completedProgress = progressRepository.findAll().stream()
                .filter(p -> p.isCompleted())
                .count();
        double overallCompletionRate = totalProgress > 0
                ? (double) completedProgress / totalProgress * 100.0
                : 0.0;

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalLessons(totalLessons)
                .totalQuizzes(totalQuizzes)
                .totalQuestions(totalQuestions)
                .overallCompletionRate(overallCompletionRate)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
                .map(userMapper::toResponse);
    }

    @Transactional
    public void toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }
}
