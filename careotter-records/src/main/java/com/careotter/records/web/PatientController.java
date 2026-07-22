package com.careotter.records.web;

import java.util.Collections;
import java.util.Comparator;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.careotter.records.model.Patient;
import com.careotter.records.repository.PatientStore;
import com.careotter.records.util.DateUtil;

@RestController
@RequestMapping("/api")
public class PatientController {

    private static final Logger LOG = Logger.getLogger(PatientController.class);

    private final PatientStore store;

    public PatientController(PatientStore store) {
        this.store = store;
    }

    @RequestMapping(value = "/patients", method = RequestMethod.GET)
    public List getPatients(HttpServletRequest request) {
        LOG.info("Listing patients for " + request.getRemoteAddr()
                + " audit=" + DateUtil.encodeAuditToken(request.getRemoteAddr()));
        List patients = store.findAllPatients();
        Collections.sort(patients, new Comparator() {
            public int compare(Object a, Object b) {
                return ((Patient) a).getName().compareTo(((Patient) b).getName());
            }
        });
        return patients;
    }

    @RequestMapping(value = "/patients/{id}", method = RequestMethod.GET)
    public Patient getPatient(@PathVariable("id") String id) {
        return store.findById(id);
    }

    @RequestMapping(value = "/patients/{id}/records", method = RequestMethod.GET)
    public List getRecords(@PathVariable("id") String id) {
        return store.findRecordsForPatient(id);
    }
}
