package com.javamastery.security;

import com.javamastery.entity.User;
import com.javamastery.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class LastActiveFilter extends OncePerRequestFilter {

    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication != null && authentication.isAuthenticated() && authentication.getPrincipal() instanceof UserPrincipal) {
            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
            
            // Avoid querying DB on every request. Let's just do it directly for now or could optimize with a cache
            Optional<User> userOpt = userRepository.findById(principal.getId());
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                // Update only if lastActiveAt is null or more than 1 hour ago to reduce DB writes
                if (user.getLastActiveAt() == null || user.getLastActiveAt().plusHours(1).isBefore(LocalDateTime.now())) {
                    user.setLastActiveAt(LocalDateTime.now());
                    userRepository.save(user);
                }
            }
        }
        
        filterChain.doFilter(request, response);
    }
}
