package com.example.application.views;

import com.example.application.utils.CustomDatePicker;
import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.radiobutton.RadioButtonGroup;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.NumberField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.example.application.utils.DialogUtils;


import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.*;
import java.util.stream.Collectors;


import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;


@Route("praktikumsformular") //  der Anwendung
@CssImport("./styles.css")
public class PraktikumsformularStudentin extends Div {
    // Studentendaten
    private TextField matrikelnummer;
    private TextField nameStudentin;
    private TextField vornameStudentin;
    private DatePicker gebDatumStudentin;
    private TextField strasseHausnummerStudentin;
    private NumberField plzStudentin;
    private TextField ortStudentin;
    private TextField telefonnummerStudentin;
    private EmailField emailStudentin;
    private TextField vorschlagPraktikumsbetreuerIn;
    private TextField praktikumssemester;
    private NumberField studiensemester;
    private TextField studiengang;
    private DatePicker datumAntrag;

    // Praktikumsdaten
    private TextField namePraktikumsstelle;
    private TextField strassePraktikumsstelle;
    private NumberField plzPraktikumsstelle;
    private TextField ortPraktikumsstelle;
    private final ComboBox<String> bundeslandBox = new ComboBox<>("Bundesland");
    private RadioButtonGroup<String> auslandspraktikumsOptionen;
    private TextField landPraktikumsstelle;
    private TextField ansprechpartnerPraktikumsstelle;
    private TextField telefonPraktikumsstelle;
    private EmailField emailPraktikumsstelle;
    private TextField abteilung;
    private TextArea taetigkeit;
    private DatePicker startdatum;
    private DatePicker enddatum;

    private boolean gespeichert = false; // Standardwert: nicht gespeichert
    private final RestTemplate restTemplate = new RestTemplate();


