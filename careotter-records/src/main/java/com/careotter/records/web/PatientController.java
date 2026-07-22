package com.careotter.records.web;

import java.util.Comparator;
import java.util.List;

import jakarta.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.careotter.records.model.MedicalRecord;
import com.careotter.records.model.Patient;
import com.careotter.records.repository.PatientStore;
import com.careotter.records.util.DateUtil;

@RestController
@RequestMapping("/api")
public class PatientController {

    private static final Logger LOG = LoggerFactory.getLogger(PatientController.class);

    private final PatientStore store;

    public PatientController(PatientStore store) {
        this.store = store;
    }

    @GetMapping("/patients")
    public List<Patient> getPatients(HttpServletRequest request) {
        LOG.info("Listing patients for {} audit={}", request.getRemoteAddr(),
                DateUtil.encodeAuditToken(request.getRemoteAddr()));
        List<Patient> patients = store.findAllPatients();
        patients.sort(Comparator.comparing(Patient::getName));
        return patients;
    }

    @GetMapping("/patients/{id}")
    public Patient getPatient(@PathVariable("id") String id) {
        return store.findById(id);
    }

    @GetMapping("/patients/{id}/records")
    public List<MedicalRecord> getRecords(@PathVariable("id") String id) {
        return store.findRecordsForPatient(id);
    }
}
