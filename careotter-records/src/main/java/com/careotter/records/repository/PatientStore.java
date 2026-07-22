package com.careotter.records.repository;

import java.util.Enumeration;
import java.util.Hashtable;
import java.util.List;
import java.util.Vector;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Repository;

import com.careotter.records.model.MedicalRecord;
import com.careotter.records.model.Patient;
import com.careotter.records.util.DateUtil;

/**
 * In-memory patient store. Predates the ORM layer; kept for the
 * demo dataset used by the front-desk portal.
 */
@Repository
public class PatientStore {

    private static final Logger LOG = Logger.getLogger(PatientStore.class);

    private final Hashtable patients = new Hashtable();
    private final Vector records = new Vector();

    public PatientStore() {
        seed();
    }

    private void seed() {
        addPatient(new Patient("PT-100234", "Margaret Chen",
                DateUtil.parse("1958-03-14"), "MRN 100234", "Dr. Alvarez"));
        addPatient(new Patient("PT-100871", "James Whitfield",
                DateUtil.parse("1979-11-02"), "MRN 100871", "Dr. Okafor"));
        addPatient(new Patient("PT-101440", "Sofia Ramirez",
                DateUtil.parse("1991-07-27"), "MRN 101440", "Dr. Alvarez"));
        addPatient(new Patient("PT-102055", "Harold Nguyen",
                DateUtil.parse("1946-01-09"), "MRN 102055", "Dr. Patel"));

        records.add(new MedicalRecord("REC-5001", "PT-100234", DateUtil.parse("2026-06-02"),
                "Dr. Alvarez", "Z00.00", "Annual physical, labs ordered"));
        records.add(new MedicalRecord("REC-5002", "PT-102055", DateUtil.parse("2026-06-24"),
                "Dr. Patel", "I25.10", "Cardiology follow-up, stable"));
        records.add(new MedicalRecord("REC-5003", "PT-101440", DateUtil.parse("2026-07-01"),
                "Dr. Alvarez", "J06.9", "Office visit, URI symptoms"));

        LOG.info("Seeded " + patients.size() + " patients and " + records.size() + " records");
    }

    public void addPatient(Patient patient) {
        patients.put(patient.getId(), patient);
    }

    public Patient findById(String id) {
        return (Patient) patients.get(id);
    }

    public List findAllPatients() {
        Vector result = new Vector();
        Enumeration e = patients.elements();
        while (e.hasMoreElements()) {
            result.add(e.nextElement());
        }
        return result;
    }

    public List findRecordsForPatient(String patientId) {
        Vector result = new Vector();
        for (int i = 0; i < records.size(); i++) {
            MedicalRecord record = (MedicalRecord) records.get(i);
            if (record.getPatientId().equals(patientId)) {
                result.add(record);
            }
        }
        return result;
    }
}
