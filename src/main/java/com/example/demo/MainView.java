package com.example.demo;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.textfield.EmailField;
import com.vaadin.flow.component.textfield.NumberField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route("") // Startseite der Anwendung
public class MainView extends Div {
    public MainView() {
        // Überschrift
        add(new H1("Beispiel-Formular"));

        // Formularfelder erstellen
        TextField vorname = new TextField("Vorname");
        TextField nachname = new TextField("Nachname");
        EmailField email = new EmailField("E-Mail");
        NumberField telefonnummer = new NumberField("Telefonnummer");
        Button absendenButton = new Button("Absenden");

        // Formular-Layout hinzufügen
        FormLayout formLayout = new FormLayout();
        formLayout.add(vorname, nachname, email, telefonnummer, absendenButton);

        // Formular zum Hauptlayout hinzufügen
        add(formLayout);
    }
}