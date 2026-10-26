package com.vehicleservice.scheduler;

import com.vehicleservice.model.Job;
import java.util.Comparator;

public class LongJobComparator implements Comparator<Job> {
    @Override
    public int compare(Job a, Job b) {
        // 1. Appointment date
        int dateCmp = a.getDate().compareTo(b.getDate());
        if (dateCmp != 0) {
            return dateCmp;
        }
        // 2. Booking time (createdAt)
        if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
        return 0;
    }
}
