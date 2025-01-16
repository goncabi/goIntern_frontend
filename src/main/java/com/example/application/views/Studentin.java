package com.example.application.views;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONObject;
import org.json.JSONArray;
import org.springframework.web.client.RestTemplate;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import com.example.application.utils.DialogUtils;

import java.util.ArrayList;
import java.util.List;


@Route("studentin/startseite")
@CssImport("./styles/startseite.css")
@PageTitle("Studentin")

public class Studentin extends VerticalLayout {

    //restTemplate sendet API Anfragen ans Backend. Es kann lesen und schreiben.
    private RestTemplate restTemplate = new RestTemplate();
    private final String backendUrl = "http://localhost:3000/api/";

    public Studentin() {
        String matrikelnummer = (String) VaadinSession.getCurrent().getAttribute("matrikelnummer");

        if (matrikelnummer == null) {
            Notification.show("Keine Matrikelnummer in der Sitzung gefunden. Bitte loggen Sie sich erneut ein.", 5000, Notification.Position.MIDDLE);
            getUI().ifPresent(ui -> ui.navigate("login"));
            return;
        }

        //header
        String pageTitle = hasAntrag(matrikelnummer) ? "Antragsübersicht" : "Willkommen auf der Startseite";
        H1 title = new H1(pageTitle);

        //logout
        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.addClassName("logout-button");
        logoutButton.getElement().getStyle().set("position", "absolute")
                .set("top", "10px")
                .set("right", "10px");
        logoutButton.addClickListener(event -> {
            Dialog confirmDialog = DialogUtils.createStandardDialog(
                    "Logout bestätigen",
                    null,
                    "Möchten Sie sich wirklich ausloggen?",
                    "Ja",
                    "Abbrechen",
                    () -> getUI().ifPresent(ui -> ui.navigate("login"))
            );
            confirmDialog.open();
        });


        HorizontalLayout header = new HorizontalLayout(title, logoutButton);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.getStyle().set("position", "relative");

        // Antrag anzeigen oder "Neuen Antrag erstellen"
        Component content = hasAntrag(matrikelnummer) ? createMeinAntragContainer(matrikelnummer) : createStartseite();

        // Elemente hinzufügen
        add(header, content);
    }

