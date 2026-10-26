package com.vehicleservice.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AppProperties {

    @Value("${app.gst.rate:0.18}")
    private double gstRate;

    @Value("${app.short-job-max-minutes:120}")
    private int shortJobMaxMinutes;

    @Value("${app.work.start-hour:9}")
    private int workStartHour;

    @Value("${app.work.end-hour:18}")
    private int workEndHour;

    @Value("${app.aging.days:2}")
    private int agingDays;

    @Value("${app.data.dir:data}")
    private String dataDir;

    @Value("${app.jwt.secret:VehicleServiceSecretKeyForJwtAuthenticationMustBeAtLeast256BitsLongForHS256Algorithm}")
    private String jwtSecret;

    @Value("${app.jwt.expiry-minutes:120}")
    private int jwtExpiryMinutes;

    public double getGstRate() {
        return gstRate;
    }

    public void setGstRate(double gstRate) {
        this.gstRate = gstRate;
    }

    public int getShortJobMaxMinutes() {
        return shortJobMaxMinutes;
    }

    public void setShortJobMaxMinutes(int shortJobMaxMinutes) {
        this.shortJobMaxMinutes = shortJobMaxMinutes;
    }

    public int getWorkStartHour() {
        return workStartHour;
    }

    public void setWorkStartHour(int workStartHour) {
        this.workStartHour = workStartHour;
    }

    public int getWorkEndHour() {
        return workEndHour;
    }

    public void setWorkEndHour(int workEndHour) {
        this.workEndHour = workEndHour;
    }

    public int getAgingDays() {
        return agingDays;
    }

    public void setAgingDays(int agingDays) {
        this.agingDays = agingDays;
    }

    public String getDataDir() {
        return dataDir;
    }

    public void setDataDir(String dataDir) {
        this.dataDir = dataDir;
    }

    public String getJwtSecret() {
        return jwtSecret;
    }

    public void setJwtSecret(String jwtSecret) {
        this.jwtSecret = jwtSecret;
    }

    public int getJwtExpiryMinutes() {
        return jwtExpiryMinutes;
    }

    public void setJwtExpiryMinutes(int jwtExpiryMinutes) {
        this.jwtExpiryMinutes = jwtExpiryMinutes;
    }
}
