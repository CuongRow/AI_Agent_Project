package com.javamastery.controller;

import com.javamastery.dto.AdminQuizDto;
import com.javamastery.service.QuizAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
@RequiredArgsConstructor
public class QuizAdminController {

    private final QuizAdminService quizAdminService;

    @GetMapping("/lessons/{lessonId}/quiz")
    public ResponseEntity<AdminQuizDto> getQuizByLessonId(@PathVariable Long lessonId) {
        return ResponseEntity.ok(quizAdminService.getQuizByLessonId(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/quiz")
    public ResponseEntity<AdminQuizDto> saveQuiz(
            @PathVariable Long lessonId,
            @RequestBody AdminQuizDto request) {
        return ResponseEntity.ok(quizAdminService.saveQuiz(lessonId, request));
    }

    @DeleteMapping("/quizzes/{quizId}")
    public ResponseEntity<Map<String, String>> deleteQuiz(@PathVariable Long quizId) {
        quizAdminService.deleteQuiz(quizId);
        return ResponseEntity.ok(Map.of("message", "Quiz deleted successfully"));
    }
}
