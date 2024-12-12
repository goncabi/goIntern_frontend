package com.example.application.views;

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

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

import com.vaadin.flow.router.Route;

@Route("praktikumsformular") // Startseite der Anwendung
@CssImport("./styles.css")
public class Praktikumsformular extends Div {

    private boolean gespeichert = false;

    public Praktikumsformular() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

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


        TextField matrikelnummer = createRequiredTextField("Matrikelnummer *");
        TextField nameStudentin = createRequiredTextField("Name der Studentin *");
        TextField vornameStudentin = createRequiredTextField("Vorname der Studentin *");
        DatePicker gebDatumStudentin = createRequiredDatePicker("Geburtsdatum *");
        TextField strasseStudentin = createRequiredTextField("Straße der Studentin *");
        NumberField hausnummerStudentin = createRequiredNumberField("Hausnummer der Studentin *");
        NumberField plzStudentin = createRequiredNumberField("Postleitzahl der Studentin *");
        TextField ortStudentin = createRequiredTextField("Ort der Studentin *");
        TextField telefonnummerStudentin = createRequiredTextField("Telefonnummer der Studentin *");
        EmailField emailStudentin = createRequiredEmailField("E-Mail-Adresse der Studentin *");
        TextField vorschlagPraktikumsbetreuerIn = createRequiredTextField("Vorgeschlagener Praktikumsbetreuer (an der HTW) *");
        TextField praktikumssemester = createRequiredTextField("Praktikumssemester (SoSe / WS) *");
        NumberField studiensemester = createRequiredNumberField("Studiensemester *");
        TextField studiengang = createRequiredTextField("Studiengang *");
        TextArea begleitendeLehrVeranstaltungen = createRequiredTextArea("Begleitende Lehrveranstaltungen");

        Checkbox voraussetzendeLeistungsnachweise = new Checkbox("Voraussetzende Leistungsnachweise");
        TextArea fehlendeLeistungsnachweise = new TextArea("Fehlende Leistungsnachweise");
        Checkbox ausnahmeZulassung = new Checkbox("Antrag auf Ausnahmezulassung");
        DatePicker datumAntrag = createRequiredDatePicker("Datum des Antrags *");
        // TextArea ausnahmeBegruendung = new TextArea("Begründung für Ausnahmezulassung"); auskommentiert, wie haben die variable ausnahmeBegruendung nicht im Backend
        //ausnahmeBegruendung.setVisible(false);

        // Event-Listener für Checkbox
        //usnahmeZulassung.addValueChangeListener(event -> ausnahmeBegruendung.setVisible(event.getValue()));

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

        // Pflichtfelder für Praktikumsdaten
        TextField namePraktikumsstelle = createRequiredTextField("Name der Praktikumsstelle *");
        TextField strassePraktikumsstelle = createRequiredTextField("Straße der Praktikumsstelle *");
        NumberField plzPraktikumsstelle = createRequiredNumberField("Postleitzahl der Praktikumsstelle *");
        TextField ortPraktikumsstelle = createRequiredTextField("Ort der Praktikumsstelle *");
        TextField landPraktikumsstelle = createRequiredTextField("Land der Praktikumsstelle *");
        TextField ansprechpartnerPraktikumsstelle = createRequiredTextField("Ansprechpartner der Praktikumsstelle *");
        TextField telefonPraktikumsstelle = createRequiredTextField("Telefon der Praktikumsstelle *");
        EmailField emailPraktikumsstelle = createRequiredEmailField("E-Mail-Adresse der Praktikumsstelle *");
        TextField abteilung = createRequiredTextField("Abteilung *");
        TextArea taetigkeit = createRequiredTextArea("Tätigkeit der Praktikantin / des Praktikanten *");
        DatePicker startdatum = createRequiredDatePicker("Startdatum des Praktikums *");
        DatePicker enddatum = createRequiredDatePicker("Enddatum des Praktikums *");


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
        praktikumsdatenContainer.add(pflichtfeldHinweis);
        Button speichernButton = new Button("Speichern");
        speichernButton.addClassName("speichern-button");

