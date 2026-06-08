package com.javamastery.service;

import com.javamastery.dto.LessonResponse;
import com.javamastery.entity.Course;
import com.javamastery.entity.Lesson;
import com.javamastery.exception.ResourceNotFoundException;
import com.javamastery.mapper.LessonMapper;
import com.javamastery.repository.CourseRepository;
import com.javamastery.repository.LessonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class LessonAdminService {

    private final LessonRepository lessonRepository;
    private final CourseRepository courseRepository;
    private final LessonMapper lessonMapper;

    @Transactional
    public LessonResponse createLesson(Long courseId, LessonResponse request) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new ResourceNotFoundException("Course not found with id: " + courseId));
        
        Lesson lesson = Lesson.builder()
                .course(course)
                .title(request.getTitle())
                .content(request.getContent())
                .difficulty(request.getDifficulty())
                .build();
        
        Lesson saved = lessonRepository.save(lesson);
        return lessonMapper.toResponse(saved);
    }

    @Transactional
    public LessonResponse updateLesson(Long lessonId, LessonResponse request) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        
        lesson.setTitle(request.getTitle());
        lesson.setContent(request.getContent());
        lesson.setDifficulty(request.getDifficulty());
        
        Lesson saved = lessonRepository.save(lesson);
        return lessonMapper.toResponse(saved);
    }

    @Transactional
    public void deleteLesson(Long lessonId) {
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new ResourceNotFoundException("Lesson not found with id: " + lessonId));
        lessonRepository.delete(lesson);
    }

    public String uploadMaterial(org.springframework.web.multipart.MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new com.javamastery.exception.BadRequestException("File is empty!");
        }
        
        try {
            String originalFilename = file.getOriginalFilename();
            String sanitizedFilename = org.springframework.util.StringUtils.cleanPath(originalFilename);
            if (sanitizedFilename.contains("..")) {
                throw new com.javamastery.exception.BadRequestException("Invalid file name: " + sanitizedFilename);
            }
            
            String extension = "";
            if (sanitizedFilename.contains(".")) {
                extension = sanitizedFilename.substring(sanitizedFilename.lastIndexOf('.'));
            }
            
            String filename = "material_" + System.currentTimeMillis() + "_" + java.util.UUID.randomUUID().toString().substring(0, 8) + extension;
            java.nio.file.Path uploadDir = java.nio.file.Paths.get("uploads/materials");
            if (!java.nio.file.Files.exists(uploadDir)) {
                java.nio.file.Files.createDirectories(uploadDir);
            }
            
            java.nio.file.Path target = uploadDir.resolve(filename);
            java.nio.file.Files.copy(file.getInputStream(), target, java.nio.file.StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/materials/" + filename;
        } catch (java.io.IOException e) {
            throw new RuntimeException("Failed to store file: " + e.getMessage(), e);
        }
    }
}
