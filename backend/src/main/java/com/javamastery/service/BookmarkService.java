package com.javamastery.service;

import com.javamastery.dto.BookmarkResponse;
import com.javamastery.entity.Bookmark;
import com.javamastery.entity.Lesson;
import com.javamastery.entity.User;
import com.javamastery.exception.BadRequestException;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.repository.BookmarkRepository;
import com.javamastery.repository.LessonRepository;
import com.javamastery.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final BookmarkRepository bookmarkRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;

    @Transactional
    public BookmarkResponse toggleBookmark(Long userId, Long lessonId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));

        java.util.Optional<Bookmark> existingOpt = bookmarkRepository.findByUserIdAndLessonId(userId, lessonId);
        if (existingOpt.isPresent()) {
            // Remove bookmark (toggle off)
            bookmarkRepository.delete(existingOpt.get());
            return null;
        } else {
            // Add bookmark (toggle on)
            Bookmark bookmark = Bookmark.builder()
                    .user(user)
                    .lesson(lesson)
                    .build();
            Bookmark saved = bookmarkRepository.save(bookmark);
            return toResponse(saved);
        }
    }

    @Transactional(readOnly = true)
    public Page<BookmarkResponse> getUserBookmarks(Long userId, Pageable pageable) {
        return bookmarkRepository.findByUserId(userId, pageable)
                .map(this::toResponse);
    }

    private BookmarkResponse toResponse(Bookmark bookmark) {
        return BookmarkResponse.builder()
                .id(bookmark.getId())
                .lessonId(bookmark.getLesson().getId())
                .lessonTitle(bookmark.getLesson().getTitle())
                .courseId(bookmark.getLesson().getCourse().getId())
                .courseTitle(bookmark.getLesson().getCourse().getTitle())
                .bookmarkedAt(bookmark.getBookmarkedAt())
                .build();
    }
}
