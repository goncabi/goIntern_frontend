package com.example.application.views;

import com.example.application.service.ArbeitstageBerechnungsService;
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
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

/**
 * Die Klasse PraktikumsformularStudentin stellt das Formular zur Beantragung des Praktikums bereit.
 * Sie es Studierenden, ihre persönlichen Daten sowie die Daten der Praktikumsstelle einzugeben.
 * Zusätzlich ermöglicht sie die Berechnung der Arbeitstage unter Berücksichtigung von Feiertagen (im Falle von Praktikum in Deutschland)
 * und ohne Feiertage (falls Praktikum im Ausland).
 */

@Route("praktikumsformular") //  der Anwendung
@CssImport("./styles.css")
public class PraktikumsformularStudentin extends Div {

    /** Service zur Berechnung der Arbeitstage aus ServiceKlasse. */
    ArbeitstageBerechnungsService arbeitstageRechner = new ArbeitstageBerechnungsService();

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

    /** Gibt an, ob der Antrag gespeichert wurde. */
    private boolean gespeichert = false; // Standardwert: nicht gespeichert
    /** REST-Client zur Kommunikation mit dem Backend. */
    private final RestTemplate restTemplate = new RestTemplate();

    /**
     * Konstruktor der Klasse. Initialisiert das Formular und seine Felder.
     */
    public PraktikumsformularStudentin() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

        // Felder initialisieren
        nameStudentin = createTextField("Name der Student*in *");
        vornameStudentin = createTextField("Vorname der Student*in *");
        gebDatumStudentin = CustomDatePicker.createGermanDatePicker("Geburtsdatum *");
        strasseHausnummerStudentin = createTextField("Straße und Hausnummer der Student*in *");
        plzStudentin = createNumberField("Postleitzahl der Student*in *");
        ortStudentin = createTextField("Ort der Student*in *");
        telefonnummerStudentin = createTextField("Telefonnummer der Student*in *");
        emailStudentin = createEmailField("E-Mail-Adresse der Student*in *");
        vorschlagPraktikumsbetreuerIn = createTextField("Vorgeschlagene*r Praktikumsbetreuer*in (an der HTW) *");
        praktikumssemester = createTextField("Praktikumssemester (SoSe / WiSe und Jahreszahl) *");
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
        List<String> sortedBundeslaender = arbeitstageRechner.getBundeslaenderMap().values().stream()
                .sorted()
                .collect(Collectors.toList());

        bundeslandBox.setItems(sortedBundeslaender);
        bundeslandBox.setItemLabelGenerator(value -> value);  // lesbarer Name, s. map unten im code


