package com.javamastery.service;

import com.javamastery.dto.DiscussionRequest;
import com.javamastery.dto.DiscussionResponse;
import com.javamastery.entity.Discussion;
import com.javamastery.entity.Lesson;
import com.javamastery.entity.User;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.DiscussionRepository;
import com.javamastery.repository.LessonRepository;
import com.javamastery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DiscussionServiceImpl implements DiscussionService {

    private final DiscussionRepository discussionRepository;
    private final LessonRepository lessonRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public List<DiscussionResponse> getDiscussionsByLesson(Long lessonId) {
        if (!lessonRepository.existsById(lessonId)) {
            throw new ResourceNotFoundException("Lesson not found with id: " + lessonId);
        }
        List<Discussion> rootDiscussions = discussionRepository.findRootDiscussionsByLessonId(lessonId);
        return rootDiscussions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DiscussionResponse createDiscussion(Long lessonId, Long userId, DiscussionRequest request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("Content cannot be empty");
        }

        Discussion parent = null;
        if (request.getParentId() != null) {
            parent = discussionRepository.findById(request.getParentId())
                    .orElseThrow(() -> new ResourceNotFoundException("Parent discussion not found with id: " + request.getParentId()));
            // Check if parent lesson matches
            if (!parent.getLesson().getId().equals(lessonId)) {
                throw new BadRequestException("Parent discussion does not belong to the same lesson");
            }
        }

        Discussion discussion = Discussion.builder()
                .lesson(lesson)
                .user(user)
                .content(request.getContent())
                .parent(parent)
                .build();

        Discussion saved = discussionRepository.save(discussion);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<DiscussionResponse> getAllGlobalDiscussions() {
        List<Discussion> rootDiscussions = discussionRepository.findAllRootDiscussionsGlobal();
        return rootDiscussions.stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public DiscussionResponse replyToDiscussion(Long discussionId, Long userId, DiscussionRequest request) {
        Discussion parent = discussionRepository.findById(discussionId)
                .orElseThrow(() -> new ResourceNotFoundException("Discussion not found with id: " + discussionId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new BadRequestException("Content cannot be empty");
        }

        Discussion reply = Discussion.builder()
                .lesson(parent.getLesson())
                .user(user)
                .content(request.getContent())
                .parent(parent)
                .build();

        Discussion saved = discussionRepository.save(reply);
        return mapToResponse(saved);
    }

    private DiscussionResponse mapToResponse(Discussion d) {
        if (d == null) return null;
        
        List<DiscussionResponse> replyResponses = null;
        if (d.getReplies() != null && !d.getReplies().isEmpty()) {
            replyResponses = d.getReplies().stream()
                    .map(this::mapToResponse)
                    .collect(Collectors.toList());
        }
        
        return DiscussionResponse.builder()
                .id(d.getId())
                .lessonId(d.getLesson() != null ? d.getLesson().getId() : null)
                .lessonTitle(d.getLesson() != null ? d.getLesson().getTitle() : null)
                .userId(d.getUser() != null ? d.getUser().getId() : null)
                .username(d.getUser() != null ? d.getUser().getUsername() : null)
                .userAvatarUrl(d.getUser() != null ? d.getUser().getAvatarUrl() : null)
                .content(d.getContent())
                .parentId(d.getParent() != null ? d.getParent().getId() : null)
                .createdAt(d.getCreatedAt())
                .replies(replyResponses != null ? replyResponses : List.of())
                .build();
    }
}
