package com.javamastery.controller;

import com.javamastery.dto.LessonResponse;
import com.javamastery.service.LessonAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
@RequiredArgsConstructor
public class LessonAdminController {

    private final LessonAdminService lessonAdminService;

    @PostMapping("/courses/{courseId}/lessons")
    public ResponseEntity<LessonResponse> createLesson(
            @PathVariable Long courseId,
            @RequestBody LessonResponse request) {
        return ResponseEntity.ok(lessonAdminService.createLesson(courseId, request));
    }

    @PutMapping("/lessons/{lessonId}")
    public ResponseEntity<LessonResponse> updateLesson(
            @PathVariable Long lessonId,
            @RequestBody LessonResponse request) {
        return ResponseEntity.ok(lessonAdminService.updateLesson(lessonId, request));
    }

    @DeleteMapping("/lessons/{lessonId}")
    public ResponseEntity<Map<String, String>> deleteLesson(@PathVariable Long lessonId) {
        lessonAdminService.deleteLesson(lessonId);
        return ResponseEntity.ok(Map.of("message", "Lesson deleted successfully"));
    }

    @PostMapping(value = "/lessons/upload", consumes = org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, String>> uploadMaterial(
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file) {
        String fileUrl = lessonAdminService.uploadMaterial(file);
        return ResponseEntity.ok(Map.of("fileUrl", fileUrl));
    }
}
