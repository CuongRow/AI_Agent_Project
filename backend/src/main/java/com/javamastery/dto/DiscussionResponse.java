package com.javamastery.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DiscussionResponse {
    private Long id;
    private Long lessonId;
    private String lessonTitle;
    private Long userId;
    private String username;
    private String userAvatarUrl;
    private String content;
    private Long parentId;
    private LocalDateTime createdAt;
    private List<DiscussionResponse> replies;
}
