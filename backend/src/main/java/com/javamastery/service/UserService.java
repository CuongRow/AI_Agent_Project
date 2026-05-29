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
