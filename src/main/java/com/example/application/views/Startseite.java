package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.ResponseEntity;

@Route("")
public class Startseite extends VerticalLayout {

    private boolean antragVorhanden = false;

    private RestTemplate restTemplate = new RestTemplate(); //das restTEmplate sendet die anfrage an das backend
    private final String backendUrl = "http://localhost:3000/api/antrag";// an die url wird die anfrage gesendet

    public Startseite() {
        // Überschrift hinzufügen
        H1 title = new H1("Willkommen auf der Startseite!");

        // Popup-Dialog für Einstellungen
        Dialog settingsDialog = new Dialog();
        settingsDialog.setWidth("200px");
        settingsDialog.setHeight("100px");

        // Layout Titel und Buttons (Einstellungen)
        HorizontalLayout headerButtons = new HorizontalLayout();
        headerButtons.setSpacing(true);
        headerButtons.setAlignItems(Alignment.CENTER);

        // Einstellungen-Button
        Button settingsButton = new Button(VaadinIcon.COG.create());
        settingsButton.addClickListener(event -> settingsDialog.open());

        headerButtons.add(settingsButton);

        // Haupt-Header mit Titel und Buttons
        HorizontalLayout header = new HorizontalLayout(title, headerButtons);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);

        // Ausloggen-Button im Dialog
        Button logoutButton = new Button("Ausloggen", event -> {
            settingsDialog.close();
            getUI().ifPresent(ui -> ui.navigate("login"));
        });

        settingsDialog.add(new VerticalLayout(logoutButton));
        settingsButton.addClickListener(event -> settingsDialog.open());

        // Plus-Button für neuen Antrag
        Button newRequestButton = new Button("Neuen Antrag erstellen", VaadinIcon.PLUS.create());
        newRequestButton.addClickListener(event -> {
            // Navigation zur Praktikumsformular-Seite (MainView in demo)
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        });

        // Hinweis unter dem Plus-Button
        Span hintLabel = new Span("Hinweis: Ein Antrag kann nur einmal erstellt werden.");

        // Komponenten zur Seite hinzufügen
        add(header, newRequestButton, hintLabel, settingsDialog);

    }


    }


