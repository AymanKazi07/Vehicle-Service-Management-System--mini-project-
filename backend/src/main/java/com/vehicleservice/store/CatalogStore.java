package com.vehicleservice.store;

import com.vehicleservice.model.Category;
import com.vehicleservice.model.ServiceItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class CatalogStore {
    private final Map<Category, Map<String, List<ServiceItem>>> catalog = new ConcurrentHashMap<>();

    public CatalogStore() {
        for (Category category : Category.values()) {
            catalog.put(category, new ConcurrentHashMap<>());
        }
    }

    public Map<Category, Map<String, List<ServiceItem>>> getCatalog() {
        return catalog;
    }

    public List<ServiceItem> getServices(Category category, String subType) {
        if (category == null) {
            Map<String, ServiceItem> allDedup = new LinkedHashMap<>();
            for (Category cat : Category.values()) {
                for (ServiceItem s : getServices(cat, subType)) {
                    allDedup.putIfAbsent(s.getId(), s);
                }
            }
            return new ArrayList<>(allDedup.values());
        }

        Map<String, List<ServiceItem>> subTypeMap = catalog.get(category);
        if (subTypeMap == null) return Collections.emptyList();

        Map<String, ServiceItem> dedup = new LinkedHashMap<>();

        if (subType == null || subType.isBlank()) {
            for (List<ServiceItem> list : subTypeMap.values()) {
                for (ServiceItem item : list) {
                    dedup.putIfAbsent(item.getId(), item);
                }
            }
            return new ArrayList<>(dedup.values());
        }

        for (Map.Entry<String, List<ServiceItem>> entry : subTypeMap.entrySet()) {
            if (entry.getKey().equalsIgnoreCase(subType) || entry.getKey().equalsIgnoreCase("ALL")) {
                for (ServiceItem item : entry.getValue()) {
                    dedup.putIfAbsent(item.getId(), item);
                }
            }
        }

        if (dedup.isEmpty()) {
            String mapped = mapSubTypeAlias(subType);
            if (mapped != null) {
                for (Map.Entry<String, List<ServiceItem>> entry : subTypeMap.entrySet()) {
                    if (entry.getKey().equalsIgnoreCase(mapped) || entry.getKey().equalsIgnoreCase("ALL")) {
                        for (ServiceItem item : entry.getValue()) {
                            dedup.putIfAbsent(item.getId(), item);
                        }
                    }
                }
            }
        }

        if (dedup.isEmpty()) {
            // Fallback: return all available services for this category
            for (List<ServiceItem> list : subTypeMap.values()) {
                for (ServiceItem item : list) {
                    dedup.putIfAbsent(item.getId(), item);
                }
            }
        }
        return new ArrayList<>(dedup.values());
    }

    private String mapSubTypeAlias(String subType) {
        if (subType == null) return null;
        String s = subType.trim().toUpperCase();
        return switch (s) {
            case "COMMUTER", "CRUISER", "SPORT", "BIKE" -> "Geared";
            case "SUV", "SEDAN", "HATCHBACK", "COUPE", "MUV" -> "Petrol";
            default -> null;
        };
    }

    public void addService(Category category, String subType, ServiceItem item) {
        catalog.computeIfAbsent(category, c -> new ConcurrentHashMap<>())
                .computeIfAbsent(subType, st -> new CopyOnWriteArrayList<>())
                .add(item);
    }

    public ServiceItem findById(String serviceId) {
        for (Map<String, List<ServiceItem>> subTypeMap : catalog.values()) {
            for (List<ServiceItem> list : subTypeMap.values()) {
                for (ServiceItem item : list) {
                    if (item.getId().equals(serviceId)) {
                        return item;
                    }
                }
            }
        }
        return null;
    }

    public List<ServiceItem> findAll() {
        List<ServiceItem> all = new ArrayList<>();
        for (Map<String, List<ServiceItem>> subTypeMap : catalog.values()) {
            for (List<ServiceItem> list : subTypeMap.values()) {
                all.addAll(list);
            }
        }
        return all;
    }

    public void clear() {
        catalog.clear();
        for (Category category : Category.values()) {
            catalog.put(category, new ConcurrentHashMap<>());
        }
    }
}
