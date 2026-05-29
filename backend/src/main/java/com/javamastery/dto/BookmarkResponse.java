package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookmarkResponse {
    private Long id;
    private Long lessonId;
    private String lessonTitle;
    private Long courseId;
    private String courseTitle;
    private LocalDateTime bookmarkedAt;
}
