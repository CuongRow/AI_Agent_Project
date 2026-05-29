package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AnalyticsResponse {
    private long totalUsers;
    private long totalCourses;
    private long totalLessons;
    private long totalQuizzes;
    private long totalQuestions;
    private double overallCompletionRate;
    private Map<String, Long> userRegistrationsOverTime;
}
