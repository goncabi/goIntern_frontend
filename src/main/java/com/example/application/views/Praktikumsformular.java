package com.example.application.views;

import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.confirmdialog.ConfirmDialog;
import com.vaadin.flow.component.datepicker.DatePicker;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.NumberField;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.icon.Icon;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;


import com.vaadin.flow.router.Route;



@Route("praktikumsformular") // Startseite der Anwendung
@CssImport("./styles.css")
public class Praktikumsformular extends Div {

    // Studentendaten
    private TextField matrikelnummer;
    private TextField nameStudentin;
    private TextField vornameStudentin;
    private DatePicker gebDatumStudentin;
    private TextField strasseStudentin;
    private NumberField hausnummerStudentin;
    private NumberField plzStudentin;
    private TextField ortStudentin;
    private TextField telefonnummerStudentin;
    private EmailField emailStudentin;
    private TextField vorschlagPraktikumsbetreuerIn;
    private TextField praktikumssemester;
    private NumberField studiensemester;
    private TextField studiengang;
    private TextArea begleitendeLehrVeranstaltungen;

    // Zusatzinformationen
    private Checkbox voraussetzendeLeistungsnachweise;
    private TextArea fehlendeLeistungsnachweise;
    private Checkbox ausnahmeZulassung;
    private DatePicker datumAntrag;

    // Praktikumsdaten
    private TextField namePraktikumsstelle;
    private TextField strassePraktikumsstelle;
    private NumberField plzPraktikumsstelle;
    private TextField ortPraktikumsstelle;
    private TextField landPraktikumsstelle;
    private TextField ansprechpartnerPraktikumsstelle;
    private TextField telefonPraktikumsstelle;
    private EmailField emailPraktikumsstelle;
    private TextField abteilung;
    private TextArea taetigkeit;
    private DatePicker startdatum;
    private DatePicker enddatum;

    private boolean gespeichert = false; // Standardwert: nicht gespeichert


    public Praktikumsformular() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

            // Felder initialisieren
            matrikelnummer = createRequiredTextField("Matrikelnummer *");
            nameStudentin = createRequiredTextField("Name der Studentin *");
            vornameStudentin = createRequiredTextField("Vorname der Studentin *");
            gebDatumStudentin = createRequiredDatePicker("Geburtsdatum *");
            strasseStudentin = createRequiredTextField("Straße der Studentin *");
            hausnummerStudentin = createRequiredNumberField("Hausnummer der Studentin *");
            plzStudentin = createRequiredNumberField("Postleitzahl der Studentin *");
            ortStudentin = createRequiredTextField("Ort der Studentin *");
            telefonnummerStudentin = createRequiredTextField("Telefonnummer der Studentin *");
            emailStudentin = createRequiredEmailField("E-Mail-Adresse der Studentin *");
            vorschlagPraktikumsbetreuerIn = createRequiredTextField("Vorgeschlagener Praktikumsbetreuer (an der HTW) *");
            praktikumssemester = createRequiredTextField("Praktikumssemester (SoSe / WS) *");
            studiensemester = createRequiredNumberField("Studiensemester *");
            studiengang = createRequiredTextField("Studiengang *");
            begleitendeLehrVeranstaltungen = createRequiredTextArea("Begleitende Lehrveranstaltungen");

            voraussetzendeLeistungsnachweise = new Checkbox("Voraussetzende Leistungsnachweise");
            fehlendeLeistungsnachweise = createRequiredTextArea("Fehlende Leistungsnachweise");
            ausnahmeZulassung = new Checkbox("Antrag auf Ausnahmezulassung");
            datumAntrag = createRequiredDatePicker("Datum des Antrags *");

            namePraktikumsstelle = createRequiredTextField("Name der Praktikumsstelle *");
            strassePraktikumsstelle = createRequiredTextField("Straße der Praktikumsstelle *");
            plzPraktikumsstelle = createRequiredNumberField("Postleitzahl der Praktikumsstelle *");
            ortPraktikumsstelle = createRequiredTextField("Ort der Praktikumsstelle *");
            landPraktikumsstelle = createRequiredTextField("Land der Praktikumsstelle *");
            ansprechpartnerPraktikumsstelle = createRequiredTextField("Ansprechpartner der Praktikumsstelle *");
            telefonPraktikumsstelle = createRequiredTextField("Telefon der Praktikumsstelle *");
            emailPraktikumsstelle = createRequiredEmailField("E-Mail-Adresse der Praktikumsstelle *");
            abteilung = createRequiredTextField("Abteilung *");
            taetigkeit = createRequiredTextArea("Tätigkeit der Praktikantin / des Praktikanten *");
            startdatum = createRequiredDatePicker("Startdatum des Praktikums *");
            enddatum = createRequiredDatePicker("Enddatum des Praktikums *");

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


