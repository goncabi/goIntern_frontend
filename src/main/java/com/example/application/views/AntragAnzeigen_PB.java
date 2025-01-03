//package com.example.application.views;
//
//import com.vaadin.flow.component.html.Div;
//import com.vaadin.flow.component.grid.Grid;
//import com.vaadin.flow.component.orderedlayout.VerticalLayout;
//import com.vaadin.flow.router.Route;
//import com.vaadin.flow.component.dependency.CssImport;
//import org.springframework.web.client.RestTemplate;
//import org.json.JSONObject;
//import java.util.ArrayList;
//import java.util.List;
//
//    @Route("praktikumsformular")
//    @CssImport("./styles.css")
//    public class AntragAnzeigen_PB extends Div {
//
//        private static final List<String> FIELDS = List.of(
//                "Matrikelnummer",
//                "Name",
//                "Vorname",
//                "Geburtsdatum",
//                "Straße",
//                "Hausnummer",
//                "PLZ",
//                "Ort",
//                "Telefonnummer",
//                "E-Mail",
//                "Vorschlag Praktikumsbetreuer*in",
//                "Praktikumssemester",
//                "Studiensemester",
//                "Studiengang",
//                "Begleitende Lehrveranstaltungen",
//                "Voraussetzende Leistungsnachweise",
//                "Fehlende Leistungsnachweise",
//                "Antrag auf Ausnahmezulassung",
//                "Datum des Antrags:",
//                "Name der Praktikumsstelle",
//                "Straße der Praktikumsstelle",
//                "PLZ der Praktikumsstelle",
//                "Ort der Praktikumsstelle",
//                "Land der Praktikumsstelle",
//                "Ansprechpartner*in der Praktikumsstelle",
//                "Telefon der Praktikumsstelle",
//                "Email der Praktikumsstelle",
//                "Abteilung",
//                "Tätigkeit",
//                "Startdatum",
//                "Enddatum"
//        );
//
//        public AntragAnzeigen_PB() {
//            VerticalLayout layout = new VerticalLayout();
//
//            // Grid initialisieren
//            Grid<KeyValue> grid = new Grid<>(KeyValue.class, false);
//
//            // Spalten manuell definieren
//            grid.addColumn(KeyValue::getKey).setHeader("Feld");
//            grid.addColumn(KeyValue::getValue).setHeader("Wert");
//
//            // Daten aus dem Backend abrufen und das Grid befüllen
//            List<KeyValue> data = fetchDataFromBackend();
//            grid.setItems(data);
//
//            layout.add(grid);
//            add(layout);
//
//        }
//
//        private List<KeyValue> fetchDataFromBackend() {
//            List<KeyValue> data = new ArrayList<>();
//
//            try {
//                // REST-Aufruf an das Backend
//                RestTemplate restTemplate = new RestTemplate();
//                String url = "http://localhost:8080/api/antrag/details"; // Beispiel-Endpoint
//                String jsonResponse = restTemplate.getForObject(url, String.class);
//
//                if (jsonResponse != null) {
//                    // JSON-Daten parsen
//                    JSONObject jsonObject = new JSONObject(jsonResponse);
//
//                    // Werte mit statischen Feldern verbinden
//                    for (String field : FIELDS) {
//                        String value = jsonObject.optString(field, "Nicht verfügbar");
//                        data.add(new KeyValue(field, value));
//                    }
//                }
//            } catch (Exception e) {
//                data.add(new KeyValue("Fehler", "Daten konnten nicht geladen werden: " + e.getMessage()));
//            }
//
//            return data;
//        }
//
//        // KeyValue Klasse für die Daten
//        public static class KeyValue {
//            private String key;
//            private String value;
//
//            public KeyValue(String key, String value) {
//                this.key = key;
//                this.value = value;
//            }
//
//            public String getKey() {
//                return key;
//            }
//
//            public String getValue() {
//                return value;
//            }
//        }
//    }
//
//
//            //@Route("praktikumsformular") //  der Anwendung
//            //@CssImport("./styles.css")
//            //public class Praktikumsformular extends Div {
//            //    // Studentendaten
//            //    private  TextField matrikelnummer;
//            //    private  TextField nameStudentin;
//            //    private  TextField vornameStudentin;
//            //    private  DatePicker gebDatumStudentin;
//            //    private  TextField strasseStudentin;
//            //    private  NumberField hausnummerStudentin;
//            //    private  NumberField plzStudentin;
//            //    private  TextField ortStudentin;
//            //    private  TextField telefonnummerStudentin;
//            //    private  EmailField emailStudentin;
//            //    private  TextField vorschlagPraktikumsbetreuerIn;
//            //    private  TextField praktikumssemester;
//            //    private  NumberField studiensemester;
//            //    private  TextField studiengang;
//            //    private  TextArea begleitendeLehrVeranstaltungen;
//            //
//            //    // Zusatzinformationen
//            //    private  Checkbox voraussetzendeLeistungsnachweise;
//            //    private  TextArea fehlendeLeistungsnachweise;
//            //    private  Checkbox ausnahmeZulassung;
//            //    private  DatePicker datumAntrag;
//            //
//            //    // Praktikumsdaten
//            //    private  TextField namePraktikumsstelle;
//            //    private  TextField strassePraktikumsstelle;
//            //    private  NumberField plzPraktikumsstelle;
//            //    private  TextField ortPraktikumsstelle;
//            //    private  TextField landPraktikumsstelle;
//            //    private  TextField ansprechpartnerPraktikumsstelle;
//            //    private  TextField telefonPraktikumsstelle;
//            //    private  EmailField emailPraktikumsstelle;
//            //    private  TextField abteilung;
//            //    private  TextArea taetigkeit;
//            //    private  DatePicker startdatum;
//            //    private  DatePicker enddatum;
//
//
//
