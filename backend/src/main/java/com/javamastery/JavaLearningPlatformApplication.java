package com.javamastery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JavaLearningPlatformApplication {

	public static void main(String[] args) {
		SpringApplication.run(JavaLearningPlatformApplication.class, args);
	}

}
