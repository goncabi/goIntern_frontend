package com.example.application.service;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Diese ServiceKlasse berechnet die Anzahl der Arbeitstage innerhalb eines angegebenen Zeitraums,
 * unter Berücksichtigung von Wochenenden und Feiertagen durch die externe Api api.feiertage.de
 *
 * @author Merlind Pohl
 * @since 29.01.2025
 */

public class ArbeitstageBerechnungsService {


    /**
     * Mapping von Bundesland-Kürzeln zu vollständigen Bundesländernamen,
     * um die Darstellung in einem Dropdown-Menü leserlicher zu gestalten.
     */

    private static final Map<String, String> BUNDESLANDER_MAP = Map.ofEntries(
            Map.entry("bw", "Baden-Württemberg"),
            Map.entry("by", "Bayern"),
            Map.entry("be", "Berlin"),
            Map.entry("bb", "Brandenburg"),
            Map.entry("hb", "Bremen"),
            Map.entry("hh", "Hamburg"),
            Map.entry("he", "Hessen"),
            Map.entry("mv", "Mecklenburg-Vorpommern"),
            Map.entry("ni", "Niedersachsen"),
            Map.entry("nw", "Nordrhein-Westfalen"),
            Map.entry("rp", "Rheinland-Pfalz"),
            Map.entry("sl", "Saarland"),
            Map.entry("sn", "Sachsen"),
            Map.entry("st", "Sachsen-Anhalt"),
            Map.entry("sh", "Schleswig-Holstein"),
            Map.entry("th", "Thüringen")
    );

    /**
     * Gibt die Map der Bundesländer zurück.
     * @return Eine Map mit Bundesland-Kürzeln als Schlüssel und deren vollständigen Namen als Werte.
     */
    public Map<String, String> getBundeslaenderMap() {
        return BUNDESLANDER_MAP;
    }

    /**
     * Wandelt einen Bundesland-Namen in das entsprechende Kürzel um,
     * um es für API-Anfragen zu verwenden.
     *
     * @param lesbaresBundesland Der vollständig ausgeschriebene Name des Bundeslandes.
     * @return Das API-Kürzel für das Bundesland.
     * @throws IllegalArgumentException Falls das ausgeschriebene Bundesland ungültig ist.
     */
    public String mappeBundeslandFuerApiKommunikation(String lesbaresBundesland) {
        System.out.println("Input-Bundesland für Mapping: " + lesbaresBundesland);
        return BUNDESLANDER_MAP.entrySet()
                .stream()
                .filter(entry -> entry.getValue().equalsIgnoreCase(lesbaresBundesland))
                .map(Map.Entry::getKey)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Ungültiges Bundesland: " + lesbaresBundesland));
    }


    /**
     * Berechnet die Anzahl der Arbeitstage (fünf Arbeitstage, Montag bis Freitag, ausgehend von einem Vollzeitpraktikum) innerhalb eines Zeitraums,
     * ohne Berücksichtigung von Feiertagen - was wir benötigen sofern Auslandspraktikum true ist, da dann keine Feiertagsberechnung vorgenommen werden kann.
     *
     * @param startDate Startdatum des Zeitraums für das Praktikum.
     * @param endDate   Enddatum des Zeitraums füt das Praktikum.
     * @return Die Anzahl der Arbeitstage ohne Feiertage.
     */
    public int berechneArbeitstageOhneFeiertage(LocalDate startDate, LocalDate endDate) {
        int arbeitstage = 0;

        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            // Prüfen, ob der Tag ein Arbeitstag ist (Montag bis Freitag)
            if (date.getDayOfWeek().getValue() >= 1 && date.getDayOfWeek().getValue() <= 5) {
                arbeitstage++;
            }
        }

        return arbeitstage;
    }

    /**
     * Berechnet die Anzahl der Arbeitstage innerhalb eines Zeitraums unter Berücksichtigung
     * von Feiertagen für ein bestimmtes Bundesland in Deutschland.
     *
     * @param startDate Startdatum des Zeitraums für das Praktikum.
     * @param endDate   Enddatum des Zeitraums füt das Praktikum.
     * @param bundesland Das Bundesland, für das die Feiertage berücksichtigt werden sollen.
     * @return Die Anzahl der Arbeitstage unter Berücksichtigung der Feiertage.
     */
    public int berechneArbeitstageMitFeiertagen(LocalDate startDate, LocalDate endDate, String bundesland) {
        // Feiertage abrufen
        Set<LocalDate> feiertage = fetchFeiertage(startDate, endDate, bundesland);

        int arbeitstage = 0;

        // Iteration über den Zeitraum
        for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
            // Prüfen, ob der Tag ein Arbeitstag ist (Montag bis Freitag)
            if (date.getDayOfWeek().getValue() >= 1 && date.getDayOfWeek().getValue() <= 5 && !feiertage.contains(date)) {
                arbeitstage++;
            }
        }

        return arbeitstage;
    }

    /**
     * Ruft Feiertage für ein bestimmtes Bundesland aus der API api-feiertage.de ab.
     *
     * @param startDate           Startdatum des Zeitraums.
     * @param endDate             Enddatum des Zeitraums.
     * @param lesbaresBundesland  Der vollständig lesbare Name des Bundeslandes.
     * @return Eine Menge (Set) von Feiertagen, die im angegebenen Zeitraum enthalten sind.
     */
    public Set<LocalDate> fetchFeiertage(LocalDate startDate, LocalDate endDate, String lesbaresBundesland) {
        String bundeslandKuerzel = mappeBundeslandFuerApiKommunikation(lesbaresBundesland); // Mapping auf API-Kürzel
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("https://get.api-feiertage.de?years=%d,%d&states=%s",
                startDate.getYear(), endDate.getYear(), bundeslandKuerzel);

        Set<LocalDate> feiertage = new HashSet<>();

        try {
            String response = restTemplate.getForObject(url, String.class);

            if (response != null) {
                // API-Antwort als JSONObject parsen
                JSONObject jsonObject = new JSONObject(response);

                // Prüfen, ob schlüssel "feiertage" existiert - also wenn feiertage im array, dann gibt es ihn
                if (jsonObject.has("feiertage")) {
                    JSONArray holidaysArray = jsonObject.getJSONArray("feiertage");

                    // Feiertage durchgehen
                    for (int i = 0; i < holidaysArray.length(); i++) {
                        JSONObject holiday = holidaysArray.getJSONObject(i);

                        LocalDate feiertag = LocalDate.parse(holiday.getString("date"));

                        if (!feiertag.isBefore(startDate) && !feiertag.isAfter(endDate)) {
                            feiertage.add(feiertag);
                        }
                    }
                } else {
                    System.err.println("Die API-Antwort enthält keinen Schlüssel 'feiertage'.");
                }
            } else {
                System.err.println("Die Antwort vom Feiertage-API war null.");
            }
        } catch (RestClientException e) {
            System.err.println("Fehler beim Abrufen der Feiertage: " + e.getMessage());
        } catch (JSONException e) {
            System.err.println("Fehler beim Verarbeiten des JSON-Objekts: " + e.getMessage());
        }

        return feiertage;
    }


}