    public PraktikumsformularStudentin() {
        // Hauptüberschrift
        add(new H1("PraktikumsformularStudentin"));

        // Felder initialisieren
        nameStudentin = createTextField("Name der Studentin *");
        vornameStudentin = createTextField("Vorname der Studentin *");
        gebDatumStudentin = CustomDatePicker.createGermanDatePicker("Geburtsdatum *");
        strasseHausnummerStudentin = createTextField("Straße und Hausnummer der Studentin *");
        plzStudentin = createNumberField("Postleitzahl der Studentin *");
        ortStudentin = createTextField("Ort der Studentin *");
        telefonnummerStudentin = createTextField("Telefonnummer der Studentin *");
        emailStudentin = createEmailField("E-Mail-Adresse der Studentin *");
        vorschlagPraktikumsbetreuerIn = createTextField("Vorgeschlagener Praktikumsbetreuer (an der HTW) *");
        praktikumssemester = createTextField("Praktikumssemester (SoSe / WiSe) *");
        studiensemester = createNumberField("Studiensemester (bitte als Zahl eingeben) *");
        studiengang = createTextField("Studiengang *");
        datumAntrag = CustomDatePicker.createGermanDatePicker("Datum des Antrags *");

        // Checkbox-Feld für Auslandspraktikum
        auslandspraktikumsOptionen = new RadioButtonGroup<>();
        auslandspraktikumsOptionen.setLabel("Ich mache mein Praktikum im Ausland");
        auslandspraktikumsOptionen.setItems("Ja", "Nein");
        auslandspraktikumsOptionen.setValue("Nein"); // default
        add(auslandspraktikumsOptionen);

        auslandspraktikumsOptionen.addValueChangeListener(event -> {
            if ("Ja".equals(event.getValue())) {
                bundeslandBox.setEnabled(false);
                bundeslandBox.setValue("keine Angabe notwendig");
            } else {
                bundeslandBox.setEnabled(true);
                bundeslandBox.clear();
            }
        });

        namePraktikumsstelle = createTextField("Name der Praktikumsstelle *");
        strassePraktikumsstelle = createTextField("Straße und Hausnummer der Praktikumsstelle *");
        plzPraktikumsstelle = createNumberField("Postleitzahl der Praktikumsstelle *");
        ortPraktikumsstelle = createTextField("Ort der Praktikumsstelle *");

        // Drop-Down mit Optionen für das Bundesland, alphabetisch geordnet
        List<String> sortedBundeslaender = BUNDESLANDER_MAP.values().stream()
                .sorted()
                .collect(Collectors.toList());

        bundeslandBox.setItems(sortedBundeslaender);
        bundeslandBox.setItemLabelGenerator(value -> value);  // lesbarer Name, s. map unten im code


        landPraktikumsstelle = createTextField("Land der Praktikumsstelle *");
        ansprechpartnerPraktikumsstelle = createTextField("Ansprechpartner der Praktikumsstelle *");
        telefonPraktikumsstelle = createTextField("Telefon der Praktikumsstelle *");
        emailPraktikumsstelle = createEmailField("E-Mail-Adresse der Praktikumsstelle *");
        abteilung = createTextField("Abteilung *");
        taetigkeit = createTextArea("Tätigkeit der Praktikantin / des Praktikanten *");
        startdatum = CustomDatePicker.createGermanDatePicker("Startdatum des Praktikums *");
        enddatum = CustomDatePicker.createGermanDatePicker("Enddatum des Praktikums *");



        // Matrikelnummer aus der Session holen
        String matrikelnummerValue = (String) VaadinSession.getCurrent()
                .getAttribute("matrikelnummer");
        Boolean neuerAntrag = (Boolean) VaadinSession.getCurrent()
                .getAttribute("neuerAntrag");

        if (matrikelnummerValue == null) {
            Notification.show("Matrikelnummer nicht gefunden. Bitte erneut einloggen.",
                    3000,
                    Notification.Position.TOP_CENTER);
            UI.getCurrent()
                    .navigate("login");
            return;
        }

        // Matrikelnummer TextField
        matrikelnummer = createTextField("Matrikelnummer *");
        matrikelnummer.setValue(matrikelnummerValue);
        matrikelnummer.setReadOnly(true);

        if (neuerAntrag != null && neuerAntrag) {
            // Neuer Antrag stellen: Formular bleibt leer
            Notification.show("Erstellen Sie einen neuen Antrag.",
                    3000,
                    Notification.Position.TOP_CENTER);
        } else {
            // Bearbeiten: Daten aus dem Backend laden
            JSONObject antragJson = getPraktikumsantragFromBackend(matrikelnummerValue);
            if (antragJson == null) {
                Notification.show("Kein Antrag gefunden!",
                        3000,
                        Notification.Position.TOP_CENTER);
            } else {
                fillFormFields(antragJson);
            }
        }


        // Container für Studentendaten
        Div studentendatenContainer = new Div();
        studentendatenContainer.getStyle()
                .set("padding",
                        "20px");
        studentendatenContainer.getStyle()
                .set("border",
                        "1px solid #ccc");
        studentendatenContainer.getStyle()
                .set("border-radius",
                        "8px");
        studentendatenContainer.getStyle()
                .set("margin-bottom",
                        "20px");
        studentendatenContainer.getStyle()
                .set("background-color",
                        "#f9f9f9");

        //berechnen button implementieren
        final Button berechnenButton = new Button("Arbeitstage berechnen");
        berechnenButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS,
                ButtonVariant.LUMO_SMALL);
        berechnenButton.getStyle().set("margin-left", "0");
        berechnenButton.addClassName("berechnen-button");

        // Hinweistext
        Span hinweisArbeitstage = new Span("Hinweis: Für ein Praktikum sind mindestens 75 Arbeitstage (600 Stunden) sind erforderlich. Beachte, dass bei einem Auslands-Praktikum Feiertage nicht mit berechnet werden können. Diese müsstest du eigenständig recherchieren und von der Anzahl der Arbeitstage abziehen.");
        hinweisArbeitstage.getStyle()
                .set("color", "gray")
                .set("font-size", "0.9em")
                .set("margin-bottom", "20px")
                .set("margin-left", "20px");


