package com.javamastery.controller;

import com.javamastery.dto.QuizResponse;
import com.javamastery.dto.QuizResultResponse;
import com.javamastery.dto.QuizSubmissionRequest;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.QuizService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class QuizController {

    private final QuizService quizService;

    @GetMapping("/lessons/{lessonId}/quizzes")
    public ResponseEntity<List<QuizResponse>> getQuizzesByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(quizService.getQuizzesByLesson(lessonId));
    }

    @GetMapping("/quizzes/{id}")
    public ResponseEntity<QuizResponse> getQuizById(@PathVariable Long id) {
        return ResponseEntity.ok(quizService.getQuizById(id));
    }

    @PostMapping("/quizzes/submit")
    public ResponseEntity<QuizResultResponse> submitQuiz(
            @Valid @RequestBody QuizSubmissionRequest submissionRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = userPrincipal != null ? userPrincipal.getId() : null;
        return ResponseEntity.ok(quizService.submitQuiz(submissionRequest, userId));
    }
}
