package com.vehicleservice.scheduler;

import com.vehicleservice.model.Job;
import java.util.Comparator;

public class ShortJobComparator implements Comparator<Job> {
    @Override
    public int compare(Job a, Job b) {
        // 1. Appointment date
        int dateCmp = a.getDate().compareTo(b.getDate());
        if (dateCmp != 0) {
            return dateCmp;
        }
        // 2. Shortest duration
        int durA = a.getExpectedMinutes() != null ? a.getExpectedMinutes() : 0;
        int durB = b.getExpectedMinutes() != null ? b.getExpectedMinutes() : 0;
        int durCmp = Integer.compare(durA, durB);
        if (durCmp != 0) {
            return durCmp;
        }
        // 3. Booking time (createdAt)
        if (a.getCreatedAt() != null && b.getCreatedAt() != null) {
            return a.getCreatedAt().compareTo(b.getCreatedAt());
        }
        return 0;
    }
}
