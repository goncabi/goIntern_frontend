package com.example.application.views;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.UI;
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

import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.io.IOException;
import java.net.URI;
import java.net.http.HttpResponse;


@Route("studentin/startseite")
@PageTitle("Startseite")

public class Startseite extends VerticalLayout {

    private RestTemplate restTemplate = new RestTemplate();
    private final String backendUrl = "http://localhost:3000/api/";

    public Startseite() {
        String matrikelnummer = (String) VaadinSession.getCurrent().getAttribute("matrikelnummer");

        if (matrikelnummer == null) {
            Notification.show("Keine Matrikelnummer in der Sitzung gefunden. Bitte loggen Sie sich erneut ein.", 5000, Notification.Position.MIDDLE);
            getUI().ifPresent(ui -> ui.navigate("login"));
            return;
        }
        //header
        H1 title = new H1("Antragsübersicht");

        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.getElement().getStyle().set("position", "absolute")
                .set("top", "10px")
                .set("right", "10px");
        logoutButton.addClickListener(event -> {
            // Zeige Bestätigungsdialog
            Dialog confirmDialog = createLogoutConfirmationDialog();
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

        //VerticalLayout meinAntragContainer = createMeinAntragContainer();
        //add(header, meinAntragContainer);
    }

    private Dialog createLogoutConfirmationDialog() {
        Dialog dialog = new Dialog();
        Span message = new Span("Möchten Sie sich wirklich ausloggen?");
        Button cancelButton = new Button("Abbrechen", event -> dialog.close());
        Button yesButton = new Button("Ja", event -> {
            dialog.close();
            // navigiert zur Login-Seite
            getUI().ifPresent(ui -> ui.navigate("login"));
        });



        HorizontalLayout buttons = new HorizontalLayout(cancelButton, yesButton);
        buttons.setSpacing(true);
        VerticalLayout dialogLayout = new VerticalLayout(message, buttons);
        dialog.add(dialogLayout);

        return dialog;
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
        container.getStyle()
                .set("border", "1px solid #ccc")
                .set("border-radius", "8px")
                .set("padding", "16px")
                .set("background-color", "#f9f9f9")
                .set("box-shadow", "0px 4px 6px rgba(0, 0, 0, 0.1)")
                .set("width", "80%")
                .set("max-width", "600px");

        H2 heading = new H2("Mein Antrag");
        String status = getAntragStatus(matrikelnummer);
        H3 statuslabel = new H3("Status: " + status); // hier wird das Label erstellt. Die H3 ist eine Ueberschrift. Der status ist von der getAntragStatus Methode.

           Button bearbeitenButton = new Button("Bearbeiten");

           // Status "Gespeichert" und "Abgelehnt" überprüfen, nur dann geht Bearbeitung
           bearbeitenButton.setEnabled("Gespeichert".equalsIgnoreCase(status) || "Abgelehnt".equalsIgnoreCase(status));

           if (!bearbeitenButton.isEnabled()) {
               bearbeitenButton.getStyle()
                               .set("background-color", "#d3d3d3") // Grau
                               .set("color", "#808080")
                               .set("cursor", "not-allowed");
           } else {
               bearbeitenButton.addClickListener(event -> {
                   VaadinSession.getCurrent().setAttribute("neuerAntrag", false); // Indikator für Bearbeiten
                   getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
               });
           }

            Button loeschenButton = new Button("Löschen", event -> {
            Dialog confirmDialog = new Dialog();
            confirmDialog.add(new Span("Sind Sie sicher, dass Sie den Antrag löschen möchten?"));

            Button cancelButton = new Button("Abbrechen", e -> confirmDialog.close());
            Button jaButton = new Button("Ja", e -> {
                loeschenAntrag(matrikelnummer); // hier noch hargecoded. Da muss eine Variable hin und das geht erst wenn sich eingeloggt und die Backend-Frontend-Anbindung fuer Login implementiert wurde.
                confirmDialog.close();
                Notification.show("Antrag gelöscht.");
                UI.getCurrent().getPage().reload(); //Seite neu laden nach löschen
            });


            confirmDialog.add(new HorizontalLayout(cancelButton, jaButton));
            confirmDialog.open();
        });

        HorizontalLayout buttonLayout = new HorizontalLayout(bearbeitenButton, loeschenButton);
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);// Buttons rechts anordnen

        //Kommentar- /Notizfeld für die Kommentare die PB beim Ablehnen für Studentinnen hinterlässt
        Button kommentarToggle = new Button("Kommentare >", VaadinIcon.COMMENTS.create());
        kommentarToggle.getStyle()
                .set("color", "#007bff")
                .set("font-size", "14px")
                .set("cursor", "pointer")
                .set("margin-top", "10px");


        VerticalLayout kommentarContent = new VerticalLayout();
        kommentarContent.setVisible(false);
        kommentarContent.getStyle()
                .set("border", "1px solid #ddd")
                .set("border-radius", "4px")
                .set("padding", "8px")
                .set("background-color", "#f5f5f5")
                .set("width", "100%");

        String notiz = getAntragNotiz(matrikelnummer);
        Span kommentarText = new Span(notiz);
        kommentarContent.add(kommentarText);

        kommentarToggle.addClickListener(event -> {
            boolean isVisible = kommentarContent.isVisible();
            kommentarContent.setVisible(!isVisible);
            kommentarToggle.setText(isVisible ? "Kommentare >" : "Kommentare ∨");
        });

        container.add(heading, statuslabel, buttonLayout, kommentarToggle, kommentarContent);
        return container;
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

        H2 title = new H2("Willkommen auf der Startseite!");
        Button newRequestButton = new Button("Neuen Antrag erstellen", VaadinIcon.PLUS.create(), event -> {
            // Zeige den Dialog
            Dialog popup = new Dialog();

            // Nachricht im Dialog
            Span message = new Span("Hiermit bestätige ich, dass ich Module im Umfang von 60 Leistungspunkten absolviert habe.");
            message.getStyle()
                    .set("font-size", "16px")
                    .set("text-align", "center");

            // "Ja"-Button: Navigiert zur Formular-Seite
            Button jaButton = new Button("Ja", e -> {
                popup.close();
                VaadinSession.getCurrent().setAttribute("neuerAntrag", true); // Indikator für neuen Antrag
                getUI().ifPresent(ui -> ui.navigate("praktikumsformular")); // Weiterleitung
            });
            jaButton.addThemeName("primary");

            // "Nein"-Button: Schließt nur den Dialog
            Button neinButton = new Button("Nein", e -> popup.close());
            neinButton.addThemeName("secondary");

            // Layout für Buttons
            HorizontalLayout buttonLayout = new HorizontalLayout(neinButton, jaButton);
            buttonLayout.setWidthFull();
            buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

            // Layout für den Dialog
            VerticalLayout popupLayout = new VerticalLayout(message, buttonLayout);
            popupLayout.setPadding(true);
            popupLayout.setSpacing(true);
            popupLayout.setAlignItems(Alignment.CENTER);

            popup.add(popupLayout);
            popup.setWidth("400px");
            popup.setHeight("200px");

            // Dialog öffnen
            popup.open();
        });


        Span hintLabel = new Span("Hinweis: Hier kannst du deinen Praktikumsantrag anlegen und absenden.<br>"
                + "Du kannst du Antrag auch zwischenspeichern, damit du ihn später weiterbearbeiten kannst.<br>"
                        + "Achtung: Du kannst immer nur einen einzigen Antrag anlegen.");
        hintLabel.getElement().setProperty("innerHTML", hintLabel.getText()); // Damit die <br> korrekt interpretiert werden
        layout.add(title, newRequestButton, hintLabel);
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

    private String getAntragNotiz(String matrikelnummer) {

        String url = backendUrl + "nachrichten/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                String jsonstring = response.getBody();
                JSONArray jsonarray = new JSONArray(jsonstring);

                //Wollen hier checken ob das Array ein Eintrag hat:
                if(jsonarray.length() > 0){ //wenn das Array mindestens ein element hat. Also die länge größer 0 ist, dann hat es eine Nachricht vom PB bekommen.

                    //das was an der 0ten Stelle ist, wollen wir bekommen
                    JSONObject jsonObject = jsonarray.getJSONObject(0);
                    String nachricht = jsonObject.getString("nachricht");
                    return nachricht;

                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen des Kommentars: " + e.getMessage());
        }
        return "Keine Kommentare vorhanden.";
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




