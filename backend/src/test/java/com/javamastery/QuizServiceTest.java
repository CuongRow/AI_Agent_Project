package com.javamastery;

import com.javamastery.dto.QuizResultResponse;
import com.javamastery.dto.QuizSubmissionRequest;
import com.javamastery.entity.*;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.QuizRepository;
import com.javamastery.service.QuizService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class QuizServiceTest {

    @Mock
    private QuizRepository quizRepository;

    @InjectMocks
    private QuizService quizService;

    private Quiz mockQuiz;
    private Question mockQuestion;
    private Answer mockAnswerCorrect;
    private Answer mockAnswerIncorrect;

    @BeforeEach
    void setUp() {
        mockAnswerCorrect = Answer.builder()
                .id(1L)
                .answerText("Correct Answer")
                .isCorrect(true)
                .build();

        mockAnswerIncorrect = Answer.builder()
                .id(2L)
                .answerText("Incorrect Answer")
                .isCorrect(false)
                .build();

        mockQuestion = Question.builder()
                .id(10L)
                .content("Sample Question?")
                .explanation("This is the explanation")
                .questionType(QuestionType.SINGLE_CHOICE)
                .answers(List.of(mockAnswerCorrect, mockAnswerIncorrect))
                .build();

        mockQuiz = Quiz.builder()
                .id(100L)
                .title("Sample Quiz")
                .questions(List.of(mockQuestion))
                .build();
    }

    @Test
    void submitQuiz_AllCorrect_ReturnsPassed() {
        // Arrange
        when(quizRepository.findById(100L)).thenReturn(Optional.of(mockQuiz));

        QuizSubmissionRequest submission = new QuizSubmissionRequest();
        submission.setQuizId(100L);

        QuizSubmissionRequest.QuestionAnswerSelection selection = new QuizSubmissionRequest.QuestionAnswerSelection();
        selection.setQuestionId(10L);
        selection.setSelectedAnswerIds(Set.of(1L)); // Correct Answer ID is 1
        submission.setSelections(List.of(selection));

        // Act
        QuizResultResponse result = quizService.submitQuiz(submission, null);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getQuizId());
        assertEquals(100.0, result.getScore());
        assertTrue(result.isPassed());
        assertEquals(1, result.getQuestions().size());
        assertTrue(result.getQuestions().get(0).isCorrect());
        assertEquals("This is the explanation", result.getQuestions().get(0).getExplanation());
    }

    @Test
    void submitQuiz_Incorrect_ReturnsFailed() {
        // Arrange
        when(quizRepository.findById(100L)).thenReturn(Optional.of(mockQuiz));

        QuizSubmissionRequest submission = new QuizSubmissionRequest();
        submission.setQuizId(100L);

        QuizSubmissionRequest.QuestionAnswerSelection selection = new QuizSubmissionRequest.QuestionAnswerSelection();
        selection.setQuestionId(10L);
        selection.setSelectedAnswerIds(Set.of(2L)); // Incorrect Answer ID is 2
        submission.setSelections(List.of(selection));

        // Act
        QuizResultResponse result = quizService.submitQuiz(submission, null);

        // Assert
        assertNotNull(result);
        assertEquals(100L, result.getQuizId());
        assertEquals(0.0, result.getScore());
        assertFalse(result.isPassed());
        assertEquals(1, result.getQuestions().size());
        assertFalse(result.getQuestions().get(0).isCorrect());
    }

    @Test
    void submitQuiz_QuizNotFound_ThrowsException() {
        // Arrange
        when(quizRepository.findById(999L)).thenReturn(Optional.empty());

        QuizSubmissionRequest submission = new QuizSubmissionRequest();
        submission.setQuizId(999L);

        // Act & Assert
        assertThrows(ResourceNotFoundException.class, () -> quizService.submitQuiz(submission, null));
    }

}