        speichernButton.addClickListener(e -> {
            // JSON mit allen notwendigen Feldern erstellen
            String json = String.format(
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
                    matrikelnummer.getValue(),
                    nameStudentin.getValue(),
                    vornameStudentin.getValue(),
                    gebDatumStudentin.getValue(),
                    strasseStudentin.getValue(),
                    hausnummerStudentin.getValue().intValue(),
                    plzStudentin.getValue().intValue(),
                    ortStudentin.getValue(),
                    telefonnummerStudentin.getValue(),
                    emailStudentin.getValue(),
                    vorschlagPraktikumsbetreuerIn.getValue(),
                    praktikumssemester.getValue(),
                    studiensemester.getValue().intValue(),
                    studiengang.getValue(),
                    begleitendeLehrVeranstaltungen.getValue(),
                    voraussetzendeLeistungsnachweise.getValue(), // Checkbox oder Boolean
                    fehlendeLeistungsnachweise.getValue(),
                    ausnahmeZulassung.getValue(), // Checkbox oder Boolean
                    datumAntrag.getValue(),
                    namePraktikumsstelle.getValue(),
                    strassePraktikumsstelle.getValue(),
                    plzPraktikumsstelle.getValue().intValue(),
                    ortPraktikumsstelle.getValue(),
                    landPraktikumsstelle.getValue(),
                    ansprechpartnerPraktikumsstelle.getValue(),
                    telefonPraktikumsstelle.getValue(),
                    emailPraktikumsstelle.getValue(),
                    abteilung.getValue(),
                    taetigkeit.getValue(),
                    startdatum.getValue(),
                    enddatum.getValue(),
                    "GESPEICHERT" // Status beim Speichern
            );

            // JSON an den Backend-Endpunkt senden
            try {
                HttpClient client = HttpClient.newHttpClient();
                HttpRequest request = HttpRequest.newBuilder()
                        .uri(URI.create("http://localhost:3000/api/antrag/speichern"))
                        .header("Content-Type", "application/json")
                        .POST(HttpRequest.BodyPublishers.ofString(json))
                        .build();

                HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

                if (response.statusCode() == 201) {
                    Notification.show("Antrag erfolgreich gespeichert!", 3000, Notification.Position.TOP_CENTER);
                } else {
                    Notification.show("Fehler beim Speichern: " + response.body(), 3000, Notification.Position.TOP_CENTER);
                }
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
            boolean isValid = true;

            // Validieren: Felder von Studentendaten
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

            // Validieren: Felder von Praktikumsdaten
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

            // Überprüfen, ob die Checkbox für Ausnahmezulassung ausgewählt ist
            /*if(ausnahmeZulassung.getValue()) {
                isValid &= validateField(ausnahmeBegruendung);
            }*/

            // Validierungsstatus anzeigen
            if(!isValid) {
                Notification.show("Bitte alle Pflichtfelder ausfüllen!",
                        3000,
                        Notification.Position.MIDDLE);
            } else {
                Notification.show("Antrag erfolgreich eingereicht",
                        3000,
                        Notification.Position.TOP_CENTER);
            }
        });

        // Hinzufügen aller Container und Buttons
        add(studentendatenContainer,
                praktikumsdatenContainer,
                buttonContainer,
                zurueckButton);
    }

    private TextField createRequiredTextField(String label) {
        return new TextField(label);
    }

    private NumberField createRequiredNumberField(String label) {
        return new NumberField(label);
    }

    private EmailField createRequiredEmailField(String label) {
        return new EmailField(label);
    }

    private DatePicker createRequiredDatePicker(String label) {
        return new DatePicker(label);
    }

    private TextArea createRequiredTextArea(String label) {
        return new TextArea(label);
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
}


