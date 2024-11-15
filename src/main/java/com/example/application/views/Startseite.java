package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.H1;
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

        // Popup-Dialog erstellen
        Dialog settingsDialog = new Dialog();
        settingsDialog.setWidth("200px");
        settingsDialog.setHeight("100px");

        // Ausloggen-Button hinzufügen
        Button logoutButton = new Button("Ausloggen", event -> {

            settingsDialog.close();
            //Navigation zur Login-Seite
            getUI().ifPresent(ui -> ui.navigate("login"));
        });

        settingsDialog.add(new VerticalLayout(logoutButton));

        // Einstellungen-Button
        settingsButton.addClickListener(event -> settingsDialog.open());

        // Layout erstellen und die Komponenten hinzufügen
        HorizontalLayout header = new HorizontalLayout(title, settingsButton);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.getStyle().set("position", "relative");

        // Hauptlayout hinzufügen
        add(header);
        add(settingsDialog);
    }
}