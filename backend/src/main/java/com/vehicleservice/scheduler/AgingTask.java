package com.vehicleservice.scheduler;

import com.vehicleservice.config.AppProperties;
import com.vehicleservice.model.Job;
import com.vehicleservice.model.JobStatus;
import com.vehicleservice.model.QueueClass;
import com.vehicleservice.store.JobStore;
import com.vehicleservice.store.JsonFileStorage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class AgingTask {
    private static final Logger log = LoggerFactory.getLogger(AgingTask.class);

    private final JobStore jobStore;
    private final AppProperties appProperties;
    private final JsonFileStorage jsonFileStorage;

    public AgingTask(JobStore jobStore, AppProperties appProperties, JsonFileStorage jsonFileStorage) {
        this.jobStore = jobStore;
        this.appProperties = appProperties;
        this.jsonFileStorage = jsonFileStorage;
    }

    // Run every minute to check for starving long jobs
    @Scheduled(fixedRate = 60000)
    public void checkAgingJobs() {
        LocalDateTime cutoff = LocalDateTime.now().minusDays(appProperties.getAgingDays());
        List<Job> snapshot = new ArrayList<>(jobStore.getLongQueue());
        for (Job job : snapshot) {
            if (job.getStatus() == JobStatus.PENDING && job.getCreatedAt() != null && job.getCreatedAt().isBefore(cutoff)) {
                log.info("Aging job {} detected (waiting > {} days). Raising priority.",
                        job.getJobId(), appProperties.getAgingDays());
                // Starvation guard: promote aged long job to the short queue to ensure earliest execution
                if (jobStore.getLongQueue().remove(job)) {
                    job.setQueueClass(QueueClass.SHORT);
                    jobStore.getShortQueue().add(job);
                    if (jsonFileStorage != null && job.getCustomerId() != null) {
                        jsonFileStorage.saveUser(job.getCustomerId());
                    }
                }
            }
        }
    }
}
