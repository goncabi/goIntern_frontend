package com.example.application.views;

import com.vaadin.flow.component.HasValue;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
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


import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.LocalDate;


import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;


@Route("praktikumsformular") //  der Anwendung
@CssImport("./styles.css")
public class Praktikumsformular extends Div {
    // Studentendaten
    private  TextField matrikelnummer;
    private  TextField nameStudentin;
    private  TextField vornameStudentin;
    private  DatePicker gebDatumStudentin;
    private  TextField strasseStudentin;
    private  NumberField hausnummerStudentin;
    private  NumberField plzStudentin;
    private  TextField ortStudentin;
    private  TextField telefonnummerStudentin;
    private  EmailField emailStudentin;
    private  TextField vorschlagPraktikumsbetreuerIn;
    private  TextField praktikumssemester;
    private  NumberField studiensemester;
    private  TextField studiengang;
    private  TextArea begleitendeLehrVeranstaltungen;

    // Zusatzinformationen
    private  Checkbox voraussetzendeLeistungsnachweise;
    private  TextArea fehlendeLeistungsnachweise;
    private  Checkbox ausnahmeZulassung;
    private  DatePicker datumAntrag;

    // Praktikumsdaten
    private  TextField namePraktikumsstelle;
    private  TextField strassePraktikumsstelle;
    private  NumberField plzPraktikumsstelle;
    private  TextField ortPraktikumsstelle;
    private  TextField landPraktikumsstelle;
    private  TextField ansprechpartnerPraktikumsstelle;
    private  TextField telefonPraktikumsstelle;
    private  EmailField emailPraktikumsstelle;
    private  TextField abteilung;
    private  TextArea taetigkeit;
    private  DatePicker startdatum;
    private  DatePicker enddatum;

    private boolean gespeichert = false; // Standardwert: nicht gespeichert
    private final RestTemplate restTemplate = new RestTemplate();



    public Praktikumsformular() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

        // Felder initialisieren
        nameStudentin = createTextField("Name der Studentin *");
        vornameStudentin = createTextField("Vorname der Studentin *");
        gebDatumStudentin = createDatePicker("Geburtsdatum *");
        strasseStudentin = createTextField("Straße der Studentin *");
        hausnummerStudentin = createNumberField("Hausnummer der Studentin *");
        plzStudentin = createNumberField("Postleitzahl der Studentin *");
        ortStudentin = createTextField("Ort der Studentin *");
        telefonnummerStudentin = createTextField("Telefonnummer der Studentin *");
        emailStudentin = createEmailField("E-Mail-Adresse der Studentin *");
        vorschlagPraktikumsbetreuerIn = createTextField("Vorgeschlagener Praktikumsbetreuer (an der HTW) *");
        praktikumssemester = createTextField("Praktikumssemester (SoSe / WS) *");
        studiensemester = createNumberField("Studiensemester *");
        studiengang = createTextField("Studiengang *");
        begleitendeLehrVeranstaltungen = createTextArea("Begleitende Lehrveranstaltungen *");

        voraussetzendeLeistungsnachweise = new Checkbox("Voraussetzende Leistungsnachweise *");
        fehlendeLeistungsnachweise = createTextArea("Fehlende Leistungsnachweise *");
        ausnahmeZulassung = new Checkbox("Antrag auf Ausnahmezulassung *");
        datumAntrag = createDatePicker("Datum des Antrags *");

        namePraktikumsstelle = createTextField("Name der Praktikumsstelle *");
        strassePraktikumsstelle = createTextField("Straße der Praktikumsstelle *");
        plzPraktikumsstelle = createNumberField("Postleitzahl der Praktikumsstelle *");
        ortPraktikumsstelle = createTextField("Ort der Praktikumsstelle *");
        landPraktikumsstelle = createTextField("Land der Praktikumsstelle *");
        ansprechpartnerPraktikumsstelle = createTextField("Ansprechpartner der Praktikumsstelle *");
        telefonPraktikumsstelle = createTextField("Telefon der Praktikumsstelle *");
        emailPraktikumsstelle = createEmailField("E-Mail-Adresse der Praktikumsstelle *");
        abteilung = createTextField("Abteilung *");
        taetigkeit = createTextArea("Tätigkeit der Praktikantin / des Praktikanten *");
        startdatum = createDatePicker("Startdatum des Praktikums *");
        enddatum = createDatePicker("Enddatum des Praktikums *");

