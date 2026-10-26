package com.vehicleservice.service;

import com.vehicleservice.config.AppProperties;
import com.vehicleservice.model.Category;
import com.vehicleservice.model.Job;
import com.vehicleservice.model.QueueClass;
import com.vehicleservice.scheduler.SlotAllocator;
import com.vehicleservice.store.JobStore;
import org.springframework.stereotype.Service;

@Service
public class SchedulerService {
    private final JobStore jobStore;
    private final SlotAllocator slotAllocator;
    private final AppProperties appProperties;

    public SchedulerService(JobStore jobStore, SlotAllocator slotAllocator, AppProperties appProperties) {
        this.jobStore = jobStore;
        this.slotAllocator = slotAllocator;
        this.appProperties = appProperties;
    }

    public Job schedule(Job job, Category vehicleCategory) {
        int duration = job.getExpectedMinutes() != null ? job.getExpectedMinutes() : 60;
        QueueClass queueClass = duration <= appProperties.getShortJobMaxMinutes()
                ? QueueClass.SHORT
                : QueueClass.LONG;
        job.setQueueClass(queueClass);

        SlotAllocator.AllocationResult allocation = slotAllocator.allocateSlot(
                job.getJobId(),
                vehicleCategory,
                job.getDate(),
                duration,
                queueClass
        );

        job.setMechanicId(allocation.getMechanicId());
        job.setDate(allocation.getDate());
        job.setSlotStart(allocation.getSlotStart());
        job.setEstimatedEnd(allocation.getEstimatedEnd());

        jobStore.addJob(job);
        return job;
    }
}
