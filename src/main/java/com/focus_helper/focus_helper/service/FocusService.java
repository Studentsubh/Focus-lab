package com.focus_helper.focus_helper.service;

import com.focus_helper.focus_helper.model.BlockItem;
import com.focus_helper.focus_helper.repository.BlockItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import java.util.List;

@Service
public class FocusService {

    private final WebClient webClient;
    private final BlockItemRepository repository;

    public FocusService(BlockItemRepository repository) {
        this.repository = repository;
        this.webClient = WebClient.builder()
                .baseUrl("http://127.0.0.1:8000/api/block") // Django base URL
                .build();
    }

    public List<BlockItem> getAllBlocks() {
        return repository.findAll();
    }

    public BlockItem addBlock(BlockItem item) {
        BlockItem saved = repository.save(item);

        // Send block info to Django immediately
        webClient.post()
                .uri("/blocked-items/")
                .bodyValue(saved)
                .retrieve()
                .bodyToMono(Void.class)
                .subscribe();

        return saved;
    }

    public void removeBlock(Long id) {
        repository.deleteById(id);
    }

    public void startFocus() {
        webClient.post()
                .uri("/start/")
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }

    public void stopFocus() {
        webClient.post()
                .uri("/stop/")
                .retrieve()
                .bodyToMono(Void.class)
                .block();
    }
}