        // Matrikelnummer aus der Session holen
        String matrikelnummerValue = (String) VaadinSession.getCurrent()
                                                           .getAttribute("matrikelnummer");
        Boolean neuerAntrag = (Boolean) VaadinSession.getCurrent()
                                                     .getAttribute("neuerAntrag");

        if(matrikelnummerValue == null) {
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

        if(neuerAntrag != null && neuerAntrag) {
            // Neuer Antrag stellen: Formular bleibt leer
            Notification.show("Erstellen Sie einen neuen Antrag.",
                              3000,
                              Notification.Position.TOP_CENTER);
        } else {
            // Bearbeiten: Daten aus dem Backend laden
            JSONObject antragJson = getPraktikumsantragFromBackend(matrikelnummerValue);
            if(antragJson == null) {
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
                                 ausnahmeZulassung,
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
        speichernButton.addThemeVariants(ButtonVariant.LUMO_SUCCESS);

        speichernButton.addClickListener(e -> {
            try {
                String json = createJson("GESPEICHERT");
                sendJsonToBackend(json,
                                  "http://localhost:3000/api/antrag/speichern",
                                  "Antrag erfolgreich gespeichert!");
                gespeichert = true; // Daten wurden gespeichert
                UI.getCurrent().navigate("studentin/startseite"); // Navigiere nach "Startseite"

            }
            catch(Exception ex) {
                Notification.show("Ein Fehler ist aufgetreten: " + ex.getMessage(),
                                  3000,
                                  Notification.Position.TOP_CENTER);
            }
        });


        Button absendenButton = new Button("Absenden");
        absendenButton.addThemeVariants(ButtonVariant.LUMO_PRIMARY,
                                        ButtonVariant.LUMO_SUCCESS);



        // Abbrechen Button
        Button abbrechenButton = new Button("Abbrechen");
        abbrechenButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST);
        abbrechenButton.addClickListener(e -> {

            if(!gespeichert) {
                ConfirmDialog dialog = new ConfirmDialog();
                dialog.setHeader("Daten nicht gespeichert");
                dialog.setText("Möchten Sie die Eingabe wirklich verwerfen?");
                dialog.setConfirmButton("Ja",
                                        confirmEvent -> UI.getCurrent().getPage().setLocation("studentin/startseite"));// Navigiere nach "Startseite"
                dialog.setCancelButton("Nein",
                                       cancelEvent -> dialog.close());
                dialog.open();
            } else {
                UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Startseite"
            }
        });

        Div buttonContainer = new Div(speichernButton,
                                      abbrechenButton,
                                      absendenButton);
        buttonContainer.addClassName("button-container"); //hinzufügen aus css

        absendenButton.addClickListener(e -> {
            if(validateAllFields()) {
                pflichtfeldHinweis.setVisible(false);
                try {
                    String json = createJson("Antrag eingereicht");
                    sendJsonToBackend(json,
                                      "http://localhost:3000/api/antrag/uebermitteln",
                                      "Antrag erfolgreich eingereicht!");
                    UI.getCurrent().getPage().setLocation("studentin/startseite");// Navigiere nach "Startseite"
                }
                catch(Exception ex) {
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
                        .set("color",
                             "gray")
                        .set("font-size",
                             "0.9em")
                        .set("margin-bottom",
                             "20px");

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
        return field.getValue() != null ? field.getValue()
                                               .intValue() : 0;
    }

    private String getValue(HasValue<?, ?> field) {
        return field.getValue() != null ? field.getValue()
                                               .toString() : "";
    }


    private String createJson(String statusAntrag) {
        return String.format(
                "{" + "\"matrikelnummer\": \"%s\"," + "\"nameStudentin\": \"%s\"," + "\"vornameStudentin\": \"%s\"," +
                "\"gebDatumStudentin\": \"%s\"," + "\"strasseStudentin\": \"%s\"," + "\"hausnummerStudentin\": %d," +
                "\"plzStudentin\": %d," + "\"ortStudentin\": \"%s\"," + "\"telefonnummerStudentin\": \"%s\"," +
                "\"emailStudentin\": \"%s\"," + "\"vorschlagPraktikumsbetreuerIn\": \"%s\"," +
                "\"praktikumssemester\": \"%s\"," + "\"studiensemester\": %d," + "\"studiengang\": \"%s\"," +
                "\"begleitendeLehrVeranstaltungen\": \"%s\"," + "\"voraussetzendeLeistungsnachweise\": %b," +
                "\"fehlendeLeistungsnachweise\": \"%s\"," + "\"ausnahmeZulassung\": %b," + "\"datumAntrag\": \"%s\"," +
                "\"namePraktikumsstelle\": \"%s\"," + "\"strassePraktikumsstelle\": \"%s\"," +
                "\"plzPraktikumsstelle\": %d," + "\"ortPraktikumsstelle\": \"%s\"," +
                "\"landPraktikumsstelle\": \"%s\"," + "\"ansprechpartnerPraktikumsstelle\": \"%s\"," +
                "\"telefonPraktikumsstelle\": \"%s\"," + "\"emailPraktikumsstelle\": \"%s\"," +
                "\"abteilung\": \"%s\"," + "\"taetigkeit\": \"%s\"," + "\"startdatum\": \"%s\"," +
                "\"enddatum\": \"%s\"," + "\"statusAntrag\": \"%s\"" + "}",
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
                statusAntrag);
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

        if(response.statusCode() == 200 || response.statusCode() == 201) {
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
            if(response.getStatusCode()
                       .is2xxSuccessful()) {
                return new JSONObject(response.getBody()); // Devuelve el JSON como objeto
            }
        }
        catch(Exception e) {
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
            gebDatumStudentin.setValue(LocalDate.parse(antragJson.optString("gebDatumStudentin", "1970-01-01")));
            strasseStudentin.setValue(antragJson.optString("strasseStudentin", ""));
            hausnummerStudentin.setValue(antragJson.optDouble("hausnummerStudentin", 0.0));
            plzStudentin.setValue(antragJson.optDouble("plzStudentin", 0.0));
            ortStudentin.setValue(antragJson.optString("ortStudentin", ""));
            telefonnummerStudentin.setValue(antragJson.optString("telefonnummerStudentin", ""));
            emailStudentin.setValue(antragJson.optString("emailStudentin", ""));
            vorschlagPraktikumsbetreuerIn.setValue(antragJson.optString("vorschlagPraktikumsbetreuerIn", ""));
            praktikumssemester.setValue(antragJson.optString("praktikumssemester", ""));
            studiensemester.setValue(antragJson.optDouble("studiensemester", 0.0));
            studiengang.setValue(antragJson.optString("studiengang", ""));
            begleitendeLehrVeranstaltungen.setValue(antragJson.optString("begleitendeLehrVeranstaltungen", ""));

            // Zusatzinformationen
            voraussetzendeLeistungsnachweise.setValue(antragJson.optBoolean("voraussetzendeLeistungsnachweise", false));
            fehlendeLeistungsnachweise.setValue(antragJson.optString("fehlendeLeistungsnachweise", ""));
            ausnahmeZulassung.setValue(antragJson.optBoolean("ausnahmeZulassung", false));
            datumAntrag.setValue(LocalDate.parse(antragJson.optString("datumAntrag", "1970-01-01")));

            // Praktikumsdaten
            namePraktikumsstelle.setValue(antragJson.optString("namePraktikumsstelle", ""));
            strassePraktikumsstelle.setValue(antragJson.optString("strassePraktikumsstelle", ""));
            plzPraktikumsstelle.setValue(antragJson.optDouble("plzPraktikumsstelle", 0.0));
            ortPraktikumsstelle.setValue(antragJson.optString("ortPraktikumsstelle", ""));
            landPraktikumsstelle.setValue(antragJson.optString("landPraktikumsstelle", ""));
            ansprechpartnerPraktikumsstelle.setValue(antragJson.optString("ansprechpartnerPraktikumsstelle", ""));
            telefonPraktikumsstelle.setValue(antragJson.optString("telefonPraktikumsstelle", ""));
            emailPraktikumsstelle.setValue(antragJson.optString("emailPraktikumsstelle", ""));
            abteilung.setValue(antragJson.optString("abteilung", ""));
            taetigkeit.setValue(antragJson.optString("taetigkeit", ""));
            startdatum.setValue(LocalDate.parse(antragJson.optString("startdatum", "1970-01-01")));
            enddatum.setValue(LocalDate.parse(antragJson.optString("enddatum", "1970-01-01"))); // Aquí estaba el problema

        } catch (Exception e) {
            Notification.show("Fehler beim Laden der Felder: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }


}