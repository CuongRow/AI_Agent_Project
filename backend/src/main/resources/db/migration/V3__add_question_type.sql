-- Add question_type column to questions table to support multiple choice questions
ALTER TABLE questions ADD COLUMN question_type VARCHAR(50) NOT NULL DEFAULT 'SINGLE_CHOICE';
