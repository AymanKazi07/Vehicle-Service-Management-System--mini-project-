package com.vehicleservice.controller;

import com.vehicleservice.dto.JobStatusRequest;
import com.vehicleservice.model.Job;
import com.vehicleservice.model.User;
import com.vehicleservice.service.MechanicService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mechanic")
public class MechanicController {
    private final MechanicService mechanicService;

    public MechanicController(MechanicService mechanicService) {
        this.mechanicService = mechanicService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getJobs(@AuthenticationPrincipal User user) {
        List<Job> jobs = mechanicService.getJobs(user.getId());
        return ResponseEntity.ok(jobs);
    }

    @PatchMapping("/jobs/{id}/status")
    public ResponseEntity<Job> updateStatus(@AuthenticationPrincipal User user,
                                            @PathVariable String id,
                                            @Valid @RequestBody JobStatusRequest request) {
        Job updated = mechanicService.updateStatus(user.getId(), id, request);
        return ResponseEntity.ok(updated);
    }
}
