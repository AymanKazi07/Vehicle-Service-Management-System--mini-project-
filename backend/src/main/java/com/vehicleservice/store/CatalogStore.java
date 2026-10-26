package com.vehicleservice.store;

import com.vehicleservice.model.Category;
import com.vehicleservice.model.ServiceItem;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.Collections;
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
        Map<String, List<ServiceItem>> subTypeMap = catalog.get(category);
        if (subTypeMap == null) return Collections.emptyList();
        List<ServiceItem> list = subTypeMap.get(subType);
        return list != null ? list : Collections.emptyList();
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
