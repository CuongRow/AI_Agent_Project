package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuizHistoryResponse {
    private long totalAttempts;
    private double averageScore;
    private double highestScore;
    private double passRate;
    private List<QuizAttemptResponse> recentAttempts;
    private Map<String, Long> scoreDistribution;
}
