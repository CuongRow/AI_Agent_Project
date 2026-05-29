package com.javamastery.service;

import com.javamastery.dto.*;
import com.javamastery.entity.Answer;
import com.javamastery.entity.Question;
import com.javamastery.entity.Quiz;
import com.javamastery.entity.QuizAttempt;
import com.javamastery.entity.User;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.mapper.QuizMapper;
import com.javamastery.repository.QuizAttemptRepository;
import com.javamastery.repository.QuizRepository;
import com.javamastery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizService {

    private final QuizRepository quizRepository;
    private final QuizMapper quizMapper;
    private final QuizAttemptRepository quizAttemptRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public QuizResponse getQuizById(Long id) {
        Quiz quiz = quizRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + id));
        return quizMapper.toResponse(quiz);
    }

    @Transactional(readOnly = true)
    public List<QuizResponse> getQuizzesByLesson(Long lessonId) {
        return quizMapper.toResponseList(quizRepository.findByLessonId(lessonId));
    }

    @Transactional
    public QuizResultResponse submitQuiz(QuizSubmissionRequest submission, Long userId) {
        Quiz quiz = quizRepository.findById(submission.getQuizId())
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + submission.getQuizId()));

        // Build a map of questionId -> Question for quick lookup
        Map<Long, Question> questionMap = quiz.getQuestions().stream()
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<QuizResultResponse.QuestionResult> questionResults = new ArrayList<>();
        int correctCount = 0;

        for (QuizSubmissionRequest.QuestionAnswerSelection selection : submission.getSelections()) {
            Question question = questionMap.get(selection.getQuestionId());
            if (question == null) {
                throw new BadRequestException("Question with id " + selection.getQuestionId()
                        + " does not belong to quiz " + quiz.getId());
            }

            // Get correct answer IDs for this question
            Set<Long> correctAnswerIds = question.getAnswers().stream()
                    .filter(Answer::isCorrect)
                    .map(Answer::getId)
                    .collect(Collectors.toSet());

            Set<Long> selectedIds = selection.getSelectedAnswerIds();
            boolean isCorrect = correctAnswerIds.equals(selectedIds);

            if (isCorrect) {
                correctCount++;
            }

            questionResults.add(QuizResultResponse.QuestionResult.builder()
                    .questionId(question.getId())
                    .correct(isCorrect)
                    .selectedAnswerIds(selectedIds)
                    .correctAnswerIds(correctAnswerIds)
                    .explanation(question.getExplanation())
                    .build());
        }

        int totalQuestions = quiz.getQuestions().size();
        double score = totalQuestions > 0 ? (double) correctCount / totalQuestions * 100.0 : 0.0;
        double passingScore = 70.0;
        boolean passed = score >= passingScore;

        // Save quiz attempt for history tracking
        if (userId != null) {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

            QuizAttempt attempt = QuizAttempt.builder()
                    .user(user)
                    .quiz(quiz)
                    .score(score)
                    .totalQuestions(totalQuestions)
                    .correctAnswers(correctCount)
                    .passed(passed)
                    .timeSpentSeconds(submission.getTimeSpentSeconds())
                    .attemptedAt(LocalDateTime.now())
                    .build();

            quizAttemptRepository.save(attempt);
        }

        return QuizResultResponse.builder()
                .quizId(quiz.getId())
                .score(score)
                .passingScore(passingScore)
                .passed(passed)
                .questions(questionResults)
                .build();
    }

    @Transactional(readOnly = true)
    public QuizHistoryResponse getQuizHistory(Long userId) {
        long totalAttempts = quizAttemptRepository.countByUserId(userId);

        if (totalAttempts == 0) {
            return QuizHistoryResponse.builder()
                    .totalAttempts(0)
                    .averageScore(0)
                    .highestScore(0)
                    .passRate(0)
                    .recentAttempts(Collections.emptyList())
                    .scoreDistribution(buildEmptyDistribution())
                    .build();
        }

        double averageScore = quizAttemptRepository.findAverageScoreByUserId(userId);
        double highestScore = quizAttemptRepository.findMaxScoreByUserId(userId);
        long passedCount = quizAttemptRepository.countByUserIdAndPassedTrue(userId);
        double passRate = totalAttempts > 0 ? (double) passedCount / totalAttempts * 100.0 : 0.0;

        List<QuizAttempt> recentAttempts = quizAttemptRepository.findTop10ByUserIdOrderByAttemptedAtDesc(userId);

        List<QuizAttemptResponse> attemptResponses = recentAttempts.stream()
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

        // Score distribution
        Map<String, Long> scoreDistribution = new LinkedHashMap<>();
        scoreDistribution.put("0-40", quizAttemptRepository.countByUserIdAndScoreBetween(userId, 0, 40));
        scoreDistribution.put("40-60", quizAttemptRepository.countByUserIdAndScoreBetween(userId, 40, 60));
        scoreDistribution.put("60-80", quizAttemptRepository.countByUserIdAndScoreBetween(userId, 60, 80));
        scoreDistribution.put("80-100", quizAttemptRepository.countByUserIdAndScoreGreaterThanEqual(userId, 80));

        return QuizHistoryResponse.builder()
                .totalAttempts(totalAttempts)
                .averageScore(Math.round(averageScore * 10.0) / 10.0)
                .highestScore(Math.round(highestScore * 10.0) / 10.0)
                .passRate(Math.round(passRate * 10.0) / 10.0)
                .recentAttempts(attemptResponses)
                .scoreDistribution(scoreDistribution)
                .build();
    }

    private Map<String, Long> buildEmptyDistribution() {
        Map<String, Long> dist = new LinkedHashMap<>();
        dist.put("0-40", 0L);
        dist.put("40-60", 0L);
        dist.put("60-80", 0L);
        dist.put("80-100", 0L);
        return dist;
    }
}
