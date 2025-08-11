package com.example.canvasdrawingapi.controller;

import com.example.canvasdrawingapi.dto.ApiResponse;
import com.example.canvasdrawingapi.model.User;
import com.example.canvasdrawingapi.model.painting.Painting;
import com.example.canvasdrawingapi.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/paintings")
public class PaintingController {
    private static final Logger logger = LoggerFactory.getLogger(PaintingController.class);

    @Autowired
    private UserService userService;

    @PostMapping("/save")
    public ResponseEntity<ApiResponse<Map<String, Object>>> savePainting(@RequestBody Map<String, Object> paintingData, 
                                                                        HttpServletRequest request) {
        try {
            logger.debug("Save painting request: {}", paintingData);

            Long userId = (Long) request.getAttribute("userId");
            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();

            // Convert Map to Painting object
            Painting painting = convertMapToPainting(paintingData);

            if (painting == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Invalid painting data format"));
            }

            if (!painting.isValid()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Painting data validation failed. Title and valid shapes are required."));
            }

            painting.updateTimestamp();

            boolean success = userService.setUserPainting(user, painting);

            if (!success) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to save painting data"));
            }

            userService.saveUser(user);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("painting", painting);
            responseData.put("statistics", painting.getStatistics());

            return ResponseEntity.ok(ApiResponse.success("Painting saved successfully", responseData));
        } catch (Exception e) {
            logger.error("Save painting error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error while saving painting"));
        }
    }

    @GetMapping("/load")
    public ResponseEntity<ApiResponse<Map<String, Object>>> loadPainting(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();
            Painting painting = userService.getUserPainting(user);

            if (painting == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No painting found for this user"));
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("painting", painting);
            responseData.put("statistics", painting.getStatistics());

            return ResponseEntity.ok(ApiResponse.success("Painting loaded successfully", responseData));
        } catch (Exception e) {
            logger.error("Load painting error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error while loading painting"));
        }
    }

    @PutMapping("/update")
    public ResponseEntity<ApiResponse<Map<String, Object>>> updatePainting(@RequestBody Map<String, Object> updateData, 
                                                                          HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();
            Painting painting = userService.getUserPainting(user);

            if (painting == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No painting found to update"));
            }

            // Update painting with new data
            if (updateData.containsKey("title")) {
                painting.setTitle((String) updateData.get("title"));
            }

            if (updateData.containsKey("shapes")) {
                painting.clearShapes();
                // Add shapes from updateData - this would need proper conversion
                // For simplicity, recreating the painting from updateData
                Painting updatedPainting = convertMapToPainting(updateData);
                if (updatedPainting != null) {
                    painting.setShapes(updatedPainting.getShapes());
                }
            }

            painting.updateTimestamp();

            if (!painting.isValid()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Updated painting data is invalid"));
            }

            boolean success = userService.setUserPainting(user, painting);

            if (!success) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(ApiResponse.error("Failed to update painting data"));
            }

            userService.saveUser(user);

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("painting", painting);
            responseData.put("statistics", painting.getStatistics());

            return ResponseEntity.ok(ApiResponse.success("Painting updated successfully", responseData));
        } catch (Exception e) {
            logger.error("Update painting error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error while updating painting"));
        }
    }

    @DeleteMapping("/delete")
    public ResponseEntity<ApiResponse<Void>> deletePainting(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();

            if (!user.hasPainting()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No painting found for this user"));
            }

            userService.setUserPainting(user, null);
            userService.saveUser(user);

            return ResponseEntity.ok(ApiResponse.success("Painting deleted successfully"));
        } catch (Exception e) {
            logger.error("Delete painting error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error while deleting painting"));
        }
    }

    @GetMapping("/statistics")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getPaintingStatistics(HttpServletRequest request) {
        try {
            Long userId = (Long) request.getAttribute("userId");
            Optional<User> userOptional = userService.findById(userId);

            if (userOptional.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("User not found"));
            }

            User user = userOptional.get();
            Painting painting = userService.getUserPainting(user);

            if (painting == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(ApiResponse.error("No painting found for this user"));
            }

            Map<String, Object> responseData = new HashMap<>();
            responseData.put("statistics", painting.getStatistics());

            return ResponseEntity.ok(ApiResponse.success("Painting statistics retrieved successfully", responseData));
        } catch (Exception e) {
            logger.error("Get painting statistics error:", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Internal server error while retrieving statistics"));
        }
    }

    private Painting convertMapToPainting(Map<String, Object> data) {
        try {
            // Convert Map to JSON string and then to Painting object
            com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
            String json = mapper.writeValueAsString(data);
            return Painting.fromJson(json);
        } catch (Exception e) {
            logger.error("Error converting map to painting:", e);
            return null;
        }
    }
}
