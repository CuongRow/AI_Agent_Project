package com.javamastery.controller;

import com.javamastery.dto.BookmarkResponse;
import com.javamastery.dto.QuizHistoryResponse;
import com.javamastery.dto.StudentDashboardResponse;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.BookmarkService;
import com.javamastery.service.ProgressService;
import com.javamastery.service.QuizService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
@RequiredArgsConstructor
public class StudentController {

    private final ProgressService progressService;
    private final BookmarkService bookmarkService;
    private final QuizService quizService;

    @GetMapping("/dashboard")
    public ResponseEntity<StudentDashboardResponse> getDashboard(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(progressService.getStudentDashboard(userPrincipal.getId()));
    }

    @GetMapping("/quiz-history")
    public ResponseEntity<QuizHistoryResponse> getQuizHistory(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        return ResponseEntity.ok(quizService.getQuizHistory(userPrincipal.getId()));
    }

    @PostMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<Map<String, String>> markComplete(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        progressService.markLessonCompleted(userPrincipal.getId(), lessonId);
        return ResponseEntity.ok(Map.of("message", "Lesson marked as completed"));
    }

    @DeleteMapping("/lessons/{lessonId}/complete")
    public ResponseEntity<Map<String, String>> markIncomplete(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        progressService.markLessonIncomplete(userPrincipal.getId(), lessonId);
        return ResponseEntity.ok(Map.of("message", "Lesson marked as incomplete"));
    }

    @PostMapping("/lessons/{lessonId}/bookmark")
    public ResponseEntity<BookmarkResponse> toggleBookmark(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        BookmarkResponse response = bookmarkService.toggleBookmark(userPrincipal.getId(), lessonId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/bookmarks")
    public ResponseEntity<Page<BookmarkResponse>> getBookmarks(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PageableDefault(size = 10) Pageable pageable) {
        return ResponseEntity.ok(bookmarkService.getUserBookmarks(userPrincipal.getId(), pageable));
    }
}
