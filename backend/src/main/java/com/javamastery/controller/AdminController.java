package com.javamastery.controller;

import com.javamastery.dto.AnalyticsResponse;
import com.javamastery.dto.UserResponse;
import com.javamastery.service.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.javamastery.dto.StudentProgressResponse;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasAnyRole('ADMIN', 'INSTRUCTOR')")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    @GetMapping("/analytics")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AnalyticsResponse> getAnalytics() {
        return ResponseEntity.ok(adminService.getAnalytics());
    }

    @GetMapping("/users")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<UserResponse>> getAllUsers(
            @PageableDefault(size = 10) Pageable pageable,
            @RequestParam(required = false) Boolean enabled) {
        return ResponseEntity.ok(adminService.getAllUsers(pageable, enabled));
    }

    @PostMapping("/users/{userId}/toggle-enabled")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> toggleUserEnabled(@PathVariable Long userId) {
        adminService.toggleUserEnabled(userId);
        return ResponseEntity.ok(Map.of("message", "User status updated successfully"));
    }

    @GetMapping("/inactive-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UserResponse>> getInactiveStudents() {
        return ResponseEntity.ok(adminService.getInactiveStudents());
    }

    @PostMapping("/inactive-students/{studentId}/remind")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> remindStudent(@PathVariable Long studentId) {
        adminService.remindStudent(studentId);
        return ResponseEntity.ok(Map.of("message", "Reminder email sent successfully"));
    }

    @GetMapping("/students/progress")
    public ResponseEntity<List<StudentProgressResponse>> getStudentsProgress() {
        return ResponseEntity.ok(adminService.getStudentsProgress());
    }
}
