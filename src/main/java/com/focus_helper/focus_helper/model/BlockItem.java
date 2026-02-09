package com.focus_helper.focus_helper.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "block_items")
public class BlockItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String type;  // "website" or "app"
    private String path;  // for exe paths
    private String url;   // for websites

    public BlockItem() {}

    public BlockItem(Long id, String name, String type, String path, String url) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.path = path;
        this.url = url;
    }

    // Additional constructor for creating new instances without ID
    public BlockItem(String name, String type, String path, String url) {
        this.name = name;
        this.type = type;
        this.path = path;
        this.url = url;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
}
