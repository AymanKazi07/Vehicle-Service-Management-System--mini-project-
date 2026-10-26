package com.vehicleservice.controller;

import com.vehicleservice.model.Category;
import com.vehicleservice.model.ServiceItem;
import com.vehicleservice.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class CatalogController {
    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping
    public ResponseEntity<List<ServiceItem>> getServices(
            @RequestParam(required = false) Category category,
            @RequestParam(required = false) String subType) {
        List<ServiceItem> services = catalogService.getServices(category, subType);
        return ResponseEntity.ok(services);
    }
}
