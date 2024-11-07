package com.example.demo;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.checkbox.Checkbox;
import com.vaadin.flow.component.datepicker.DatePicker;
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

@Route("") // Startseite der Anwendung
public class MainView extends Div {
    public MainView() {
        // Hauptüberschrift
        add(new H1("Praktikumsformular"));

        // Stil für bessere Trennung
        Div studentendatenContainer = new Div();
        studentendatenContainer.getStyle().set("padding", "20px");
        studentendatenContainer.getStyle().set("border", "1px solid #ccc");
        studentendatenContainer.getStyle().set("border-radius", "8px");
        studentendatenContainer.getStyle().set("margin-bottom", "20px");
        studentendatenContainer.getStyle().set("background-color", "#f9f9f9");

        // Layout für die Studentendaten
        FormLayout studentendatenLayout = new FormLayout();
        H2 studentendatenHeader = new H2("Studentendaten");
        studentendatenLayout.add(studentendatenHeader);

        // Erstellung von Pflichtfeldern mit Sternchen
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

        // Fehlende Leistungsnachweise als optionales Feld (kein Sternchen mehr)
        TextArea fehlendeNachweise = new TextArea("Fehlende Leistungsnachweise (falls vorhanden)");

        // Ausnahmezulassung Checkbox
        Checkbox ausnahmezulassung = new Checkbox("Antrag auf Ausnahmezulassung");
        TextArea ausnahmeBegruendung = new TextArea("Begründung für Ausnahmezulassung");
        ausnahmeBegruendung.setVisible(false); // Notizfeld zunächst ausblenden


        ausnahmezulassung.addValueChangeListener(event ->
                ausnahmeBegruendung.setVisible(event.getValue())
        );

        DatePicker unterschriftDatum = createRequiredDatePicker("Unterschrift und Datum *");


        studentendatenLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1),
                new FormLayout.ResponsiveStep("500px", 2)
        );

        // Felder der Studentendaten hinzufügen
        studentendatenLayout.add(name, vorname, matrikelnummer, geburtsdatum,
                adresseStrasse, adressePLZ, adresseOrt,
                telefonnummer, email, betreuer, semester, lehrveranstaltung,
                fehlendeNachweise, ausnahmezulassung, ausnahmeBegruendung, unterschriftDatum);

        studentendatenContainer.add(studentendatenLayout);

        // Stil für bessere Trennung
        Div praktikumsdatenContainer = new Div();
        praktikumsdatenContainer.getStyle().set("padding", "20px");
        praktikumsdatenContainer.getStyle().set("border", "1px solid #ccc");
        praktikumsdatenContainer.getStyle().set("border-radius", "8px");
        praktikumsdatenContainer.getStyle().set("background-color", "#f9f9f9");

        // Layout für die Daten der Ausbildungsstelle
        FormLayout praktikumsdatenLayout = new FormLayout();
        H2 praktikumsdatenHeader = new H2("Daten der Ausbildungsstelle");
        praktikumsdatenLayout.add(praktikumsdatenHeader);

        // Praktikumsdaten Felder mit Pflichtfeldkennzeichen
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


        praktikumsdatenLayout.setResponsiveSteps(
                new FormLayout.ResponsiveStep("0", 1),
                new FormLayout.ResponsiveStep("500px", 2)
        );

        praktikumsdatenLayout.add(firma, firmaStrasse, firmaPLZ, firmaOrt,
                ansprechpartner, telefonAnsprechpartner, emailAnsprechpartner,
                praktikumVon, praktikumBis, abteilung, taetigkeit,
                bestaetigungDatum, stempel);

        praktikumsdatenContainer.add(praktikumsdatenLayout);

        // Pflichtfeldhinweis über dem Absenden-Button hinzufügen
        Paragraph pflichtfeldHinweis = new Paragraph("* Pflichtfeld");
        pflichtfeldHinweis.getStyle().set("color", "red");
        pflichtfeldHinweis.getStyle().set("font-size", "0.9em");
        pflichtfeldHinweis.getStyle().set("margin-top", "20px");
        praktikumsdatenContainer.add(pflichtfeldHinweis);

        // Absenden-Button
        Button absendenButton = new Button("Absenden");
        absendenButton.getStyle().set("margin-top", "10px");
        absendenButton.getStyle().set("display", "block");
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

            if (!isValid) {
                Notification.show("Bitte alle Pflichtfelder ausfüllen!", 3000, Notification.Position.MIDDLE);
            }
        });
        praktikumsdatenContainer.add(absendenButton);


        add(studentendatenContainer, praktikumsdatenContainer);
    }

    private TextField createRequiredTextField(String label) {
        TextField field = new TextField(label);
        return field;
    }

    private NumberField createRequiredNumberField(String label) {
        NumberField field = new NumberField(label);
        return field;
    }

    private EmailField createRequiredEmailField(String label) {
        EmailField field = new EmailField(label);
        return field;
    }

    private DatePicker createRequiredDatePicker(String label) {
        DatePicker field = new DatePicker(label);
        return field;
    }

    private TextArea createRequiredTextArea(String label) {
        TextArea field = new TextArea(label);
        return field;
    }

    // Validierungs-Helper-Methode für Pflichtfelder
    private boolean validateField(TextField field) {
        if (field.isEmpty()) {
            field.getStyle().set("border-color", "red");
            return false;
        }
        field.getStyle().remove("border-color");
        return true;
    }

    private boolean validateField(NumberField field) {
        if (field.isEmpty()) {
            field.getStyle().set("border-color", "red");
            return false;
        }
        field.getStyle().remove("border-color");
        return true;
    }

    private boolean validateField(EmailField field) {
        if (field.isEmpty()) {
            field.getStyle().set("border-color", "red");
            return false;
        }
        field.getStyle().remove("border-color");
        return true;
    }

    private boolean validateField(DatePicker field) {
        if (field.isEmpty()) {
            field.getStyle().set("border-color", "red");
            return false;
        }
        field.getStyle().remove("border-color");
        return true;
    }

    private boolean validateField(TextArea field) {
        if (field.isEmpty()) {
            field.getStyle().set("border-color", "red");
            return false;
        }
        field.getStyle().remove("border-color");
        return true;
    }
}
