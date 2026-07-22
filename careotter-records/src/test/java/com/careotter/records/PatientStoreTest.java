package com.careotter.records;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;

import java.util.List;

import org.junit.Before;
import org.junit.Test;

import com.careotter.records.model.Patient;
import com.careotter.records.repository.PatientStore;
import com.careotter.records.util.DateUtil;

public class PatientStoreTest {

    private PatientStore store;

    @Before
    public void setUp() {
        store = new PatientStore();
    }

    @Test
    public void seedsDemoPatients() {
        List patients = store.findAllPatients();
        assertEquals(4, patients.size());
    }

    @Test
    public void findsPatientById() {
        Patient patient = store.findById("PT-100234");
        assertNotNull(patient);
        assertEquals("Margaret Chen", patient.getName());
        assertEquals("1958-03-14", DateUtil.format(patient.getDateOfBirth()));
    }

    @Test
    public void findsRecordsForPatient() {
        List records = store.findRecordsForPatient("PT-100234");
        assertEquals(1, records.size());
    }

    @Test
    public void encodesAuditToken() {
        String token = DateUtil.encodeAuditToken("front-desk-1");
        assertTrue(token.length() > 0);
    }
}
