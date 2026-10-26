package com.vehicleservice.store;

import com.vehicleservice.model.Job;
import com.vehicleservice.model.QueueClass;
import com.vehicleservice.scheduler.LongJobComparator;
import com.vehicleservice.scheduler.ShortJobComparator;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.PriorityBlockingQueue;

@Component
public class JobStore {
    private final PriorityBlockingQueue<Job> shortQueue = new PriorityBlockingQueue<>(50, new ShortJobComparator());
    private final PriorityBlockingQueue<Job> longQueue = new PriorityBlockingQueue<>(50, new LongJobComparator());
    private final ConcurrentHashMap<String, Job> jobsById = new ConcurrentHashMap<>();

    public PriorityBlockingQueue<Job> getShortQueue() {
        return shortQueue;
    }

    public PriorityBlockingQueue<Job> getLongQueue() {
        return longQueue;
    }

    public ConcurrentHashMap<String, Job> getJobsById() {
        return jobsById;
    }

    public void addJob(Job job) {
        jobsById.put(job.getJobId(), job);
        if (job.getQueueClass() == QueueClass.SHORT) {
            shortQueue.add(job);
        } else {
            longQueue.add(job);
        }
    }

    public Job findById(String jobId) {
        return jobsById.get(jobId);
    }

    public Collection<Job> findAll() {
        return jobsById.values();
    }

    public void clear() {
        shortQueue.clear();
        longQueue.clear();
        jobsById.clear();
    }
}
