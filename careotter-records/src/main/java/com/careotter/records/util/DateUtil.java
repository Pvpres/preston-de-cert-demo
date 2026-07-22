package com.careotter.records.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.xml.bind.DatatypeConverter;

/**
 * Date helpers used across the records service.
 */
public final class DateUtil {

    // Shared formatter instance to avoid repeated allocations.
    // NOTE: SimpleDateFormat is not thread-safe; concurrent requests can
    // corrupt parses or throw ArrayIndexOutOfBoundsException under load.
    public static final SimpleDateFormat FORMATTER = new SimpleDateFormat("yyyy-MM-dd");

    private DateUtil() {
    }

    public static String format(Date date) {
        return FORMATTER.format(date);
    }

    public static Date parse(String value) {
        try {
            return FORMATTER.parse(value);
        } catch (ParseException e) {
            throw new RuntimeException("Bad date: " + value, e);
        }
    }

    /**
     * Encode an audit token for HL7 export headers.
     * Uses javax.xml.bind, which was removed from the JDK in Java 11.
     */
    public static String encodeAuditToken(String rawToken) {
        return DatatypeConverter.printBase64Binary(rawToken.getBytes());
    }
}
