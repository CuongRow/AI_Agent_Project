package com.javamastery.service;

import com.javamastery.dto.*;
import com.javamastery.entity.RefreshToken;
import com.javamastery.entity.Role;
import com.javamastery.entity.User;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.RoleRepository;
import com.javamastery.repository.UserRepository;
import com.javamastery.security.JwtProvider;
import com.javamastery.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    @Transactional
    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getUsernameOrEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String accessToken = jwtProvider.generateToken(authentication);

        UserPrincipal userPrincipal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findById(userPrincipal.getId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setLastActiveAt(java.time.LocalDateTime.now());
        userRepository.save(user);

        // Create refresh token
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(user.getId());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @Transactional
    public JwtResponse register(RegisterRequest registerRequest) {
        if (userRepository.existsByUsername(registerRequest.getUsername())) {
            throw new BadRequestException("Username is already taken!");
        }

        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Email address already in use!");
        }

        // Create user
        Role studentRole = roleRepository.findByName("ROLE_STUDENT")
                .orElseThrow(() -> new BadRequestException("Default role ROLE_STUDENT not found. Please seed the database."));

        User user = User.builder()
                .username(registerRequest.getUsername())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .roles(Set.of(studentRole))
                .enabled(true)
                .lastActiveAt(java.time.LocalDateTime.now())
                .build();

        User savedUser = userRepository.save(user);

        // Auto-login after registration (Generate tokens directly to avoid transaction lock error)
        String accessToken = jwtProvider.generateTokenFromUsername(savedUser.getUsername());
        RefreshToken refreshToken = refreshTokenService.createRefreshToken(savedUser.getId());

        List<String> roles = savedUser.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken.getToken())
                .id(savedUser.getId())
                .username(savedUser.getUsername())
                .email(savedUser.getEmail())
                .roles(roles)
                .avatarUrl(savedUser.getAvatarUrl())
                .build();
    }

    @Transactional
    public JwtResponse refreshToken(String refreshTokenStr) {
        RefreshToken refreshToken = refreshTokenService.findByToken(refreshTokenStr);
        refreshTokenService.verifyExpiration(refreshToken);

        User user = refreshToken.getUser();
        String accessToken = jwtProvider.generateTokenFromUsername(user.getUsername());

        List<String> roles = user.getRoles().stream()
                .map(Role::getName)
                .collect(Collectors.toList());

        return JwtResponse.builder()
                .token(accessToken)
                .refreshToken(refreshTokenStr)
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .roles(roles)
                .avatarUrl(user.getAvatarUrl())
                .build();
    }

    @Transactional
    public void logout(String refreshTokenStr) {
        refreshTokenService.revokeToken(refreshTokenStr);
    }
}
