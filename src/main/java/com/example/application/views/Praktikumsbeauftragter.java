package com.example.application.views;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.router.Route;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Route("admin/startseite")
public class Praktikumsbeauftragter extends VerticalLayout {

    private Grid<Praktikumsantrag> grid;
    private List<Praktikumsantrag> antraege;

    public Praktikumsbeauftragter() {
        // Überschrift
        H1 title = new H1("Übersicht der Praktikumsanträge");

        // Nachrichtenglocke

        Button notificationBell = new Button(VaadinIcon.BELL.create());
        notificationBell.getElement().getStyle().set("cursor", "pointer");

        ContextMenu notificationMenu = new ContextMenu(notificationBell);
        notificationMenu.setOpenOnClick(true);

        List<String> nachrichten = getNachrichten();
        if (nachrichten.isEmpty()) {
            notificationMenu.addItem("Keine neuen Benachrichtigungen.");
        } else {
            for (String nachricht : nachrichten) {
                notificationMenu.addItem(nachricht);
            }
        }

        // Logout-Icon hinzufügen
        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.getElement().getStyle().set("cursor", "pointer");
        logoutButton.addClickListener(event -> {
            Dialog confirmDialog = createLogoutConfirmationDialog();
            confirmDialog.open();
        });

        // Header mit Titel und Logout-Icon
        HorizontalLayout header = new HorizontalLayout(title, notificationBell, logoutButton);
        header.setWidthFull();
        header.setJustifyContentMode(JustifyContentMode.BETWEEN);
        header.setAlignItems(Alignment.CENTER);

        notificationBell.getElement().getStyle().set("margin-left", "auto");
        add(header);

        // Datenmodell für Praktikumsanträge
        antraege = fetchAntraegeFromBackend();

        // Grid zur Anzeige der Anträge
        grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für "Antrag anzeigen"
        grid.addComponentColumn(antrag -> {
            Button anzeigenButton = new Button("Antrag anzeigen", VaadinIcon.EYE.create());
            anzeigenButton.addClickListener(event -> {
                fetchAntragDetailsFromBackend(antrag.getMatrikelnummer());
            });
            return anzeigenButton;
        }).setHeader("Aktionen");

        add(grid);
    }

    private List<String> getNachrichten() {
        List<String> nachrichten = new ArrayList<>();
        return nachrichten;
    }

    //Methode zum Anzeigen der eingegangenen Antraege und zum Preview der Antragsinformationen
    // infomation needed:name, matrnummer, status
    private List<Praktikumsantrag> fetchAntraegeFromBackend() {
        List<Praktikumsantrag> antraege = new ArrayList<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:3000/api/antrag/uebermitteln";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONArray jsonArray = new JSONArray(response.getBody());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject json = jsonArray.getJSONObject(i);
                    antraege.add(new Praktikumsantrag(
                            json.getString("name"),
                            json.getString("matrikelnummer"),
                            json.getString("status")
                    ));
                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Anträge: " + e.getMessage());
        }
        return antraege;
    }

    private void fetchAntragDetailsFromBackend(String matrikelnummer) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:3000/api/antrag/uebermitteln" + matrikelnummer;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONObject json = new JSONObject(response.getBody());
                Praktikumsantrag antrag = new Praktikumsantrag(
                        json.getString("name"),
                        json.getString("matrikelnummer"),
                        json.getString("status")
                );

                Dialog dialog = new Dialog();
                dialog.add(new H1("Antragdetails"));
                dialog.add(new TextArea("Name", antrag.getName()));
                dialog.add(new TextArea("Matrikelnummer", antrag.getMatrikelnummer()));
                dialog.add(new TextArea("Status", antrag.getStatus()));
                dialog.open();
            } else {
                Notification.show("Kein Antrag mit Matrikelnummer " + matrikelnummer + " gefunden.");
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Antragsdetails: " + e.getMessage());
        }
    }


    private Dialog createPraktikumsformularDialog(Praktikumsantrag antrag) {
        Dialog dialog = new Dialog();

        // Titel des Dialogs
        VerticalLayout dialogLayout = new VerticalLayout();
        dialogLayout.add(new H1("Praktikumsformular anzeigen"));

        // Praktikumsformular hier mit json daten füllen

        // Buttons unten im Dialog
        Button genehmigenButton = new Button("Genehmigen", event -> {
            antrag.setStatus("Genehmigt");
            aktualisiereGrid();
            dialog.close();
            Notification.show("Antrag genehmigt.", 3000, Notification.Position.TOP_CENTER);
        });

        Button ablehnenButton = new Button("Ablehnen", event -> {
            Dialog ablehnenDialog = createAblehnenDialog(antrag, dialog);
            ablehnenDialog.open();
        });

        HorizontalLayout actionButtons = new HorizontalLayout(genehmigenButton, ablehnenButton);
        dialogLayout.add(actionButtons);

        dialog.add(dialogLayout);
        return dialog;
    }

    private Dialog createAblehnenDialog(Praktikumsantrag antrag, Dialog parentDialog) {
        Dialog ablehnenDialog = new Dialog();

        // Kommentarbereich
        TextArea kommentarField = new TextArea("Kommentar");
        kommentarField.setPlaceholder("Bitte geben Sie einen Grund für die Ablehnung ein...");

        // Buttons
        Button ablehnenConfirmButton = new Button("Ablehnen", event -> {
            if (kommentarField.getValue().trim().isEmpty()) {
                Notification.show("Bitte geben Sie einen Kommentar ein.", 3000, Notification.Position.MIDDLE);
            } else {
                antrag.setStatus("Abgelehnt");
                aktualisiereGrid();
                ablehnenDialog.close();
                parentDialog.close();
                Notification.show("Antrag abgelehnt: " + kommentarField.getValue(), 3000, Notification.Position.TOP_CENTER);
            }
        });

        Button cancelButton = new Button("Abbrechen", event -> ablehnenDialog.close());

        HorizontalLayout actionButtons = new HorizontalLayout(ablehnenConfirmButton, cancelButton);
        VerticalLayout layout = new VerticalLayout(kommentarField, actionButtons);

        ablehnenDialog.add(layout);
        return ablehnenDialog;
    }

    private Dialog createLogoutConfirmationDialog() {
        Dialog dialog = new Dialog();

        // Nachricht
        H1 message = new H1("Möchten Sie sich wirklich ausloggen?");

        // Buttons
        Button yesButton = new Button("Ja", event -> {
            dialog.close();
            UI.getCurrent().navigate("login");
        });

        Button cancelButton = new Button("Abbrechen", event -> dialog.close());

        // Layout für die Buttons
        HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);
        VerticalLayout dialogLayout = new VerticalLayout(message, buttons);

        dialog.add(dialogLayout);
        return dialog;
    }

    private void aktualisiereGrid() {
        grid.getDataProvider().refreshAll();
    }

    // Datenmodell für Praktikumsanträge
    public static class Praktikumsantrag {
        private String name;
        private String matrikelnummer;
        private String status;

        public Praktikumsantrag(String name, String matrikelnummer, String status) {
            this.name = name;
            this.matrikelnummer = matrikelnummer;
            this.status = status;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getMatrikelnummer() {
            return matrikelnummer;
        }

        public void setMatrikelnummer(String matrikelnummer) {
            this.matrikelnummer = matrikelnummer;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

    //backend-anbindung, sodass antrag unter bestimmter id ausgegeben wird
}
