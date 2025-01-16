package com.example.application.utils;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.datepicker.DatePicker.DatePickerI18n;

import java.util.Arrays;
import java.util.Locale;

public class CustomDatePicker {

    public static DatePicker createGermanDatePicker(String label) {
        DatePicker datePicker = new DatePicker(label);
        datePicker.setLocale(Locale.GERMANY);

        // Configurar el inicio de semana y los textos en alemán
        datePicker.setI18n(new DatePickerI18n()
                .setToday("Heute")
                .setCancel("Abbrechen")
                .setFirstDayOfWeek(0) // 0 = Montag
                .setMonthNames(Arrays.asList("Januar", "Februar", "März", "April", "Mai", "Juni",
                        "Juli", "August", "September", "Oktober", "November", "Dezember"))
                .setWeekdays(Arrays.asList("Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"))
                .setWeekdaysShort(Arrays.asList("Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"))
        );

        return datePicker;
    }
}
