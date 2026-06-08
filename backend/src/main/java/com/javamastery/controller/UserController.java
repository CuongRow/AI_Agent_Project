package com.javamastery.controller;

import com.javamastery.dto.UpdateProfileRequest;
import com.javamastery.dto.UserResponse;
import com.javamastery.security.UserPrincipal;
import org.springframework.web.multipart.MultipartFile;
import com.javamastery.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/profile")
    public ResponseEntity<UserResponse> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        UserResponse response = userService.getUserProfile(userPrincipal.getId());
        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserResponse> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UserResponse response = userService.updateUserProfile(userPrincipal.getId(), request);
        return ResponseEntity.ok(response);
    }
    @PutMapping("/avatar")
    public ResponseEntity<UserResponse> uploadAvatar(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestParam("file") MultipartFile file) {
        UserResponse response = userService.updateUserAvatar(userPrincipal.getId(), file);
        return ResponseEntity.ok(response);
    }
}

