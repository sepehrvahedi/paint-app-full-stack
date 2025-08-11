package com.example.canvasdrawingapi.data;

import com.example.canvasdrawingapi.model.User;
import com.example.canvasdrawingapi.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {
    private static final Logger logger = LoggerFactory.getLogger(DataSeeder.class);

    @Autowired
    private UserService userService;

    @Autowired
    private Environment environment;

    @Override
    public void run(String... args) throws Exception {
        String[] activeProfiles = environment.getActiveProfiles();
        boolean isDevelopment = java.util.Arrays.asList(activeProfiles).contains("dev") || 
                               activeProfiles.length == 0; // Default profile

        if (isDevelopment) {
            seedData();
        }
    }

    private void seedData() {
        try {
            logger.info("🌱 Starting database seeding...");

            // Create seed users if they don't exist
            createUserIfNotExists("admin", "admin123");
            createUserIfNotExists("artist1", "test123");
            createUserIfNotExists("painter2", "painter123");

            logger.info("🌱 Database seeded successfully!");
        } catch (Exception e) {
            logger.error("❌ Error seeding database:", e);
        }
    }

    private void createUserIfNotExists(String username, String password) {
        if (!userService.existsByUsername(username)) {
            User user = userService.createUser(username, password);
            logger.info("👤 Created user: {}", user.getUsername());
        } else {
            logger.info("👤 User already exists: {}", username);
        }
    }
}
