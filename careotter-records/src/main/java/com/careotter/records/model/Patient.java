package com.careotter.records.model;

import java.time.LocalDate;

public class Patient {

    private String id;
    private String name;
    private LocalDate dateOfBirth;
    private String mrn;
    private String primaryProvider;

    public Patient() {
    }

    public Patient(String id, String name, LocalDate dateOfBirth, String mrn, String primaryProvider) {
        this.id = id;
        this.name = name;
        this.dateOfBirth = dateOfBirth;
        this.mrn = mrn;
        this.primaryProvider = primaryProvider;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getMrn() {
        return mrn;
    }

    public void setMrn(String mrn) {
        this.mrn = mrn;
    }

    public String getPrimaryProvider() {
        return primaryProvider;
    }

    public void setPrimaryProvider(String primaryProvider) {
        this.primaryProvider = primaryProvider;
    }
}
