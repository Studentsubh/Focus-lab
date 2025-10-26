package com.focus_helper.focus_helper.controller;

import com.focus_helper.focus_helper.model.BlockItem;
import com.focus_helper.focus_helper.service.FocusService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/focus")
@CrossOrigin(origins = "*")
public class FocusController {

    private final FocusService service;

    public FocusController(FocusService service) {
        this.service = service;
    }

    @GetMapping("/blocks")
    public List<BlockItem> getBlocks() {
        return service.getAllBlocks();
    }

    @PostMapping("/add")
    public BlockItem addBlock(@RequestBody BlockItem item) {
        // Basic validation
        if (item.getName() == null || item.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name cannot be null or empty");
        }
        if (item.getType() == null || (!item.getType().equals("website") && !item.getType().equals("app"))) {
            throw new IllegalArgumentException("Type must be 'website' or 'app'");
        }
        if ("app".equals(item.getType()) && (item.getPath() == null || item.getPath().trim().isEmpty())) {
            throw new IllegalArgumentException("Path is required for app type");
        }
        if ("website".equals(item.getType()) && (item.getUrl() == null || item.getUrl().trim().isEmpty())) {
            throw new IllegalArgumentException("URL is required for website type");
        }
        return service.addBlock(item);
    }

    @DeleteMapping("/remove/{id}")
    public void removeBlock(@PathVariable Long id) {
        service.removeBlock(id);
    }

    @PostMapping("/start")
    public void startFocus() {
        service.startFocus();
    }

    @PostMapping("/stop")
    public void stopFocus() {
        service.stopFocus();
    }
}
