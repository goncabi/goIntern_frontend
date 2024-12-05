package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.dom.Style;
import com.vaadin.flow.router.Route;

@Route("")
public class Startseite extends VerticalLayout {

    private boolean antragVorhanden = false;

    public Startseite() {
        // Überschrift hinzufügen
        H1 title = new H1("Willkommen auf der Startseite!");

        // Popup-Dialog für Einstellungen
        Dialog settingsDialog = new Dialog();
        settingsDialog.setWidth("200px");
        settingsDialog.setHeight("100px");

        // Layout Titel und Buttons (Glocke & Einstellungen)
        HorizontalLayout headerButtons = new HorizontalLayout();
        headerButtons.setSpacing(true);
        headerButtons.setAlignItems(Alignment.CENTER);

        // Nachrichtenglocke-Button
        Button notificationBellButton = new Button(VaadinIcon.BELL.create());
        notificationBellButton.addClickListener(event -> {
            Dialog notificationDialog = new Dialog();
            notificationDialog.setWidth("300px");
            notificationDialog.setHeight("200px");

            // Placeholder für Nachrichtenliste
            VerticalLayout notificationLayout = new VerticalLayout();
            notificationLayout.setSpacing(true);
            notificationLayout.setPadding(true);

            // Abrufen der Nachrichten
            boolean hasNotifications = false;
            if (hasNotifications) {
                notificationLayout.add(new Span("Nachricht 1"), new Span("Nachricht 2"));
            } else {
                notificationLayout.add(new Span("Keine Nachrichten vorhanden."));
            }

            notificationDialog.add(notificationLayout);
            notificationDialog.open();
        });

        // Einstellungen-Button
        Button settingsButton = new Button(VaadinIcon.COG.create());
        settingsButton.addClickListener(event -> settingsDialog.open());

        headerButtons.add(notificationBellButton, settingsButton);

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


        //Container für "Mein Antrag"-Feld
        Div meinAntragContainer = new Div();
        meinAntragContainer.getStyle()
                .set("border", "1px solid #ccc")
                .set("border-radius", "8px")
                .set("padding", "16px")
                .set("background-color", "#f9f9f9")
                .set("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
                .set("margin-top", "10px")
                .set("width", "80%")
                .set("max-width", "600px");

//Überschrift
        H2 meinAntragHeading = new H2("Mein Antrag");
        meinAntragHeading.getStyle()
                .set("margin", "0")
                .set("margin-bottom", "10px");

//Buttons für Bearbeiten und Löschen
        Button bearbeitenButton = new Button("Bearbeiten");
        bearbeitenButton.addClickListener(event -> { //PopUp Funktion
            if (!antragVorhanden) {
                Notification.show("Noch kein Antrag vorhanden!", 3000, Notification.Position.TOP_CENTER);
            } else {
                getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
            }
        });

        Button loeschenButton = new Button("Löschen");
        loeschenButton.addClickListener(event -> { // Warnungsfenster fürs Löschen
            Dialog confirmDialog = new Dialog();
            confirmDialog.add(new Span("Sind Sie sicher, dass Sie den Antrag löschen möchten?"));

            Button jaButton = new Button("Ja", eventJa -> {
                antragVorhanden = false;
                confirmDialog.close();
                Notification.show("Antrag gelöscht.", 3000, Notification.Position.TOP_CENTER);
            });

            Button neinButton = new Button("Nein", eventNein -> confirmDialog.close());
            confirmDialog.add(new HorizontalLayout(jaButton, neinButton));
            confirmDialog.open();
        });


        HorizontalLayout buttonLayout = new HorizontalLayout(bearbeitenButton, loeschenButton);
        buttonLayout.setSpacing(true);
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);
        buttonLayout.setAlignItems(FlexComponent.Alignment.END);


        meinAntragContainer.add(meinAntragHeading, buttonLayout);
        add(meinAntragContainer);
    }

    }