        // Klick-Listener für den Button
        berechnenButton.addClickListener(event -> {
            LocalDate startDatum = startdatum.getValue();
            LocalDate endDatum = enddatum.getValue();
            String selectedName = bundeslandBox.getValue();
            String bundesland = "Ja".equals(auslandspraktikumsOptionen.getValue()) ? null :
                    BUNDESLANDER_MAP.entrySet().stream()
                            .filter(entry -> entry.getValue().equals(selectedName))
                            .map(Map.Entry::getKey)
                            .findFirst()
                            .orElse(null);

            if (startDatum == null || endDatum == null || ("Nein".equals(auslandspraktikumsOptionen.getValue()) && bundesland == null)) {
                Notification.show("Bitte fülle alle notwendigen Felder aus, damit die Arbeitstage berechnet werden können.", 3000,
                        Notification.Position.TOP_CENTER);
                return;
            }

            try {
                int arbeitstage = "Ja".equals(auslandspraktikumsOptionen.getValue())
                        ? berechneArbeitstageOhneFeiertage(startDatum, endDatum)
                        : berechneArbeitstageMitFeiertagen(startDatum, endDatum, bundesland);
                Notification.show("Anzahl der Arbeitstage: " + arbeitstage, 4000, Notification.Position.TOP_CENTER);
            } catch (Exception e) {
                Notification.show("Fehler bei der Berechnung: " + e.getMessage());
            }
        });


        // Container für Berechnen-Button
        Div berechnenButtonContainer = new Div();
        berechnenButtonContainer.getStyle()
                .set("display", "flex") // Flexbox für bessere Kontrolle
                .set("justify-content", "flex-start") // Links ausrichten
                .set("width", "auto"); // Nur so breit wie der Inhalt

        berechnenButtonContainer.add(berechnenButton);



        // Layout für Studentendaten
        FormLayout studentendatenLayout = new FormLayout();
        H2 studentendatenHeader = new H2("Studierendendaten");
        studentendatenLayout.add(studentendatenHeader);

        // Layout für Studentendaten konfigurieren
        studentendatenLayout.setResponsiveSteps(new FormLayout.ResponsiveStep("0",
                        1)
                // 1 Spalte auf allen Bildschirmgrößen
        );

        studentendatenLayout.add(matrikelnummer,
                nameStudentin,
                vornameStudentin,
                gebDatumStudentin,
                strasseHausnummerStudentin,
                plzStudentin,
                ortStudentin,
                telefonnummerStudentin,
                emailStudentin,
                vorschlagPraktikumsbetreuerIn,
                praktikumssemester,
                studiensemester,
                studiengang,
                datumAntrag);

        studentendatenContainer.add(studentendatenLayout);

        // Container für Praktikumsdaten
        Div praktikumsdatenContainer = new Div();
        praktikumsdatenContainer.getStyle()
                .set("padding",
                        "20px");
        praktikumsdatenContainer.getStyle()
                .set("border",
                        "1px solid #ccc");
        praktikumsdatenContainer.getStyle()
                .set("border-radius",
                        "8px");
        praktikumsdatenContainer.getStyle()
                .set("background-color",
                        "#f9f9f9");

        // Layout für Praktikumsdaten
        FormLayout praktikumsdatenLayout = new FormLayout();
        H2 praktikumsdatenHeader = new H2("Daten der Ausbildungsstelle");
        praktikumsdatenLayout.add(praktikumsdatenHeader);

        // Layout für Praktikumsdaten konfigurieren (ein Feld pro Zeile)
        praktikumsdatenLayout.setResponsiveSteps(new FormLayout.ResponsiveStep("0",
                        1)
                // 1 Spalte auf allen Bildschirmgrößen
        );
        praktikumsdatenLayout.add(auslandspraktikumsOptionen,
                namePraktikumsstelle,
                strassePraktikumsstelle,
                plzPraktikumsstelle,
                ortPraktikumsstelle,
                bundeslandBox,
                landPraktikumsstelle,
                ansprechpartnerPraktikumsstelle,
                telefonPraktikumsstelle,
                emailPraktikumsstelle,
                abteilung,
                taetigkeit,
                startdatum,
                enddatum,
                berechnenButtonContainer,
                hinweisArbeitstage);

        praktikumsdatenContainer.add(praktikumsdatenLayout);



