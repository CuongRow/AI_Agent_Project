package com.javamastery.controller;

import com.javamastery.dto.LessonResponse;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.LessonService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LessonController {

    private final LessonService lessonService;

    @GetMapping("/courses/{courseId}/lessons")
    public ResponseEntity<Page<LessonResponse>> getLessonsByCourse(
            @PathVariable Long courseId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PageableDefault(size = 10) Pageable pageable) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(lessonService.getLessonsByCourse(courseId, userId, pageable));
    }

    @GetMapping("/lessons/{id}")
    public ResponseEntity<LessonResponse> getLessonById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = (userPrincipal != null) ? userPrincipal.getId() : null;
        return ResponseEntity.ok(lessonService.getLessonById(id, userId));
    }
}
