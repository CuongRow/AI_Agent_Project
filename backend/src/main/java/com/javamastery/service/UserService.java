package com.javamastery.service;

import com.javamastery.dto.UpdateProfileRequest;
import com.javamastery.dto.UserResponse;
import com.javamastery.entity.User;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.mapper.UserMapper;
import com.javamastery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public UserResponse getUserProfile(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return userMapper.toResponse(user);
    }


    @Transactional
    public UserResponse updateUserAvatar(Long userId, org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty!");
        }
        // Validate MIME type
        String contentType = file.getContentType();
        if (contentType == null || (!contentType.equals("image/jpeg") && !contentType.equals("image/png") && !contentType.equals("image/gif") && !contentType.equals("image/webp"))) {
            throw new BadRequestException("Only JPEG, PNG, GIF, and WEBP images are allowed!");
        }
        // Find user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        try {
            String originalFilename = file.getOriginalFilename();
            String extension = (originalFilename != null && originalFilename.contains("."))
                    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                    : ".png";
            String filename = userId + "_" + System.currentTimeMillis() + extension;
            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads/avatars");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }
            // Delete old avatar if exists
            if (user.getAvatarUrl() != null && user.getAvatarUrl().startsWith("/uploads/avatars/")) {
                String oldFile = user.getAvatarUrl().substring(user.getAvatarUrl().lastIndexOf('/') + 1);
                java.nio.file.Files.deleteIfExists(uploadDir.resolve(oldFile));
            }
            java.nio.file.Path target = uploadDir.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            user.setAvatarUrl("/uploads/avatars/" + filename);
            User saved = userRepository.save(user);
            return userMapper.toResponse(saved);
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }

    // Existing methods remain unchanged

    @Transactional
    public UserResponse updateUserProfile(Long userId, UpdateProfileRequest request) {

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if username is changed and already taken
        if (!user.getUsername().equalsIgnoreCase(request.getUsername())) {
            if (userRepository.existsByUsername(request.getUsername())) {
                throw new BadRequestException("Username '" + request.getUsername() + "' is already taken!");
            }
            user.setUsername(request.getUsername());
        }

        // Check if email is changed and already taken
        if (!user.getEmail().equalsIgnoreCase(request.getEmail())) {
            if (userRepository.existsByEmail(request.getEmail())) {
                throw new BadRequestException("Email '" + request.getEmail() + "' is already in use!");
            }
            user.setEmail(request.getEmail());
        }

        // If new password is provided, handle password change
        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getOldPassword() == null || request.getOldPassword().trim().isEmpty()) {
                throw new BadRequestException("Old password is required to change password!");
            }
            if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
                throw new BadRequestException("Old password does not match current password!");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword().trim()));
        }

        User updatedUser = userRepository.save(user);
        return userMapper.toResponse(updatedUser);
    }
}
