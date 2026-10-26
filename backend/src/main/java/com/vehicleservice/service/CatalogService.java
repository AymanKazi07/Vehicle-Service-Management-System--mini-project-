package com.vehicleservice.service;

import com.vehicleservice.config.AppProperties;
import com.vehicleservice.exception.ApiException;
import com.vehicleservice.model.Category;
import com.vehicleservice.model.QueueClass;
import com.vehicleservice.model.ServiceItem;
import com.vehicleservice.store.CatalogStore;
import com.vehicleservice.store.JsonFileStorage;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CatalogService {
    private final CatalogStore catalogStore;
    private final JsonFileStorage jsonFileStorage;
    private final AppProperties appProperties;

    public CatalogService(CatalogStore catalogStore, JsonFileStorage jsonFileStorage, AppProperties appProperties) {
        this.catalogStore = catalogStore;
        this.jsonFileStorage = jsonFileStorage;
        this.appProperties = appProperties;
    }

    public List<ServiceItem> getServices(Category category, String subType) {
        if (category == null) {
            return catalogStore.findAll();
        }
        if (subType == null || subType.isBlank()) {
            List<ServiceItem> list = new ArrayList<>();
            Map<String, List<ServiceItem>> subMap = catalogStore.getCatalog().get(category);
            if (subMap != null) {
                for (List<ServiceItem> items : subMap.values()) {
                    list.addAll(items);
                }
            }
            return list;
        }
        return catalogStore.getServices(category, subType);
    }

    public ServiceItem getServiceById(String id) {
        ServiceItem item = catalogStore.findById(id);
        if (item == null) {
            throw new ApiException("Service not found with id: " + id, HttpStatus.NOT_FOUND);
        }
        return item;
    }

    public ServiceItem updateService(String id, ServiceItem updated) {
        ServiceItem existing = catalogStore.findById(id);
        if (existing == null) {
            throw new ApiException("Service item not found with id: " + id, HttpStatus.NOT_FOUND);
        }

        if (updated.getName() != null) {
            existing.setName(updated.getName());
        }
        if (updated.getPrice() != null) {
            existing.setPrice(updated.getPrice());
        }
        if (updated.getExpectedMinutes() != null) {
            existing.setExpectedMinutes(updated.getExpectedMinutes());
            QueueClass qc = updated.getExpectedMinutes() <= appProperties.getShortJobMaxMinutes()
                    ? QueueClass.SHORT
                    : QueueClass.LONG;
            existing.setQueueClass(qc);
        }

        jsonFileStorage.saveCatalog();
        return existing;
    }
}
