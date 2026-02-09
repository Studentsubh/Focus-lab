package com.focus_helper.focus_helper.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
public class DjangoUtils {

    private static final String DJANGO_URL = "http://127.0.0.1:8000/api/block/";
    private final RestTemplate restTemplate = new RestTemplate();

    // 🔹 Start the Django blocker
    public void startBlocker() {
        try {
            restTemplate.postForObject(DJANGO_URL + "start/", null, String.class);
            System.out.println("✅ Django blocker started successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to start Django blocker: " + e.getMessage());
        }
    }

    // 🔹 Stop the Django blocker
    public void stopBlocker() {
        try {
            restTemplate.postForObject(DJANGO_URL + "stop/", null, String.class);
            System.out.println("🛑 Django blocker stopped successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to stop Django blocker: " + e.getMessage());
        }
    }

    // 🔹 Add a new blocked item (either exe or website)
    public void addBlockedItem(Object blockedItem) {
        try {
            restTemplate.postForObject(DJANGO_URL + "blocked-items/", blockedItem, String.class);
            System.out.println("🚫 Blocked item sent to Django successfully!");
        } catch (Exception e) {
            System.err.println("❌ Failed to send blocked item: " + e.getMessage());
        }
    }
}
