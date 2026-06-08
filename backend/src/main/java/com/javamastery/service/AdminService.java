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

import java.time.LocalDateTime;
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
    private final QuizAttemptRepository quizAttemptRepository;
    private final EmailService emailService;
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

        // Calculate userRegistrationsOverTime
        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd");
        java.util.Map<String, Long> registrations = userRepository.findAllCreatedAtDates().stream()
                .filter(date -> date != null)
                .map(date -> date.format(formatter))
                .collect(Collectors.groupingBy(d -> d, Collectors.counting()));

        return AnalyticsResponse.builder()
                .totalUsers(totalUsers)
                .totalCourses(totalCourses)
                .totalLessons(totalLessons)
                .totalQuizzes(totalQuizzes)
                .totalQuestions(totalQuestions)
                .overallCompletionRate(overallCompletionRate)
                .userRegistrationsOverTime(registrations)
                .build();
    }

    @Transactional(readOnly = true)
    public Page<UserResponse> getAllUsers(Pageable pageable, Boolean enabled) {
        Page<User> usersPage;
        if (enabled != null) {
            usersPage = userRepository.findByEnabled(enabled, pageable);
        } else {
            usersPage = userRepository.findAll(pageable);
        }
        return usersPage.map(userMapper::toResponse);
    }

    @Transactional
    public void toggleUserEnabled(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        user.setEnabled(!user.isEnabled());
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getInactiveStudents() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);
        List<User> inactive = userRepository.findInactiveStudents(cutoffDate);
        return inactive.stream().map(userMapper::toResponse).collect(Collectors.toList());
    }

    @Transactional
    public void remindStudent(Long studentId) {
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + studentId));
        String subject = "We miss you at JavaMastery!";
        String body = "Hi " + student.getUsername() + ",\n\nIt's been a while since you last studied. Come back and continue learning Java!";
        emailService.sendEmail(student.getEmail(), subject, body);
    }

    @Transactional(readOnly = true)
    public List<StudentProgressResponse> getStudentsProgress() {
        List<User> students = userRepository.findAllStudents();
        return students.stream().map(student -> {
            long completedLessons = progressRepository.countByUserIdAndCompletedTrue(student.getId());
            double averageScore = quizAttemptRepository.findAverageScoreByUserId(student.getId());
            
            List<QuizAttemptResponse> attempts = quizAttemptRepository.findByUserIdOrderByAttemptedAtDesc(student.getId())
                    .stream()
                    .map(attempt -> QuizAttemptResponse.builder()
                            .id(attempt.getId())
                            .quizId(attempt.getQuiz().getId())
                            .quizTitle(attempt.getQuiz().getTitle())
                            .courseName(attempt.getQuiz().getLesson() != null 
                                    && attempt.getQuiz().getLesson().getCourse() != null 
                                    ? attempt.getQuiz().getLesson().getCourse().getTitle() 
                                    : "N/A")
                            .score(attempt.getScore())
                            .totalQuestions(attempt.getTotalQuestions())
                            .correctAnswers(attempt.getCorrectAnswers())
                            .passed(attempt.isPassed())
                            .timeSpentSeconds(attempt.getTimeSpentSeconds())
                            .attemptedAt(attempt.getAttemptedAt())
                            .build())
                    .collect(Collectors.toList());

            return StudentProgressResponse.builder()
                    .id(student.getId())
                    .username(student.getUsername())
                    .email(student.getEmail())
                    .lastActiveAt(student.getLastActiveAt())
                    .enabled(student.isEnabled())
                    .avatarUrl(student.getAvatarUrl())
                    .completedLessonsCount(completedLessons)
                    .averageQuizScore(Math.round(averageScore * 10.0) / 10.0)
                    .quizAttempts(attempts)
                    .build();
        }).collect(Collectors.toList());
    }
}
