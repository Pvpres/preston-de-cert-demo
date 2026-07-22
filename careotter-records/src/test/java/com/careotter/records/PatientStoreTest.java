package com.careotter.records;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.careotter.records.model.MedicalRecord;
import com.careotter.records.model.Patient;
import com.careotter.records.repository.PatientStore;
import com.careotter.records.util.DateUtil;

class PatientStoreTest {

    private PatientStore store;

    @BeforeEach
    void setUp() {
        store = new PatientStore();
    }

    @Test
    void seedsDemoPatients() {
        List<Patient> patients = store.findAllPatients();
        assertEquals(4, patients.size());
    }

    @Test
    void findsPatientById() {
        Patient patient = store.findById("PT-100234");
        assertNotNull(patient);
        assertEquals("Margaret Chen", patient.getName());
        assertEquals("1958-03-14", DateUtil.format(patient.getDateOfBirth()));
    }

    @Test
    void findsRecordsForPatient() {
        List<MedicalRecord> records = store.findRecordsForPatient("PT-100234");
        assertEquals(1, records.size());
    }

    @Test
    void encodesAuditToken() {
        String token = DateUtil.encodeAuditToken("front-desk-1");
        assertTrue(token.length() > 0);
    }
}
