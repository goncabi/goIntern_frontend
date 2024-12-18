package com.example.application.views;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.Text;
import com.vaadin.flow.component.details.Details;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
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
        String status = getAntragStatus("123476"); // hier noch hardgecodet..hier ist die 999 noch als Platzhalter für die Variable
        H3 statuslabel = new H3(status); // hier wird das Label erstellt. Die H3 ist eine Ueberschrift. Der status ist von der getAntragStatus Methode.

        Button anzeigenButton = new Button("Antrag anzeigen", event -> {
            // Navigieren zur Seite d. Praktikumsantrags mit der spezifischen Antrag-ID
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        });

        Button bearbeitenButton = new Button("Bearbeiten", event -> {
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        }); // navigiert zum Formular/
        Button loeschenButton = new Button("Löschen", event -> {
            Dialog confirmDialog = new Dialog();
            confirmDialog.add(new Span("Sind Sie sicher, dass Sie den Antrag löschen möchten?"));

            Button jaButton = new Button("Ja", e -> {
                loeschenAntrag("123476"); // hier noch hargecoded. Da muss eine Variable hin und das geht erst wenn sich eingeloggt und die Backend-Frontend-Anbindung fuer Login implementiert wurde.
                confirmDialog.close();
                Notification.show("Antrag gelöscht.");
            });

            Button neinButton = new Button("Nein", e -> confirmDialog.close());
            confirmDialog.add(new HorizontalLayout(jaButton, neinButton));
            confirmDialog.open();
        });

        HorizontalLayout buttonLayout = new HorizontalLayout(anzeigenButton, bearbeitenButton, loeschenButton);
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);

        H4 kommentarLabel = new H4("Kommentare:");
        Span kommentarContent = new Span();
        kommentarContent.getStyle()
                .set("border", "1px solid #ddd")
                .set("border-radius", "8px")
                .set("padding", "8px")
                .set("background-color", "#f2f2f2")
                .set("width", "50%")
                .set("min-height", "50px")
                .set("display", "block");

        String kommentar = getAntragKommentar("123476");
        kommentarContent.setText(kommentar);

        container.add(heading, statuslabel, buttonLayout, kommentarLabel, kommentarContent);
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

     // Anbindung zum Backend
    //Erklärung: Die Methode getAntragStatus returnt einen String.
    //Im Backend haben die Controller den Endpunkt getAntrag() und da wird ein Praktikumsantrag zurückgegeben und dann ein JSONString gemacht.
    // In der Methode getAntragStatus möchte ich ja nur den Status sehen
    // deswegen wird von dem JSON String nur das entsprechende Feld zum key statusAntrag dann ausgegeben.
    private String getAntragStatus(String matrikelnummer) {
        String url = backendUrl + "/getantrag/" + matrikelnummer;
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

    private String getAntragKommentar(String matrikelnummer) {
        String url = backendUrl + "/getantrag/" + matrikelnummer + "/kommentar";
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                String jsonstring = response.getBody();
                JSONObject jsonObject = new JSONObject(jsonstring);
                return jsonObject.optString("kommentar", "Keine Kommentare vorhanden");
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen des Kommentars: " + e.getMessage());
        }
        return "Keine Kommentare vorhanden.";
    }

    //Anbindung zum Backend AntragAnzeigen
    private JSONObject getPraktikumsAntrag(String matrikelnummer) {
        String url = backendUrl + "/getantrag/{matrikelnummer}" + matrikelnummer; // URL des Backend-Endpunkts
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




