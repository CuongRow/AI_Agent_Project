package com.javamastery.service;

import com.javamastery.dto.DiscussionRequest;
import com.javamastery.dto.DiscussionResponse;

import java.util.List;

public interface DiscussionService {
    List<DiscussionResponse> getDiscussionsByLesson(Long lessonId);
    DiscussionResponse createDiscussion(Long lessonId, Long userId, DiscussionRequest request);
    List<DiscussionResponse> getAllGlobalDiscussions();
    DiscussionResponse replyToDiscussion(Long discussionId, Long userId, DiscussionRequest request);
}
