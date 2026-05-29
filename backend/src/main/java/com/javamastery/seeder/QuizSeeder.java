package com.javamastery.seeder;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.javamastery.entity.*;
import com.javamastery.repository.*;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class QuizSeeder implements CommandLineRunner {

    private final CourseRepository courseRepository;
    private final LessonRepository lessonRepository;
    private final QuizRepository quizRepository;
    private final QuestionRepository questionRepository;
    private final AnswerRepository answerRepository;
    private final ObjectMapper objectMapper;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        if (courseRepository.count() > 0) {
            log.info("Database already seeded with courses. Skipping QuizSeeder.");
            return;
        }

        log.info("Starting database seeding from quiz-seed-data.json...");
        try {
            ClassPathResource resource = new ClassPathResource("quiz-seed-data.json");
            if (!resource.exists()) {
                log.warn("quiz-seed-data.json not found in classpath. Skipping seeding.");
                return;
            }

            try (InputStream inputStream = resource.getInputStream()) {
                List<SeedCourse> seedCourses = objectMapper.readValue(inputStream, new TypeReference<List<SeedCourse>>() {});
                
                for (SeedCourse sc : seedCourses) {
                    // Create Course
                    Course course = Course.builder()
                            .title(sc.getTitle())
                            .description(sc.getDescription())
                            .imageUrl(sc.getImageUrl())
                            .build();
                    course = courseRepository.save(course);
                    log.info("Seeded Course: {}", course.getTitle());

                    if (sc.getLessons() != null) {
                        for (SeedLesson sl : sc.getLessons()) {
                            // Create Lesson
                            Lesson lesson = Lesson.builder()
                                    .course(course)
                                    .title(sl.getTitle())
                                    .content(sl.getContent())
                                    .difficulty(Difficulty.valueOf(sl.getDifficulty()))
                                    .build();
                            lesson = lessonRepository.save(lesson);
                            log.info("  Seeded Lesson: {}", lesson.getTitle());

                            if (sl.getQuizzes() != null) {
                                for (SeedQuiz sq : sl.getQuizzes()) {
                                    // Create Quiz
                                    Quiz quiz = Quiz.builder()
                                            .lesson(lesson)
                                            .title(sq.getTitle())
                                            .build();
                                    quiz = quizRepository.save(quiz);
                                    log.info("    Seeded Quiz: {}", quiz.getTitle());

                                    if (sq.getQuestions() != null) {
                                        for (SeedQuestion sqn : sq.getQuestions()) {
                                            // Create Question
                                            Question question = Question.builder()
                                                    .quiz(quiz)
                                                    .content(sqn.getContent())
                                                    .explanation(sqn.getExplanation())
                                                    .questionType(QuestionType.valueOf(sqn.getQuestionType()))
                                                    .build();
                                            question = questionRepository.save(question);

                                            if (sqn.getAnswers() != null) {
                                                List<Answer> answers = new ArrayList<>();
                                                for (SeedAnswer sa : sqn.getAnswers()) {
                                                    Answer answer = Answer.builder()
                                                            .question(question)
                                                            .answerText(sa.getAnswerText())
                                                            .isCorrect(sa.isCorrect())
                                                            .build();
                                                    answers.add(answer);
                                                }
                                                answerRepository.saveAll(answers);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
            log.info("Database seeding completed successfully.");
        } catch (Exception e) {
            log.error("Failed to seed database from quiz-seed-data.json", e);
        }
    }

    @Data
    private static class SeedCourse {
        private String title;
        private String description;
        private String imageUrl;
        private List<SeedLesson> lessons;
    }

    @Data
    private static class SeedLesson {
        private String title;
        private String content;
        private String difficulty;
        private List<SeedQuiz> quizzes;
    }

    @Data
    private static class SeedQuiz {
        private String title;
        private List<SeedQuestion> questions;
    }

    @Data
    private static class SeedQuestion {
        private String content;
        private String explanation;
        private String questionType;
        private List<SeedAnswer> answers;
    }

    @Data
    private static class SeedAnswer {
        private String answerText;
        @JsonProperty("isCorrect")
        private boolean isCorrect;
    }
}
