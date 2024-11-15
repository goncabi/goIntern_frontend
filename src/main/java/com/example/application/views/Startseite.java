package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("")
public class Startseite extends VerticalLayout {

    public Startseite() {
        // Überschrift hinzufügen
        H1 title = new H1("Willkommen auf der Startseite!");

        // Einstellungen-Button oben rechts
        Button settingsButton = new Button(VaadinIcon.COG.create());
        settingsButton.getElement().getStyle().set("position", "absolute")
                .set("top", "10px")
                .set("right", "10px");

        // Popup-Dialog für Einstellungen
        Dialog settingsDialog = new Dialog();
        settingsDialog.setWidth("200px");
        settingsDialog.setHeight("100px");

        // Ausloggen-Button im Dialog
        Button logoutButton = new Button("Ausloggen", event -> {
            settingsDialog.close();
            getUI().ifPresent(ui -> ui.navigate("login"));
        });

        settingsDialog.add(new VerticalLayout(logoutButton));
        settingsButton.addClickListener(event -> settingsDialog.open());

        // Layout für Header mit Titel und Einstellungen-Button
        HorizontalLayout header = new HorizontalLayout(title, settingsButton);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.getStyle().set("position", "relative");

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