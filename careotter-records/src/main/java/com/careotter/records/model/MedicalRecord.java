package com.careotter.records.model;

import java.time.LocalDate;

public class MedicalRecord {

    private String recordId;
    private String patientId;
    private LocalDate visitDate;
    private String provider;
    private String diagnosisCode;
    private String notes;

    public MedicalRecord() {
    }

    public MedicalRecord(String recordId, String patientId, LocalDate visitDate,
                         String provider, String diagnosisCode, String notes) {
        this.recordId = recordId;
        this.patientId = patientId;
        this.visitDate = visitDate;
        this.provider = provider;
        this.diagnosisCode = diagnosisCode;
        this.notes = notes;
    }

    public String getRecordId() {
        return recordId;
    }

    public void setRecordId(String recordId) {
        this.recordId = recordId;
    }

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public String getDiagnosisCode() {
        return diagnosisCode;
    }

    public void setDiagnosisCode(String diagnosisCode) {
        this.diagnosisCode = diagnosisCode;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
