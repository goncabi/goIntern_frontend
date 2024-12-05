package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.Checkbox;
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
import com.vaadin.flow.router.Route;

@Route("praktikumsformular") // Startseite der Anwendung
@CssImport("./styles.css")
public class Praktikumsformular extends Div {

    public Praktikumsformular() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

        // Container für Studentendaten
        Div studentendatenContainer = new Div();
        studentendatenContainer.getStyle().set("padding", "20px");
        studentendatenContainer.getStyle().set("border", "1px solid #ccc");
        studentendatenContainer.getStyle().set("border-radius", "8px");
        studentendatenContainer.getStyle().set("margin-bottom", "20px");
        studentendatenContainer.getStyle().set("background-color", "#f9f9f9");

        // Layout für Studentendaten
        FormLayout studentendatenLayout = new FormLayout();
        H2 studentendatenHeader = new H2("Studentendaten");
        studentendatenLayout.add(studentendatenHeader);

        // Pflichtfelder für Studentendaten
        TextField name = createRequiredTextField("Name des Studenten / der Studentin *");
        TextField vorname = createRequiredTextField("Vorname *");
        TextField matrikelnummer = createRequiredTextField("Matrikelnummer *");
        DatePicker geburtsdatum = createRequiredDatePicker("Geburtsdatum *");
        TextField adresseStrasse = createRequiredTextField("Straße *");
        TextField adressePLZ = createRequiredTextField("PLZ *");
        TextField adresseOrt = createRequiredTextField("Ort *");
        NumberField telefonnummer = createRequiredNumberField("Telefonnummer *");
        EmailField email = createRequiredEmailField("E-Mail-Adresse *");
        TextField betreuer = createRequiredTextField("Vorgeschlagener Praktikumsbetreuer (an der HTW) *");
        TextField semester = createRequiredTextField("Semester (SoSe / WS) *");
        TextField lehrveranstaltung = createRequiredTextField("Titel der praxisbegleitenden Lehrveranstaltung *");
        TextArea fehlendeNachweise = new TextArea("Fehlende Leistungsnachweise (falls vorhanden)");

        // Ausnahmezulassung Checkbox und Notizfeld
        Checkbox ausnahmezulassung = new Checkbox("Antrag auf Ausnahmezulassung");
        TextArea ausnahmeBegruendung = new TextArea("Begründung für Ausnahmezulassung");
        ausnahmeBegruendung.setVisible(false);

        // Event-Listener für Checkbox
        ausnahmezulassung.addValueChangeListener(event ->
                ausnahmeBegruendung.setVisible(event.getValue())
        );

        DatePicker unterschriftDatum = createRequiredDatePicker("Unterschrift und Datum *");