        landPraktikumsstelle = createTextField("Land der Praktikumsstelle *");
        ansprechpartnerPraktikumsstelle = createTextField("Ansprechpartner*in der Praktikumsstelle *");
        telefonPraktikumsstelle = createTextField("Telefon der Praktikumsstelle *");
        emailPraktikumsstelle = createEmailField("E-Mail-Adresse der Praktikumsstelle *");
        abteilung = createTextField("Abteilung *");
        taetigkeit = createTextArea("Tätigkeit als Praktikant*in *");
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
            Notification.show("Bitte erstelle einen neuen Antrag.",
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
        Span hinweisArbeitstage = new Span("Hinweis: Für ein Praktikum sind mindestens 75 Arbeitstage (600 Stunden) sind erforderlich. Beachte, dass bei einem Praktikum im Ausland Feiertage nicht mit berechnet werden können. Diese müsstest du eigenständig recherchieren und von der Anzahl der Arbeitstage abziehen.");
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

            // Wenn Auslandspraktikum, wird kein Bundesland benötigt
            String bundesland = "Ja".equals(auslandspraktikumsOptionen.getValue()) ? null :
                    selectedName;

            if (startDatum == null || endDatum == null || ("Nein".equals(auslandspraktikumsOptionen.getValue()) && bundesland == null)) {
                Notification.show("Bitte fülle alle notwendigen Felder aus, damit die Arbeitstage berechnet werden können.", 3000,
                        Notification.Position.TOP_CENTER);
                return;
            }

            try {
                int arbeitstage = "Ja".equals(auslandspraktikumsOptionen.getValue())
                        ? arbeitstageRechner.berechneArbeitstageOhneFeiertage(startDatum, endDatum)
                        : arbeitstageRechner.berechneArbeitstageMitFeiertagen(startDatum, endDatum, bundesland);
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
                UI.getCurrent().navigate("studentin/startseite"); // Navigiere nach "Startseite"

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
                "Möchtest du die Eingabe wirklich verwerfen?",
                        "Ja",
                        "Abbrechen",
                        () -> UI.getCurrent().getPage().setLocation("studentin/startseite"));

                confirmDialog.open();
            } else {
                UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Startseite"
            }
        });

        /**
         * Container für die Buttons "Abbrechen", "Speichern" und "Absenden".
         */
        Div buttonContainer = new Div(abbrechenButton,
                speichernButton,
                absendenButton);
        buttonContainer.addClassName("button-container1"); //hinzufügen aus css

        /**
         * Fügt eine Click-Listener-Logik für den "Absenden"-Button hinzu.
         * Falls alle Felder validiert sind, wird der Antrag als JSON an das Backend gesendet.
         * Falls nicht, wird eine Benachrichtigung angezeigt.
         */
        absendenButton.addClickListener(e -> {
            if (validateAllFields()) {
                pflichtfeldHinweis.setVisible(false);
                try {
                    String json = createJson("Antrag eingereicht");
                    sendJsonToBackend(json,
                            "http://localhost:3000/api/antrag/uebermitteln",
                            "Antrag erfolgreich eingereicht!");
                    UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Startseite"
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

        /**
         * Erstellt einen Hinweistext für Pflichtfelder.
         */
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

    /**
     * Überprüft, ob alle Pflichtfelder ausgefüllt wurden.
     * @return true, wenn alle Felder valide sind, sonst false.
     */
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

    /**
     * Erstellt ein Textfeld mit einem gegebenen Label.
     * @param label Die Bezeichnung des Textfelds
     * @return Ein TextField-Objekt mit dem angegebenen Label
     */
    private TextField createTextField(String label) {
        return new TextField(label);
    }

    /**
     * Erstellt ein Zahlenfeld mit einem gegebenen Label.
     * @param label Die Bezeichnung des Zahlenfelds
     * @return Ein NumberField-Objekt mit dem angegebenen Label
     */
    private NumberField createNumberField(String label) {
        return new NumberField(label);
    }

    /**
     * Erstellt ein E-Mail-Feld mit einem gegebenen Label.
     * @param label Die Bezeichnung des E-Mail-Felds
     * @return Ein EmailField-Objekt mit dem angegebenen Label
     */
    private EmailField createEmailField(String label) {
        return new EmailField(label);
    }

    /**
     * Erstellt ein Datumsauswahlfeld mit einem gegebenen Label.
     * @param label Die Bezeichnung des Datumsauswahlfelds
     * @return Ein DatePicker-Objekt mit dem angegebenen Label
     */
    private DatePicker createDatePicker(String label) {
        return new DatePicker(label);
    }

    /**
     * Erstellt ein Textbereichsfeld mit einem gegebenen Label.
     * @param label Die Bezeichnung des Textbereichs
     * @return Ein TextArea-Objekt mit dem angegebenen Label
     */
    private TextArea createTextArea(String label) {
        return new TextArea(label);
    }

    /**
     * Validiert ein Eingabefeld.
     * @param field ist das zu validierende Feld
     * @return true, wenn das Feld nicht leer ist, sonst false
     */
    // Validierungsmethoden für Pflichtfelder
    private boolean validateField(TextField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    /**
     * Validiert ein NumberField, indem überprüft wird, ob es leer ist.
     * Falls das Feld leer ist, wird es visuell hervorgehoben.
     *
     * @param field Das zu validierende NumberField
     * @return true, wenn das Feld nicht leer ist, sonst false
     */
    private boolean validateField(NumberField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    /**
     * Validiert ein EmailField, indem überprüft wird, ob es leer ist.
     * Falls das Feld leer ist, wird es visuell hervorgehoben.
     *
     * @param field Das zu validierende EmailField
     * @return true, wenn das Feld nicht leer ist, sonst false
     */
    private boolean validateField(EmailField field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    /**
     * Validiert ein DatePicker-Feld, indem überprüft wird, ob es leer ist.
     * Falls das Feld leer ist, wird es visuell hervorgehoben.
     *
     * @param field Das zu validierende DatePicker-Feld
     * @return true, wenn das Feld nicht leer ist, sonst false
     */
    private boolean validateField(DatePicker field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    /**
     * Validiert ein TextArea-Feld, indem überprüft wird, ob es leer ist.
     * Falls das Feld leer ist, wird es visuell hervorgehoben.
     *
     * @param field Das zu validierende TextArea-Feld
     * @return true, wenn das Feld nicht leer ist, sonst false
     */
    private boolean validateField(TextArea field) {
        if (field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    /**
     * Validiert eine Radio-Button-Gruppe, indem überprüft wird, ob eine Option ausgewählt wurde.
     * @param group Die zu validierende RadioButtonGroup
     * @return true, wenn eine Option ausgewählt wurde, sonst false
     */
    private boolean validateField(RadioButtonGroup<String> group) {
        if (group.isEmpty()) {
            group.addClassName("mandatory-field"); // Agrega estilo para resaltar
            Notification.show("Bitte wähle eine Option für: " + group.getLabel(),
                    3000, Notification.Position.MIDDLE);
            return false;
        }
        group.removeClassName("mandatory-field"); // Limpia el estilo si es válido
        return true;
    }


    /**
     * Erstellt ein JSON-String mit den Antragsdaten.
     * @param statusAntrag Der aktuelle Status des Antrags
     * @return Ein JSON-String mit den Antragsdaten
     */
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

    /**
     * Gibt den Wert eines Eingabefelds als String zurück oder einen leeren String, falls der Wert null ist.
     *
     * @param field Das Eingabefeld
     * @return Der Wert des Feldes als String oder "" falls null
     */
    private String getValueOrEmpty(HasValue<?, ?> field) {
        return field != null && field.getValue() != null ? field.getValue().toString() : "";
    }

    /**
     * Gibt den Wert eines NumberField als Integer zurück oder 0, falls der Wert null ist.
     *
     * @param field Das NumberField
     * @return Der Wert als Integer oder 0 falls null
     */
    private int getIntValueOrZero(NumberField field) {
        return field != null && field.getValue() != null ? field.getValue().intValue() : 0;
    }


    /**
     * Sendet ein JSON-Objekt an das Backend.
     * @param json Die JSON-Daten als String
     * @param url Die Ziel-URL des Backends
     * @param successMessage Die Erfolgsmeldung
     */
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

    /**
     * Ruft einen Praktikumsantrag vom Backend ab.
     *
     * @param matrikelnummer Die Matrikelnummer der Student*in
     * @return Ein JSONObject mit den Antragsdaten oder null, falls ein Fehler auftritt
     */
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


    /**
     * Füllt die Formularfelder mit den Daten aus einem gegebenen JSONObject.
     *
     * @param antragJson Das JSONObject, das die Antragsdaten enthält
     */
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


    /**
     * Konvertiert ein Datum ins deutsche Format (dd.MM.yyyy) in ein LocalDate-Objekt.
     *
     * @param dateStr Das Datum als String im Format dd.MM.yyyy
     * @return Ein LocalDate-Objekt, das das geparste Datum repräsentiert
     * @throws IllegalArgumentException Falls das Datum nicht im erwarteten Format vorliegt
     */
    private LocalDate parseDateFromGermanFormat(String dateStr) {
        DateTimeFormatter deutschesDatumFormat = DateTimeFormatter.ofPattern("dd.MM.yyyy");
        try {
            return LocalDate.parse(dateStr, deutschesDatumFormat);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Datum konnte nicht im deutschen Format angezeigt werden: " + dateStr);
        }
    }


}
