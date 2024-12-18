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

@Route("student/startseite")
public class Startseite extends VerticalLayout {

    private boolean antragVorhanden = false;

    private RestTemplate restTemplate = new RestTemplate(); // Das RestTemplate sendet die Anfrage an das Backend
    private final String backendUrl = "http://localhost:3000/api/antrag"; // URL, an die die Anfrage gesendet wird

    public Startseite() {
        // Überschrift hinzufügen
        H1 title = new H1("Willkommen auf der Startseite!");

        // Ausloggen-Button
        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.getElement().getStyle().set("position", "absolute")
                .set("top", "10px")
                .set("right", "10px");
        logoutButton.addClickListener(event -> {
            // Zeige Bestätigungsdialog
            Dialog confirmDialog = createLogoutConfirmationDialog();
            confirmDialog.open();
        });

        // Layout für Header mit Titel und Ausloggen-Button
        HorizontalLayout header = new HorizontalLayout(title, logoutButton);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.getStyle().set("position", "relative");

        // Plus-Button für neuen Antrag
        Button newRequestButton = new Button("Neuen Antrag erstellen", VaadinIcon.PLUS.create());
        newRequestButton.addClickListener(event -> {
            // Navigation zur Praktikumsformular-Seite
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        });

        // Hinweis unter dem Plus-Button
        Span hintLabel = new Span("Hinweis: Ein Antrag kann nur einmal erstellt werden.");

        // Komponenten zur Seite hinzufügen
        add(header, newRequestButton, hintLabel);
    }

    // Erstellung des Bestätigungsdialogs für das Ausloggen
    private Dialog createLogoutConfirmationDialog() {
        Dialog dialog = new Dialog();

        // Nachricht
        Span message = new Span("Möchten Sie sich wirklich ausloggen?");

        // Buttons
        Button yesButton = new Button("Ja", event -> {
            dialog.close();
            // Weiterleitung zur Login-Seite
            getUI().ifPresent(ui -> ui.navigate("login"));
        });

        Button cancelButton = new Button("Abbrechen", event -> dialog.close());

        // Layout für die Buttons
        HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);
        buttons.setSpacing(true);

        // Dialog hinzufügen
        VerticalLayout dialogLayout = new VerticalLayout(message, buttons);
        dialogLayout.setSpacing(true);
        dialog.add(dialogLayout);

        return dialog;
    }
}
