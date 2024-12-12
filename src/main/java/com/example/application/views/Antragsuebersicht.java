package com.example.application.views;

import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import org.springframework.web.client.RestTemplate;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.H2;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import java.awt.*;

@Route("antragsuebersicht")
@PageTitle("Antragsübersicht")

public class Antragsuebersicht extends VerticalLayout {

    private boolean antragVorhanden = true;
    private RestTemplate restTemplate = new RestTemplate();
    private final String backendUrl = "http://localhost:3000/api/antrag";

    public Antragsuebersicht() {

        H1 title = new H1("Antragsübersicht");


        Dialog settingsDialog = new Dialog();
        Button settingsButton = new Button(VaadinIcon.COG.create());
        Button logoutButton = new Button("Ausloggen", event -> {
            settingsDialog.close();
            getUI().ifPresent(ui -> ui.navigate("login"));
        });

        settingsDialog.add(new VerticalLayout(logoutButton));
        settingsButton.addClickListener(event -> settingsDialog.open());

        HorizontalLayout header = new HorizontalLayout(title, settingsButton);
        header.setWidthFull();
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);

        // "Mein Antrag"-Container
        VerticalLayout meinAntragContainer = createMeinAntragContainer();

        add(header, meinAntragContainer);
    }

    // Container mit Buttons
    private VerticalLayout createMeinAntragContainer() {
        VerticalLayout container = new VerticalLayout();
        container.getStyle()
                .set("border", "1px solid #ccc")
                .set("border-radius", "8px")
                .set("padding", "16px")
                .set("background-color", "#f9f9f9")
                .set("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
                .set("width", "80%")
                .set("max-width", "600px");

        H2 heading = new H2("Mein Antrag");

        Button bearbeitenButton = new Button("Bearbeiten", event -> {
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        });

        Button loeschenButton = new Button("Löschen", event -> {
            Dialog confirmDialog = new Dialog();
            confirmDialog.add(new Span("Sind Sie sicher, dass Sie den Antrag löschen möchten?"));

            Button jaButton = new Button("Ja", e -> {
                loeschenAntrag("s3223");
                confirmDialog.close();
                Notification.show("Antrag gelöscht.");
            });

            Button neinButton = new Button("Nein", e -> confirmDialog.close());
            confirmDialog.add(new HorizontalLayout(jaButton, neinButton));
            confirmDialog.open();
        });

        HorizontalLayout buttonLayout = new HorizontalLayout(bearbeitenButton, loeschenButton);
        container.add(heading, buttonLayout);

        return container;
    }

    private void loeschenAntrag(String matrikelnummer) {
        String url = backendUrl + "/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Antrag erfolgreich gelöscht.");
            } else {
                Notification.show("Antrag nicht gefunden oder Fehler beim Löschen.");
            }
        } catch (Exception e) {
            Notification.show("Fehler: " + e.getMessage());
        }
    }
}




