package com.vehicleservice;

import com.vehicleservice.store.JsonFileStorage;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class VehicleServiceApplication implements CommandLineRunner {

    private final JsonFileStorage jsonFileStorage;

    public VehicleServiceApplication(JsonFileStorage jsonFileStorage) {
        this.jsonFileStorage = jsonFileStorage;
    }

    public static void main(String[] args) {
        SpringApplication.run(VehicleServiceApplication.class, args);
    }

    @Override
    public void run(String... args) {
        jsonFileStorage.loadAll();
    }
}
