# Database Design

## Tables

users

- id
- username
- email
- password
- role
- created_at

roles

- id
- name

courses

- id
- title
- description
- image_url

lessons

- id
- course_id
- title
- content
- difficulty

quizzes

- id
- lesson_id
- title

questions

- id
- quiz_id
- content
- explanation

answers

- id
- question_id
- answer_text
- is_correct

progress

- id
- user_id
- lesson_id
- completed

bookmarks

- id
- user_id
- lesson_id