        // Pflichtfeldhinweis und Absenden-Button
        Paragraph pflichtfeldHinweis = new Paragraph("* Pflichtfeld");
        pflichtfeldHinweis.getStyle()
                .set("color",
                        "red");
        pflichtfeldHinweis.getStyle()
                .set("font-size",
                        "0.9em");
        pflichtfeldHinweis.getStyle()
                .set("margin-top",
                        "20px");
        // Anfangs unsichtbar
        pflichtfeldHinweis.setVisible(false);

        //Speichern Button
        Button speichernButton = new Button("Speichern");
        speichernButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);
        speichernButton.addClassName("speichern-button1");
        speichernButton.addClickListener(e -> {
            try {
                String json = createJson("Gespeichert");
                sendJsonToBackend(json,
                        "http://localhost:3000/api/antrag/speichern",
                        "Antrag erfolgreich gespeichert!");
                gespeichert = true; // Daten wurden gespeichert
                UI.getCurrent().navigate("studentin/startseite"); // Navigiere nach "Studentin"

            } catch (Exception ex) {
                Notification.show("Ein Fehler ist aufgetreten: " + ex.getMessage(),
                        3000,
                        Notification.Position.TOP_CENTER);
            }
        });


        Button absendenButton = new Button("Absenden");
        absendenButton.addClassName("absenden-button1");
        absendenButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY,
                ButtonVariant.LUMO_SUCCESS);


        // Abbrechen Button
        Button abbrechenButton = new Button("Abbrechen");
        abbrechenButton.addClassName("abbrechen-button1");
        abbrechenButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);
        abbrechenButton.addClickListener(e -> {

            if (!gespeichert) {
                Dialog confirmDialog = DialogUtils.createStandardDialog(
                "Daten nicht gespeichert",
                null,
                "Möchten Sie die Eingabe wirklich verwerfen?",
                        "Ja",
                        "Abbrechen",
                        () -> UI.getCurrent().getPage().setLocation("studentin/startseite"));

                confirmDialog.open();
            } else {
                UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Studentin"
            }
        });

        Div buttonContainer = new Div(abbrechenButton,
                speichernButton,
                absendenButton);
        buttonContainer.addClassName("button-container1"); //hinzufügen aus css

        absendenButton.addClickListener(e -> {
            if (validateAllFields()) {
                pflichtfeldHinweis.setVisible(false);
                try {
                    String json = createJson("Antrag eingereicht");
                    sendJsonToBackend(json,
                            "http://localhost:3000/api/antrag/uebermitteln",
                            "Antrag erfolgreich eingereicht!");
                    UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Studentin"
                } catch (Exception ex) {
                    Notification.show("Ein Fehler ist aufgetreten: " + ex.getMessage(),
                            3000,
                            Notification.Position.TOP_CENTER);
                }
            } else {
                pflichtfeldHinweis.setVisible(true);
                Notification.show("Bitte alle Pflichtfelder ausfüllen!",
                        3000,
                        Notification.Position.MIDDLE);
            }
        });

        Paragraph sternchenHinweis = new Paragraph("Hinweis: Felder mit * sind Pflichtfelder, die vor dem Absenden ausgefüllt werden müssen. Sie können den Antrag jedoch auch speichern, ohne alle Pflichtfelder auszufüllen.");

        sternchenHinweis.getStyle()
                .set("color", "gray")
                .set("font-size", "0.9em")
                .set("margin-bottom", "20px")
                .set("margin-left", "20px"); // Abstand von links hinzufügen


        // Hinzufügen aller Container und Buttons
        add(sternchenHinweis, studentendatenContainer,
                praktikumsdatenContainer,
                buttonContainer);
    }

    private boolean validateAllFields() {
        boolean isValid = true;

        // Studentendaten validieren
        isValid &= validateField(matrikelnummer);
        isValid &= validateField(nameStudentin);
        isValid &= validateField(vornameStudentin);
        isValid &= validateField(gebDatumStudentin);
        isValid &= validateField(strasseHausnummerStudentin);
        isValid &= validateField(plzStudentin);
        isValid &= validateField(ortStudentin);
        isValid &= validateField(telefonnummerStudentin);
        isValid &= validateField(emailStudentin);
        isValid &= validateField(vorschlagPraktikumsbetreuerIn);
        isValid &= validateField(praktikumssemester);
        isValid &= validateField(studiensemester);
        isValid &= validateField(studiengang);
        isValid &= validateField(datumAntrag);

        // checkbox validieren
        isValid &= validateField(auslandspraktikumsOptionen);

        // Praktikumsdaten validieren
        isValid &= validateField(namePraktikumsstelle);
        isValid &= validateField(strassePraktikumsstelle);
        isValid &= validateField(plzPraktikumsstelle);
        isValid &= validateField(ortPraktikumsstelle);

        //combo-box validieren
        isValid &= bundeslandBox.getValue() != null;

        isValid &= validateField(landPraktikumsstelle);
        isValid &= validateField(ansprechpartnerPraktikumsstelle);
        isValid &= validateField(telefonPraktikumsstelle);
        isValid &= validateField(emailPraktikumsstelle);
        isValid &= validateField(abteilung);
        isValid &= validateField(taetigkeit);
        isValid &= validateField(startdatum);
        isValid &= validateField(enddatum);

        return isValid;
    }

    private TextField createTextField(String label) {
        return new TextField(label);
    }

    private NumberField createNumberField(String label) {
        return new NumberField(label);
    }

    private EmailField createEmailField(String label) {
        return new EmailField(label);
    }

    private DatePicker createDatePicker(String label) {
        return new DatePicker(label);
    }

    private TextArea createTextArea(String label) {
        return new TextArea(label);
    }

    // Validierungsmethoden für Pflichtfelder
    private boolean validateField(TextField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(NumberField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(EmailField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(DatePicker field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(TextArea field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(RadioButtonGroup<String> group) {
        if (group.isEmpty()) {
            group.addClassName("mandatory-field"); // Agrega estilo para resaltar
            Notification.show("Bitte wählen Sie eine Option für: " + group.getLabel(),
                    3000, Notification.Position.MIDDLE);
            return false;
        }
        group.removeClassName("mandatory-field"); // Limpia el estilo si es válido
        return true;
    }


    private String createJson(String statusAntrag) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");

        // Datum-Formatierung mit null-Schutz
        String formattedGebDatum = gebDatumStudentin.getValue() != null
                ? gebDatumStudentin.getValue().format(formatter) : "";
        String formattedAntragsDatum = datumAntrag.getValue() != null
                ? datumAntrag.getValue().format(formatter) : "";
        String formattedStartDatum = startdatum.getValue() != null
                ? startdatum.getValue().format(formatter) : "";
        String formattedEndDatum = enddatum.getValue() != null
                ? enddatum.getValue().format(formatter) : "";

        // JSON-Erstellung mit null-Schutz für alle Werte
        return String.format(
                "{" +
                        "\"matrikelnummer\": \"%s\"," +
                        "\"nameStudentin\": \"%s\"," +
                        "\"vornameStudentin\": \"%s\"," +
                        "\"gebDatumStudentin\": \"%s\"," +
                        "\"strasseHausnummerStudentin\": \"%s\"," +
                        "\"plzStudentin\": %d," +
                        "\"ortStudentin\": \"%s\"," +
                        "\"telefonnummerStudentin\": \"%s\"," +
                        "\"emailStudentin\": \"%s\"," +
                        "\"vorschlagPraktikumsbetreuerIn\": \"%s\"," +
                        "\"praktikumssemester\": \"%s\"," +
                        "\"studiensemester\": %d," +
                        "\"studiengang\": \"%s\"," +
                        "\"datumAntrag\": \"%s\"," +
                        "\"auslandspraktikum\": %b," +
                        "\"namePraktikumsstelle\": \"%s\"," +
                        "\"strassePraktikumsstelle\": \"%s\"," +
                        "\"plzPraktikumsstelle\": %d," +
                        "\"ortPraktikumsstelle\": \"%s\"," +
                        "\"bundeslandPraktikumsstelle\": \"%s\"," +
                        "\"landPraktikumsstelle\": \"%s\"," +
                        "\"ansprechpartnerPraktikumsstelle\": \"%s\"," +
                        "\"telefonPraktikumsstelle\": \"%s\"," +
                        "\"emailPraktikumsstelle\": \"%s\"," +
                        "\"abteilung\": \"%s\"," +
                        "\"taetigkeit\": \"%s\"," +
                        "\"startdatum\": \"%s\"," +
                        "\"enddatum\": \"%s\"," +
                        "\"statusAntrag\": \"%s\"" +
                        "}",
                getValueOrEmpty(matrikelnummer),
                getValueOrEmpty(nameStudentin),
                getValueOrEmpty(vornameStudentin),
                formattedGebDatum,
                getValueOrEmpty(strasseHausnummerStudentin),
                getIntValueOrZero(plzStudentin),
                getValueOrEmpty(ortStudentin),
                getValueOrEmpty(telefonnummerStudentin),
                getValueOrEmpty(emailStudentin),
                getValueOrEmpty(vorschlagPraktikumsbetreuerIn),
                getValueOrEmpty(praktikumssemester),
                getIntValueOrZero(studiensemester),
                getValueOrEmpty(studiengang),
                formattedAntragsDatum,
                getValueOrEmpty(auslandspraktikumsOptionen).equals("Ja"),
                getValueOrEmpty(namePraktikumsstelle),
                getValueOrEmpty(strassePraktikumsstelle),
                getIntValueOrZero(plzPraktikumsstelle),
                getValueOrEmpty(ortPraktikumsstelle),
                bundeslandBox.getValue(),
                getValueOrEmpty(landPraktikumsstelle),
                getValueOrEmpty(ansprechpartnerPraktikumsstelle),
                getValueOrEmpty(telefonPraktikumsstelle),
                getValueOrEmpty(emailPraktikumsstelle),
                getValueOrEmpty(abteilung),
                getValueOrEmpty(taetigkeit),
                formattedStartDatum,
                formattedEndDatum,
                statusAntrag != null ? statusAntrag : "Unbekannt"
        );
    }

// Hilfsmethoden

    private String getValueOrEmpty(HasValue<?, ?> field) {
        return field != null && field.getValue() != null ? field.getValue().toString() : "";
    }

    private int getIntValueOrZero(NumberField field) {
        return field != null && field.getValue() != null ? field.getValue().intValue() : 0;
    }


    private void sendJsonToBackend(String json, String url, String successMessage)
            throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        // Verwende den HttpClient

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type",
                        "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        HttpResponse<String> response = client.send(request,
                HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 200 || response.statusCode() == 201) {
            Notification.show(successMessage,
                    3000,
                    Notification.Position.TOP_CENTER);
        } else {
            Notification.show("Fehler: " + response.body(),
                    3000,
                    Notification.Position.TOP_CENTER);
        }
    }

    private JSONObject getPraktikumsantragFromBackend(String matrikelnummer) {
        String url = "http://localhost:3000/api/antrag/getantrag/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url,
                    HttpMethod.GET,
                    null,
                    String.class);
            if (response.getStatusCode()
                    .is2xxSuccessful()) {
                return new JSONObject(response.getBody()); // Devuelve el JSON como objeto
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen des Antrags: " + e.getMessage(),
                    3000,
                    Notification.Position.TOP_CENTER);
        }
        return null;
    }


    private void fillFormFields(JSONObject antragJson) {
        try {


            // Studentendaten
            nameStudentin.setValue(antragJson.optString("nameStudentin", ""));
            vornameStudentin.setValue(antragJson.optString("vornameStudentin", ""));
            String gebDatumStr = antragJson.optString("gebDatumStudentin", "01.01.1981");
            if (gebDatumStr != null && !gebDatumStr.isEmpty()) {
                gebDatumStudentin.setValue(parseDateFromGermanFormat(gebDatumStr));
            } else {
                gebDatumStudentin.setValue(null);
            }
            gebDatumStudentin.setValue(parseDateFromGermanFormat(gebDatumStr));
            strasseHausnummerStudentin.setValue(antragJson.optString("strasseHausnummerStudentin", ""));
            plzStudentin.setValue(antragJson.optDouble("plzStudentin", 0.0));
            ortStudentin.setValue(antragJson.optString("ortStudentin", ""));
            telefonnummerStudentin.setValue(antragJson.optString("telefonnummerStudentin", ""));
            emailStudentin.setValue(antragJson.optString("emailStudentin", ""));
            vorschlagPraktikumsbetreuerIn.setValue(antragJson.optString("vorschlagPraktikumsbetreuerIn", ""));
            praktikumssemester.setValue(antragJson.optString("praktikumssemester", ""));
            studiensemester.setValue(antragJson.optDouble("studiensemester", 0.0));
            studiengang.setValue(antragJson.optString("studiengang", ""));
            String datumAntragStr = antragJson.optString("datumAntrag", "10.01.2025");
            datumAntrag.setValue(parseDateFromGermanFormat(datumAntragStr));
            // Checkbox Auslandpraktikum
            if (antragJson.has("auslandspraktikum")) {
                auslandspraktikumsOptionen.setValue(antragJson.getBoolean("auslandspraktikum") ? "Ja" : "Nein");
            } else {
                auslandspraktikumsOptionen.setValue("Nein");
            }
            // Praktikumsdaten
            namePraktikumsstelle.setValue(antragJson.optString("namePraktikumsstelle", ""));
            strassePraktikumsstelle.setValue(antragJson.optString("strassePraktikumsstelle", ""));
            plzPraktikumsstelle.setValue(antragJson.optDouble("plzPraktikumsstelle", 0.0));
            ortPraktikumsstelle.setValue(antragJson.optString("ortPraktikumsstelle", ""));
            bundeslandBox.setValue(antragJson.optString("bundeslandPraktikumsstelle", null));
            landPraktikumsstelle.setValue(antragJson.optString("landPraktikumsstelle", ""));
            ansprechpartnerPraktikumsstelle.setValue(antragJson.optString("ansprechpartnerPraktikumsstelle", ""));
            telefonPraktikumsstelle.setValue(antragJson.optString("telefonPraktikumsstelle", ""));
            emailPraktikumsstelle.setValue(antragJson.optString("emailPraktikumsstelle", ""));
            abteilung.setValue(antragJson.optString("abteilung", ""));
            taetigkeit.setValue(antragJson.optString("taetigkeit", ""));
            String startdatumStr = antragJson.optString("startdatum", "01.04.2025");
            startdatum.setValue(parseDateFromGermanFormat(startdatumStr));
            String enddatumStr = antragJson.optString("enddatum", "30.09.2025");
            enddatum.setValue(parseDateFromGermanFormat(enddatumStr));

        } catch (Exception e) {
            Notification.show("Fehler beim Laden der Felder: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }

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

    public Set<LocalDate> fetchFeiertage(LocalDate startDate, LocalDate endDate, String bundesland) {
        RestTemplate restTemplate = new RestTemplate();
        String url = String.format("https://get.api-feiertage.de?years=%d,%d&states=%s",
                startDate.getYear(), endDate.getYear(), bundesland.toLowerCase());

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

    private LocalDate parseDateFromGermanFormat(String dateStr) {
        DateTimeFormatter deutschesDatumFormat = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        try {
            return LocalDate.parse(dateStr, deutschesDatumFormat);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Datum konnte nicht im deutschen Format angezeigt werden: " + dateStr);
        }
    }

    //bundesländer lesbarer machen im drop-down menu
    private static final Map<String, String> BUNDESLANDER_MAP = Map.ofEntries(
            Map.entry("BW", "Baden-Württemberg"),
            Map.entry("BY", "Bayern"),
            Map.entry("BE", "Berlin"),
            Map.entry("BB", "Brandenburg"),
            Map.entry("HB", "Bremen"),
            Map.entry("HH", "Hamburg"),
            Map.entry("HE", "Hessen"),
            Map.entry("MV", "Mecklenburg-Vorpommern"),
            Map.entry("NI", "Niedersachsen"),
            Map.entry("NW", "Nordrhein-Westfalen"),
            Map.entry("RP", "Rheinland-Pfalz"),
            Map.entry("SL", "Saarland"),
            Map.entry("SN", "Sachsen"),
            Map.entry("ST", "Sachsen-Anhalt"),
            Map.entry("SH", "Schleswig-Holstein"),
            Map.entry("TH", "Thüringen")
    );

}
