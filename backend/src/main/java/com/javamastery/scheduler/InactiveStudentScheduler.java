package com.javamastery.scheduler;

import com.javamastery.entity.User;
import com.javamastery.repository.UserRepository;
import com.javamastery.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class InactiveStudentScheduler {

    private final UserRepository userRepository;
    private final EmailService emailService;

    // Run every day at 1 AM
    @Scheduled(cron = "0 0 1 * * ?")
    public void remindInactiveStudents() {
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(15);
        List<User> inactiveStudents = userRepository.findInactiveStudents(cutoffDate);
        
        for (User student : inactiveStudents) {
            String subject = "We miss you at JavaMastery!";
            String body = "Hi " + student.getUsername() + ",\n\nIt's been a while since you last studied. Come back and continue learning Java!";
            emailService.sendEmail(student.getEmail(), subject, body);
        }
    }
}
