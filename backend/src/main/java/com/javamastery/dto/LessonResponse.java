package com.javamastery.dto;

import com.javamastery.entity.Difficulty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LessonResponse {
    private Long id;
    private Long courseId;
    private String title;
    private String content; 
    private Difficulty difficulty;
    private boolean completed;
    private boolean bookmarked;
    private Long quizId; 
    private LocalDateTime createdAt;
    private LocalDateTime lastModifiedAt;
}