        // Layout für Studentendaten
        FormLayout studentendatenLayout = new FormLayout();
        H2 studentendatenHeader = new H2("Studentendaten");
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
                strasseStudentin,
                hausnummerStudentin,
                plzStudentin,
                ortStudentin,
                telefonnummerStudentin,
                emailStudentin,
                vorschlagPraktikumsbetreuerIn,
                praktikumssemester,
                studiensemester,
                studiengang,
                begleitendeLehrVeranstaltungen,
                voraussetzendeLeistungsnachweise,
                fehlendeLeistungsnachweise,
                datumAntrag,
                ausnahmeZulassung);

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
        praktikumsdatenLayout.add(namePraktikumsstelle,
                strassePraktikumsstelle,
                plzPraktikumsstelle,
                ortPraktikumsstelle,
                landPraktikumsstelle,
                ansprechpartnerPraktikumsstelle,
                telefonPraktikumsstelle,
                emailPraktikumsstelle,
                abteilung,
                taetigkeit,
                startdatum,
                enddatum);

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

        Button speichernButton = new Button("Speichern");
        speichernButton.addClassName("speichern-button");

        speichernButton.addClickListener(e -> {
            try {
                String json = createJson("GESPEICHERT");
                sendJsonToBackend(json, "http://localhost:3000/api/antrag/speichern", "Antrag erfolgreich gespeichert!");
                gespeichert = true; // Daten wurden gespeichert
            } catch (Exception ex) {
                Notification.show("Ein Fehler ist aufgetreten: " + ex.getMessage(), 3000, Notification.Position.TOP_CENTER);
            }
        });



        Button absendenButton = new Button("Absenden");
        absendenButton.addClassName("button");
        absendenButton.addClassName("absenden-button");

        Div buttonContainer = new Div(speichernButton,
                absendenButton);
        buttonContainer.addClassName("button-container"); //hinzufügen aus css

        //Zurück Button
        Button zurueckButton = new Button(new Icon(VaadinIcon.ARROW_LEFT));
        zurueckButton.addClickListener(e -> {

            if(!gespeichert) {
                ConfirmDialog dialog = new ConfirmDialog();
                dialog.setHeader("Daten nicht gespeichert");
                dialog.setText("Möchten Sie die Seite wirklich verlassen?");
                dialog.setConfirmButton("Ja",
                        confirmEvent -> UI.getCurrent()
                                .navigate(" ")); // Übergang Antragsübersicht (Platzhalter)
                dialog.setCancelButton("Nein",
                        cancelEvent -> dialog.close());
                dialog.open();
            } else {
                UI.getCurrent()
                        .navigate(" ");
            }
        });
        zurueckButton.addClassName("zurueck-button");


        absendenButton.addClickListener(e -> {
            if (validateAllFields()) {
                pflichtfeldHinweis.setVisible(false);
                try {
                    String json = createJson("EINGEREICHT");
                    sendJsonToBackend(json, "http://localhost:3000/api/antrag/uebermitteln", "Antrag erfolgreich eingereicht!");
                } catch (Exception ex) {
                    Notification.show("Ein Fehler ist aufgetreten: " + ex.getMessage(), 3000, Notification.Position.TOP_CENTER);
                }
            } else {
                pflichtfeldHinweis.setVisible(true);
                Notification.show("Bitte alle Pflichtfelder ausfüllen!", 3000, Notification.Position.MIDDLE);
            }
        });


        // Hinzufügen aller Container und Buttons
        add(studentendatenContainer,
                praktikumsdatenContainer,
                buttonContainer,
                zurueckButton);
    }
    private boolean validateAllFields() {
        boolean isValid = true;

        // Studentendaten validieren
        isValid &= validateField(matrikelnummer);
        isValid &= validateField(nameStudentin);
        isValid &= validateField(vornameStudentin);
        isValid &= validateField(gebDatumStudentin);
        isValid &= validateField(strasseStudentin);
        isValid &= validateField(hausnummerStudentin);
        isValid &= validateField(plzStudentin);
        isValid &= validateField(ortStudentin);
        isValid &= validateField(telefonnummerStudentin);
        isValid &= validateField(emailStudentin);
        isValid &= validateField(vorschlagPraktikumsbetreuerIn);
        isValid &= validateField(praktikumssemester);
        isValid &= validateField(studiensemester);
        isValid &= validateField(studiengang);
        isValid &= validateField(datumAntrag);

        // Praktikumsdaten validieren
        isValid &= validateField(namePraktikumsstelle);
        isValid &= validateField(strassePraktikumsstelle);
        isValid &= validateField(plzPraktikumsstelle);
        isValid &= validateField(ortPraktikumsstelle);
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
    private TextField createRequiredTextField(String label) {
        TextField field = new TextField(label);
        field.setRequiredIndicatorVisible(true);
        return field;
    }

    private NumberField createRequiredNumberField(String label) {
        NumberField field = new NumberField(label);
        field.setRequiredIndicatorVisible(true);
        return field;
    }

    private EmailField createRequiredEmailField(String label) {
        EmailField field = new EmailField(label);
        field.setRequiredIndicatorVisible(true);
        return field;
    }

    private DatePicker createRequiredDatePicker(String label) {
        DatePicker field = new DatePicker(label);
        field.setRequiredIndicatorVisible(true);
        return field;
    }

    private TextArea createRequiredTextArea(String label) {
        TextArea field = new TextArea(label);
        field.setRequiredIndicatorVisible(true);
        return field;
    }

    // Validierungsmethoden für Pflichtfelder
    private boolean validateField(TextField field) {
        if(field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(NumberField field) {
        if(field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(EmailField field) {
        if(field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(DatePicker field) {
        if(field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private boolean validateField(TextArea field) {
        if(field.isEmpty()) {
            field.addClassName("mandatory-field");
            return false;
        }
        field.removeClassName("mandatory-field");
        return true;
    }

    private int getIntValue(NumberField field) {
        return field.getValue() != null ? field.getValue().intValue() : 0;
    }
    private String getValue(HasValue<?, ?> field) {
        return field.getValue() != null ? field.getValue().toString() : "";
    }


    private String createJson(String statusAntrag) {
        return String.format(
                "{" +
                "\"matrikelnummer\": \"%s\"," +
                "\"nameStudentin\": \"%s\"," +
                "\"vornameStudentin\": \"%s\"," +
                "\"gebDatumStudentin\": \"%s\"," +
                "\"strasseStudentin\": \"%s\"," +
                "\"hausnummerStudentin\": %d," +
                "\"plzStudentin\": %d," +
                "\"ortStudentin\": \"%s\"," +
                "\"telefonnummerStudentin\": \"%s\"," +
                "\"emailStudentin\": \"%s\"," +
                "\"vorschlagPraktikumsbetreuerIn\": \"%s\"," +
                "\"praktikumssemester\": \"%s\"," +
                "\"studiensemester\": %d," +
                "\"studiengang\": \"%s\"," +
                "\"begleitendeLehrVeranstaltungen\": \"%s\"," +
                "\"voraussetzendeLeistungsnachweise\": %b," +
                "\"fehlendeLeistungsnachweise\": \"%s\"," +
                "\"ausnahmeZulassung\": %b," +
                "\"datumAntrag\": \"%s\"," +
                "\"namePraktikumsstelle\": \"%s\"," +
                "\"strassePraktikumsstelle\": \"%s\"," +
                "\"plzPraktikumsstelle\": %d," +
                "\"ortPraktikumsstelle\": \"%s\"," +
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
                getValue(matrikelnummer),
                getValue(nameStudentin),
                getValue(vornameStudentin),
                getValue(gebDatumStudentin),
                getValue(strasseStudentin),
                getIntValue(hausnummerStudentin),
                getIntValue(plzStudentin),
                getValue(ortStudentin),
                getValue(telefonnummerStudentin),
                getValue(emailStudentin),
                getValue(vorschlagPraktikumsbetreuerIn),
                getValue(praktikumssemester),
                getIntValue(studiensemester),
                getValue(studiengang),
                getValue(begleitendeLehrVeranstaltungen),
                voraussetzendeLeistungsnachweise.getValue(),
                getValue(fehlendeLeistungsnachweise),
                ausnahmeZulassung.getValue(),
                getValue(datumAntrag),
                getValue(namePraktikumsstelle),
                getValue(strassePraktikumsstelle),
                getIntValue(plzPraktikumsstelle),
                getValue(ortPraktikumsstelle),
                getValue(landPraktikumsstelle),
                getValue(ansprechpartnerPraktikumsstelle),
                getValue(telefonPraktikumsstelle),
                getValue(emailPraktikumsstelle),
                getValue(abteilung),
                getValue(taetigkeit),
                getValue(startdatum),
                getValue(enddatum),
                statusAntrag
        );
    }
    private void sendJsonToBackend(String json, String url, String successMessage) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                                         .uri(URI.create(url))
                                         .header("Content-Type", "application/json")
                                         .POST(HttpRequest.BodyPublishers.ofString(json))
                                         .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

        if (response.statusCode() == 201) {
            Notification.show(successMessage, 3000, Notification.Position.TOP_CENTER);
        } else {
            Notification.show("Fehler: " + response.body(), 3000, Notification.Position.TOP_CENTER);
        }
    }

}