        // Layout für Studentendaten konfigurieren
        studentendatenLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1) // 1 Spalte auf allen Bildschirmgrößen
        );

        studentendatenLayout.add(name, vorname, matrikelnummer, geburtsdatum,
                adresseStrasse, adressePLZ, adresseOrt,
                telefonnummer, email, betreuer, semester, lehrveranstaltung,
                fehlendeNachweise, ausnahmezulassung, ausnahmeBegruendung, unterschriftDatum);

        studentendatenContainer.add(studentendatenLayout);

        // Container für Praktikumsdaten
        Div praktikumsdatenContainer = new Div();
        praktikumsdatenContainer.getStyle().set("padding", "20px");
        praktikumsdatenContainer.getStyle().set("border", "1px solid #ccc");
        praktikumsdatenContainer.getStyle().set("border-radius", "8px");
        praktikumsdatenContainer.getStyle().set("background-color", "#f9f9f9");

        // Layout für Praktikumsdaten
        FormLayout praktikumsdatenLayout = new FormLayout();
        H2 praktikumsdatenHeader = new H2("Daten der Ausbildungsstelle");
        praktikumsdatenLayout.add(praktikumsdatenHeader);

        // Pflichtfelder für Praktikumsdaten
        TextField firma = createRequiredTextField("Name der Ausbildungsstelle (Firma oder Institution) *");
        TextField firmaStrasse = createRequiredTextField("Straße der Ausbildungsstelle *");
        TextField firmaPLZ = createRequiredTextField("PLZ der Ausbildungsstelle *");
        TextField firmaOrt = createRequiredTextField("Ort der Ausbildungsstelle *");
        TextField ansprechpartner = createRequiredTextField("Ansprechpartner der Ausbildungsstelle (Name) *");
        NumberField telefonAnsprechpartner = createRequiredNumberField("Telefonnummer des Ansprechpartners *");
        EmailField emailAnsprechpartner = createRequiredEmailField("E-Mail-Adresse des Ansprechpartners *");
        DatePicker praktikumVon = createRequiredDatePicker("Praktikum von *");
        DatePicker praktikumBis = createRequiredDatePicker("Praktikum bis *");
        TextField abteilung = createRequiredTextField("Einsatzbereich / Abteilung *");
        TextArea taetigkeit = createRequiredTextArea("Tätigkeit der Praktikantin / des Praktikanten *");
        DatePicker bestaetigungDatum = createRequiredDatePicker("Bestätigung der Ausbildungsstelle (Datum) *");
        TextField stempel = createRequiredTextField("Firmenstempel *");

        // Layout für Praktikumsdaten konfigurieren (ein Feld pro Zeile)
        praktikumsdatenLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1) // 1 Spalte auf allen Bildschirmgrößen
        );

        praktikumsdatenLayout.add(firma, firmaStrasse, firmaPLZ, firmaOrt,
                ansprechpartner, telefonAnsprechpartner, emailAnsprechpartner,
                praktikumVon, praktikumBis, abteilung, taetigkeit,
                bestaetigungDatum, stempel);

        praktikumsdatenContainer.add(praktikumsdatenLayout);

        // Pflichtfeldhinweis und Absenden-Button
        Paragraph pflichtfeldHinweis = new Paragraph("* Pflichtfeld");
        pflichtfeldHinweis.getStyle().set("color", "red");
        pflichtfeldHinweis.getStyle().set("font-size", "0.9em");
        pflichtfeldHinweis.getStyle().set("margin-top", "20px");
        praktikumsdatenContainer.add(pflichtfeldHinweis);




        Button speichernButton = new Button("Speichern");
        speichernButton.addClassName("button");
        speichernButton.addClassName("speichern-button");

        speichernButton.addClickListener(e -> {
            Notification.show("Gespeichert", 3000, Notification.Position.TOP_CENTER);
            boolean gespeichert = true;
        });

        Button absendenButton = new Button("Absenden");
        absendenButton.addClassName("button");
        absendenButton.addClassName("absenden-button");

        Div buttonContainer = new Div(speichernButton, absendenButton);
        buttonContainer.addClassName("button-container"); //hinzufügen asu css

        absendenButton.addClickListener(e -> {
            boolean isValid = true;
            isValid &= validateField(name);
            isValid &= validateField(vorname);
            isValid &= validateField(matrikelnummer);
            isValid &= validateField(adresseStrasse);
            isValid &= validateField(adressePLZ);
            isValid &= validateField(adresseOrt);
            isValid &= validateField(email);
            isValid &= validateField(betreuer);
            isValid &= validateField(semester);
            isValid &= validateField(lehrveranstaltung);
            isValid &= validateField(telefonnummer);
            isValid &= validateField(geburtsdatum);
            isValid &= validateField(unterschriftDatum);
            isValid &= validateField(firma);
            isValid &= validateField(firmaStrasse);
            isValid &= validateField(firmaPLZ);
            isValid &= validateField(firmaOrt);
            isValid &= validateField(ansprechpartner);
            isValid &= validateField(telefonAnsprechpartner);
            isValid &= validateField(emailAnsprechpartner);
            isValid &= validateField(praktikumVon);
            isValid &= validateField(praktikumBis);
            isValid &= validateField(abteilung);
            isValid &= validateField(taetigkeit);
            isValid &= validateField(bestaetigungDatum);
            isValid &= validateField(stempel);

            // Überprüfen, ob die Checkbox ausgewählt ist und das Textfeld leer ist
            if (ausnahmezulassung.getValue()) {
                isValid &= validateField(ausnahmeBegruendung);
            }

            if (!isValid) {
                Notification.show("Bitte alle Pflichtfelder ausfüllen!", 3000, Notification.Position.MIDDLE);
            } else {
                Notification.show("Antrag erfolgreich eingereicht", 3000, Notification.Position.TOP_CENTER);
            }

            });

        add(studentendatenContainer, praktikumsdatenContainer, buttonContainer);
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
}
