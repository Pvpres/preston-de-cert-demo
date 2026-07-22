package com.careotter.records.util;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Base64;

/**
 * Date helpers used across the records service.
 */
public final class DateUtil {

    // DateTimeFormatter is immutable and thread-safe, so a single shared
    // instance can be reused safely across concurrent requests.
    private static final DateTimeFormatter FORMATTER = DateTimeFormatter.ISO_LOCAL_DATE;

    private DateUtil() {
    }

    public static String format(LocalDate date) {
        return FORMATTER.format(date);
    }

    public static LocalDate parse(String value) {
        return LocalDate.parse(value, FORMATTER);
    }

    /**
     * Encode an audit token for HL7 export headers.
     */
    public static String encodeAuditToken(String rawToken) {
        return Base64.getEncoder().encodeToString(rawToken.getBytes(StandardCharsets.UTF_8));
    }
}
