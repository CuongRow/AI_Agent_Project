package com.javamastery.service;

import org.springframework.stereotype.Service;

@Service
public class EmailService {
    public void sendEmail(String to, String subject, String body) {
        // Mock email sending
        System.out.println("=============================================");
        System.out.println("Sending Email to: " + to);
        System.out.println("Subject: " + subject);
        System.out.println("Body: \n" + body);
        System.out.println("=============================================");
    }
}