    private boolean hasAntrag(String matrikelnummer) {
        String url = backendUrl + "antrag/getantrag/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            return response.getStatusCode().is2xxSuccessful() && response.getBody() != null;
        } catch (Exception e) {
            if (e.getMessage().contains("404")) {
                // Kein Antrag gefunden, aber kein Fehler
                return false;
            }
            Notification.show("Fehler beim Abrufen des Antrags: " + e.getMessage(), 3000, Notification.Position.MIDDLE);
        }
        return false;
    }

    // Buttons für Anzeigen, löschen und Bearbeiten vom Antrag
    private VerticalLayout createMeinAntragContainer(String matrikelnummer) {
        VerticalLayout container = new VerticalLayout();
        container.addClassName("mein-antrag-container");
        container.addClassName("card");

        H2 heading = new H2("Mein Antrag");

        //Statuslabel und Anordnung am rechten Feldrand
        String status = getAntragStatus(matrikelnummer);
        Span statusLabel = createStatusBadge(status);
        statusLabel.addClassName("status-label");


        HorizontalLayout headerLayout = new HorizontalLayout(heading, statusLabel);
        headerLayout.setAlignItems(Alignment.CENTER);
        headerLayout.setWidthFull();
        headerLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);

        Div spacer = new Div();
        spacer.setHeight("10px");
        spacer.getStyle().set("width", "50%");


        Button bearbeitenButton = new Button("Bearbeiten");
        bearbeitenButton.addClassName("bearbeiten-button2");

        // Status "Gespeichert" und "Abgelehnt" überprüfen, nur dann geht Bearbeitung
        bearbeitenButton.setEnabled("Gespeichert".equalsIgnoreCase(status) ||
                "Abgelehnt".equalsIgnoreCase(status));

        if (!bearbeitenButton.isEnabled()) {
            bearbeitenButton.getStyle()
                    .set("background-color", "#d3d3d3")
                    .set("color", "#808080")
                    .set("cursor", "not-allowed");
        } else {
            bearbeitenButton.addClickListener(event -> {
                VaadinSession.getCurrent().setAttribute("neuerAntrag", false); // Indikator für Bearbeiten
                getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
            });
        }

        //Löschen Button
        Button loeschenButton = new Button("Löschen");
        loeschenButton.addClassName("loeschen-button2");
        loeschenButton.setEnabled(
                "Abgelehnt".equalsIgnoreCase(status) ||
                        "gespeichert".equalsIgnoreCase(status)
        );

        if (!loeschenButton.isEnabled()) {
            loeschenButton.getStyle()
                    .set("background-color", "#d3d3d3")
                    .set("color", "#808080")
                    .set("cursor", "not-allowed");
        } else {
            loeschenButton.addClickListener(event -> {
                Dialog confirmDialog = DialogUtils.createStandardDialog(
                        "Antrag löschen",
                        null,
                        "Sind Sie sicher, dass Sie den Antrag löschen möchten?",
                        "Ja",
                        "Abbrechen",
                        () -> {
                            loeschenAntrag(matrikelnummer);
                            Notification.show("Antrag gelöscht.");
                            UI.getCurrent().getPage().reload();
                        }
                );
                confirmDialog.open();
            });
        }

        HorizontalLayout buttonLayout = new HorizontalLayout(bearbeitenButton, loeschenButton);
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);// Buttons rechts anordnen

        //Kommentare des PB bei Ablehnung
        Button kommentarToggle = new Button("Kommentare >", VaadinIcon.COMMENTS.create());
        kommentarToggle.addClassName("kommentar-button2");
        kommentarToggle.getStyle().set("margin-top", "10px");


        VerticalLayout kommentarContent = new VerticalLayout();
        kommentarContent.setVisible(false);
        kommentarContent.getStyle()
                .set("border", "1px solid #ddd")
                .set("border-radius", "4px")
                .set("padding", "8px")
                .set("background-color", "#f5f5f5")
                .set("width", "100%")
                .set("max-height", "200px")
                .set("overflow-y", "auto");


        List<String> notizen = getAntragNotiz(matrikelnummer);
        for (String notiz : notizen) {
            VerticalLayout kommentarBox = new VerticalLayout();
            kommentarBox.getStyle()
                    .set("border", "1px solid #ddd")
                    .set("border-radius", "8px")
                    .set("padding", "10px")
                    .set("margin-bottom", "10px")
                    .set("background-color", "#f9f9f9")
                    .set("box-shadow", "0px 2px 4px rgba(0, 0, 0, 0.1)");

            Span kommentarText = new Span(notiz);
            kommentarText.getStyle()
                    .set("font-size", "14px")
                    .set("color", "#333");

            kommentarBox.add(kommentarText);
            kommentarContent.add(kommentarBox);
        }


        kommentarToggle.addClickListener(event -> {
            boolean isVisible = kommentarContent.isVisible();
            kommentarContent.setVisible(!isVisible);
            kommentarToggle.setText(isVisible ? "Kommentare >" : "Kommentare ∨");
        });

        container.add(headerLayout, spacer, buttonLayout, kommentarToggle, kommentarContent);
        return container;

    }

    private Span createStatusBadge(String status) {
        String theme;

        switch (status) {
            case "Gespeichert":
                theme = "badge primary pill";
                break;
            case "Eingereicht":
                theme = "badge info pill";
                break;
            case "Abgelehnt":
                theme = "badge error pill";
                break;
            case "Zugelassen":
                theme = "badge success pill";
                break;
            default:
                theme = "badge light pill";
                break;
        }

        Span badge = new Span(status);
        badge.getElement().getThemeList().add(theme);
        badge.getStyle()
                .set("padding", "0.25rem 0.75rem")
                .set("font-size", "0.9rem")
                .set("border-radius", "50px");

        return badge;
    }

    private void loeschenAntrag(String matrikelnummer) {
        String url = backendUrl + "antrag/" + matrikelnummer;
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

    private Component createStartseite() {
        VerticalLayout layout = new VerticalLayout();
        layout.setAlignItems(Alignment.CENTER);

        //Neues Kärtchen mit Titel
        VerticalLayout card = new VerticalLayout();
        card.addClassName("neuer-antrag-card");
        card.setSizeFull();
        card.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

        H2 title = new H2("Neuer Antrag");
        title.getStyle().set("text-align", "center");

        Button newRequestButton = new Button("Antrag erstellen", VaadinIcon.PLUS.create(), event -> {
            Dialog popup = DialogUtils.createStandardDialog(
                    "Bestätigung der Leistungspunkte",
                    null,
                    "Hiermit bestätige ich, dass ich Module im Umfang von 60 Leistungspunkten absolviert habe.",
                    "Ja",
                    "Abbrechen",
                    () -> {
                        VaadinSession.getCurrent().setAttribute("neuerAntrag", true);
                        getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
                    }
            );
            popup.open();
        });

        newRequestButton.addClassName("new-request-button2");
        newRequestButton.getStyle().set("align-self", "center");


        Span hintLabel = new Span("Hinweis: Hier kannst du deinen Praktikumsantrag anlegen und absenden.<br>"
                + "Du kannst du Antrag auch zwischenspeichern, damit du ihn später weiterbearbeiten kannst.<br>"
                + "Achtung: Du kannst immer nur einen einzigen Antrag anlegen.");
        hintLabel.getElement().setProperty("innerHTML", hintLabel.getText()); // Damit die <br> korrekt interpretiert werden
        hintLabel.addClassName("hint-label");

        card.add(title, newRequestButton, hintLabel);
        layout.add(card);
        return layout;

    }

     // Anbindung zum Backend
    //Erklärung: Die Methode getAntragStatus returnt einen String.
    //Im Backend haben die Controller den Endpunkt getAntrag() und da wird ein Praktikumsantrag zurückgegeben und dann ein JSONString gemacht.
    // In der Methode getAntragStatus möchte ich ja nur den Status sehen
    // deswegen wird von dem JSON String nur das entsprechende Feld zum key statusAntrag dann ausgegeben.
    private String getAntragStatus(String matrikelnummer) {
        String url = backendUrl + "antrag/getantrag/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                String jsonstring = response.getBody();
                JSONObject jsonobjekt = new JSONObject(jsonstring); // hier haben wir den jasonstring in das jsonobjekt reingetan
                return jsonobjekt.getString("statusAntrag"); // an dem jsonObjekt wird die getString Methode mit dem key statusAntrag aufgerufen.
            }
        } catch (Exception e) {
            Notification.show("Fehler: " + e.getMessage());
        }
        return "nicht gefunden";
    }

    private List<String> getAntragNotiz(String matrikelnummer) {

        String url = backendUrl + "nachrichten/" + matrikelnummer;
        List<String> notizen = new ArrayList<>();
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                String jsonstring = response.getBody();
                JSONArray jsonarray = new JSONArray(jsonstring);

                //Wollen hier checken ob das Array ein Eintrag hat:
                //if(jsonarray.length() > 0){ //wenn das Array mindestens ein element hat. Also die länge größer 0 ist, dann hat es eine Nachricht vom PB bekommen.

                for (int i = 0; i < jsonarray.length(); i++) {
                    JSONObject jsonObject = jsonarray.getJSONObject(i);
                    String nachricht = jsonObject.getString("nachricht");
                    notizen.add(nachricht);

                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen des Kommentars: " + e.getMessage());
        }
        //return "Keine Kommentare vorhanden.";
        return notizen.isEmpty() ? List.of("Keine Kommentare vorhanden.") : notizen;
    }

    //Anbindung zum Backend AntragAnzeigen
    private JSONObject getPraktikumsAntrag(String matrikelnummer) {
        String url = backendUrl + "antrag/getantrag/{matrikelnummer}" + matrikelnummer; // URL des Backend-Endpunkts
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                String jsonstring = response.getBody();
                return new JSONObject(jsonstring); // JSON-String in ein JSON-Objekt umwandeln
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Aufruf des Praktikumsantrags " + e.getMessage());
        }
        return null;
    }

}




