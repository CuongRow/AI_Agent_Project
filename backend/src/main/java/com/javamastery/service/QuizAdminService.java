package com.javamastery.service;

import com.javamastery.dto.AdminQuizDto;
import com.javamastery.entity.*;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.LessonRepository;
import com.javamastery.repository.QuizRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuizAdminService {

    private final QuizRepository quizRepository;
    private final LessonRepository lessonRepository;

    @Transactional(readOnly = true)
    public AdminQuizDto getQuizByLessonId(Long lessonId) {
        List<Quiz> quizzes = quizRepository.findByLessonId(lessonId);
        if (quizzes.isEmpty()) {
            return null;
        }
        return convertToDto(quizzes.get(0));
    }

    @Transactional
    public AdminQuizDto saveQuiz(Long lessonId, AdminQuizDto dto) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        Quiz quiz;
        if (dto.getId() != null) {
            quiz = quizRepository.findById(dto.getId())
                    .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + dto.getId()));
            quiz.setTitle(dto.getTitle());
        } else {
            quiz = Quiz.builder()
                    .lesson(lesson)
                    .title(dto.getTitle())
                    .build();
            quiz = quizRepository.save(quiz);
        }

        // Sync questions
        List<Question> existingQuestions = quiz.getQuestions();
        Map<Long, Question> existingQuestionMap = existingQuestions.stream()
                .filter(q -> q.getId() != null)
                .collect(Collectors.toMap(Question::getId, q -> q));

        List<Question> updatedQuestions = new ArrayList<>();
        
        if (dto.getQuestions() != null) {
            for (AdminQuizDto.AdminQuestionDto questionDto : dto.getQuestions()) {
                Question question;
                if (questionDto.getId() != null && existingQuestionMap.containsKey(questionDto.getId())) {
                    question = existingQuestionMap.get(questionDto.getId());
                    question.setContent(questionDto.getContent());
                    question.setExplanation(questionDto.getExplanation());
                    question.setQuestionType(questionDto.getQuestionType());
                } else {
                    question = Question.builder()
                            .quiz(quiz)
                            .content(questionDto.getContent())
                            .explanation(questionDto.getExplanation())
                            .questionType(questionDto.getQuestionType())
                            .build();
                }

                // Sync answers for this question
                List<Answer> existingAnswers = question.getAnswers();
                Map<Long, Answer> existingAnswerMap = existingAnswers.stream()
                        .filter(a -> a.getId() != null)
                        .collect(Collectors.toMap(Answer::getId, a -> a));

                List<Answer> updatedAnswers = new ArrayList<>();
                if (questionDto.getAnswers() != null) {
                    for (AdminQuizDto.AdminAnswerDto answerDto : questionDto.getAnswers()) {
                        Answer answer;
                        if (answerDto.getId() != null && existingAnswerMap.containsKey(answerDto.getId())) {
                            answer = existingAnswerMap.get(answerDto.getId());
                            answer.setAnswerText(answerDto.getAnswerText());
                            answer.setCorrect(answerDto.isCorrect());
                        } else {
                            answer = Answer.builder()
                                    .question(question)
                                    .answerText(answerDto.getAnswerText())
                                    .isCorrect(answerDto.isCorrect())
                                    .build();
                        }
                        updatedAnswers.add(answer);
                    }
                }
                
                question.getAnswers().clear();
                question.getAnswers().addAll(updatedAnswers);
                updatedQuestions.add(question);
            }
        }

        quiz.getQuestions().clear();
        quiz.getQuestions().addAll(updatedQuestions);

        Quiz savedQuiz = quizRepository.save(quiz);
        return convertToDto(savedQuiz);
    }

    @Transactional
    public void deleteQuiz(Long quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));
        quizRepository.delete(quiz);
    }

    private AdminQuizDto convertToDto(Quiz quiz) {
        List<AdminQuizDto.AdminQuestionDto> questionDtos = quiz.getQuestions().stream()
                .map(q -> {
                    List<AdminQuizDto.AdminAnswerDto> answerDtos = q.getAnswers().stream()
                            .map(a -> AdminQuizDto.AdminAnswerDto.builder()
                                    .id(a.getId())
                                    .answerText(a.getAnswerText())
                                    .correct(a.isCorrect())
                                    .build())
                            .collect(Collectors.toList());

                    return AdminQuizDto.AdminQuestionDto.builder()
                            .id(q.getId())
                            .content(q.getContent())
                            .explanation(q.getExplanation())
                            .questionType(q.getQuestionType())
                            .answers(answerDtos)
                            .build();
                })
                .collect(Collectors.toList());

        return AdminQuizDto.builder()
                .id(quiz.getId())
                .lessonId(quiz.getLesson().getId())
                .title(quiz.getTitle())
                .questions(questionDtos)
                .build();
    }
}
