package com.javamastery.controller;

import com.javamastery.dto.DiscussionRequest;
import com.javamastery.dto.DiscussionResponse;
import com.javamastery.security.UserPrincipal;
import com.javamastery.service.DiscussionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class DiscussionController {

    private final DiscussionService discussionService;

    @GetMapping("/lessons/{lessonId}/discussions")
    public ResponseEntity<List<DiscussionResponse>> getDiscussionsByLesson(@PathVariable Long lessonId) {
        return ResponseEntity.ok(discussionService.getDiscussionsByLesson(lessonId));
    }

    @PostMapping("/lessons/{lessonId}/discussions")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<DiscussionResponse> createDiscussion(
            @PathVariable Long lessonId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody DiscussionRequest request) {
        return ResponseEntity.ok(discussionService.createDiscussion(lessonId, userPrincipal.getId(), request));
    }

    @GetMapping("/admin/discussions")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public ResponseEntity<List<DiscussionResponse>> getAllGlobalDiscussions() {
        return ResponseEntity.ok(discussionService.getAllGlobalDiscussions());
    }

    @PostMapping("/admin/discussions/{discussionId}/reply")
    @PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
    public ResponseEntity<DiscussionResponse> replyToDiscussion(
            @PathVariable Long discussionId,
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody DiscussionRequest request) {
        return ResponseEntity.ok(discussionService.replyToDiscussion(discussionId, userPrincipal.getId(), request));
    }
}
