package com.example.application.views;

import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.router.Route;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Route("admin/startseite")
public class Praktikumsbeauftragter extends VerticalLayout {

    private Grid<Praktikumsantrag> grid;
    private List<Praktikumsantrag> antraege;
    private boolean bereitsGenehmigtOderAbgelehnt = false; //für Button Logik


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
        antraege = eingegangeneAntraegePreviewListe();

        // Grid zur Anzeige der Anträge
        grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für "Antrag anzeigen"
        grid.addComponentColumn(antrag -> {
            Button anzeigenButton = new Button("Antrag anzeigen", VaadinIcon.EYE.create());
            anzeigenButton.addClickListener(event -> {
                vollstaendigenAntragAnzeigenImPopUp(antrag.getMatrikelnummer());
            });
            return anzeigenButton;
        }).setHeader("");

        add(grid);
    }

    private List<String> getNachrichten() {
        List<String> nachrichten = new ArrayList<>();
        return nachrichten;
    }

    //Methode zum Anzeigen der eingegangenen Antraege und zum Preview der Antragsinformationen
    // infomation needed:name, matrnummer, status
    private List<Praktikumsantrag> eingegangeneAntraegePreviewListe() {
        List<Praktikumsantrag> antraege = new ArrayList<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:3000/api/antrag/alle";
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONArray jsonArray = new JSONArray(response.getBody());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject json = jsonArray.getJSONObject(i);
                    String status = json.getString("statusAntrag");

                    // hier nur anträge anzeigen, deren Status nicht "gespeichert" ist
                    // weil: gespeicherte anträge sind noh nicht abgesendet
                    if (!"gespeichert".equalsIgnoreCase(status)) {
                        antraege.add(new Praktikumsantrag(
                                json.getString("nameStudentin"),
                                json.getString("matrikelnummer"),
                                status
                        ));
                    }
                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Anträge: " + e.getMessage());
        }
        return antraege;
    }


    //methode zum ausgeben des vollständigen antrags im pop-up-fesnter und
    // buttons zum genehmigen/ablehnen oder abbrechen
    private void vollstaendigenAntragAnzeigenImPopUp(String matrikelnummer) {
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format("http://localhost:3000/api/antrag/getantrag/%s", matrikelnummer);

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONObject json = new JSONObject(response.getBody());


                // Pop-up Dialog erstellen
                Dialog dialog = new Dialog();
                dialog.setWidth("600px");
                dialog.setHeight("80%");

                String matrikelnummerUeberschrift = json.getString("matrikelnummer");

                // Titel
                H1 dialogTitle = new H1("Praktikumsantrag " + matrikelnummerUeberschrift);

                // FormLayout für Key-Value-Darstellung
                FormLayout formLayout = new FormLayout();
                formLayout.setWidthFull();

                // Styles für Key und Value
                String keyStyle = "color: gray; font-size: 14px; font-weight: bold;";
                String valueStyle = "color: black; font-size: 14px;";

                // Key-Value-Paare hinzufügen
                formLayout.addFormItem(new Span(json.getString("matrikelnummer")), "Matrikelnummer:")
                        .getStyle().set("color", "gray").set("font-size", "14px").set("margin-right", "50px");

                formLayout.addFormItem(new Span(json.getString("nameStudentin")), "Name:");
                formLayout.addFormItem(new Span(json.getString("vornameStudentin")), "Vorname:");
                formLayout.addFormItem(new Span(json.getString("gebDatumStudentin")), "Geburtsdatum:");
                formLayout.addFormItem(new Span(json.getString("strasseStudentin")), "Straße:");
                formLayout.addFormItem(new Span(json.getString("hausnummerStudentin")), "Hausnummer:");
                formLayout.addFormItem(new Span(json.getString("plzStudentin")), "Postleitzahl:");
                formLayout.addFormItem(new Span(json.getString("ortStudentin")), "Ort:");
                formLayout.addFormItem(new Span(json.getString("telefonnummerStudentin")), "Telefonnummer:");
                formLayout.addFormItem(new Span(json.getString("emailStudentin")), "E-Mail-Adresse:");
                formLayout.addFormItem(new Span(json.getString("vorschlagPraktikumsbetreuerIn")), "Vorgeschlagener Praktikumsbetreuer (an der HTW):");
                formLayout.addFormItem(new Span(json.getString("praktikumssemester")), "Praktikumssemester (SoSe / WiSe):");
                formLayout.addFormItem(new Span(json.getString("studiensemester")), "Studiensemester:");
                formLayout.addFormItem(new Span(json.getString("studiengang")), "Studiengang:");
                formLayout.addFormItem(new Span(json.getString("begleitendeLehrVeranstaltungen")), "Begleitende Lehrveranstaltungen:");

                formLayout.addFormItem(new Span(json.getString("voraussetzendeLeistungsnachweise")), "Vorraussetzende Leistungsnachweise:");
                formLayout.addFormItem(new Span(json.getString("fehlendeLeistungsnachweise")), "Fehlende Leistungsnachweise:");
                formLayout.addFormItem(new Span(json.getString("ausnahmeZulassung")), "Antrag auf Ausnahmezulassung:");
                formLayout.addFormItem(new Span(json.getString("datumAntrag")), "Datum des Antrags:");

                formLayout.addFormItem(new Span(json.getString("namePraktikumsstelle")), "Name der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("strassePraktikumsstelle")), "Straße der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("plzPraktikumsstelle")), "Postleitzahl der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("ortPraktikumsstelle")), "Ort der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("landPraktikumsstelle")), "Land der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("ansprechpartnerPraktikumsstelle")), "Ansprechpartner*in der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("telefonPraktikumsstelle")), "Telefon der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("emailPraktikumsstelle")), "E-Mail-Adresse der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("abteilung")), "Abteilung:");
                formLayout.addFormItem(new Span(json.getString("taetigkeit")), "Tätigkeit der Praktikantin / des Praktikanten:");
                formLayout.addFormItem(new Span(json.getString("startdatum")), "Startdatum des Praktikums:");
                formLayout.addFormItem(new Span(json.getString("enddatum")), "Startdatum des Praktikums:");

                // Button-Leiste mit linksbündigem "Abbrechen"-Button und rechtsbündigen anderen Buttons
                Button abbrechen = new Button("Abbrechen", event -> dialog.close());

                Button genehmigen = new Button("Genehmigen", event -> {

                    if(bereitsGenehmigtOderAbgelehnt) {

                        Notification.show("Der Antrag wurde bereits abgelehnt oder genehmigt", 3000, Notification.Position.TOP_CENTER);
                        return;
                    }

                    bereitsGenehmigtOderAbgelehnt = true; //verhindert wiederholtes Klicken von Genehmigen und Ablehnen
                    try {

                         genehmigenAntrag(matrikelnummer);

                        //pop-up schließen
                        dialog.close();

                        //liste der antraege aktualisieren
                        aktualisiereListeUndGrid();

                    } catch (Exception e) {
                        Notification.show("Fehler beim Genehmigen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                    }

                });

                Button ablehnen = new Button("Ablehnen", event -> {

                    if (bereitsGenehmigtOderAbgelehnt) {

                        Notification.show("Der Antrag wurde bereits abgelehnt oder genehmigt", 3000, Notification.Position.TOP_CENTER);
                        return; // Abbrechen, wenn schon eine Verarbeitung läuft
                    }

                    bereitsGenehmigtOderAbgelehnt = true; // Verhindert wiederholtes Klicken
                    try {
                        ablehnenAntrag(matrikelnummer);
                        Notification.show("Antrag wurde abgelehnt.", 3000, Notification.Position.TOP_CENTER);

                        // Pop-up schließen
                        dialog.close();

                        // Liste der Anträge aktualisieren
                        aktualisiereListeUndGrid();

                    } catch (Exception e) {
                        Notification.show("Fehler beim Ablehnen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                    }
                });




                // Leeres flexibles Element, sorgt dafür, dass zwischen den buttons abstände sind
                Div spacer = new Div();
                spacer.getStyle().set("flex-grow", "1");

                // Button-Leiste erstellen
                HorizontalLayout buttonLayout = new HorizontalLayout(abbrechen, spacer, ablehnen, genehmigen);
                buttonLayout.setWidthFull();

                // Alles in das Dialog-Layout einfügen
                VerticalLayout dialogLayout = new VerticalLayout(dialogTitle, formLayout, buttonLayout);
                dialogLayout.setPadding(true);
                dialogLayout.setSpacing(true);

                dialog.add(dialogLayout);
                dialog.open();

            } else {
                Notification.show("Kein Antrag mit Matrikelnummer " + matrikelnummer + " gefunden.");
            }
        } catch (Exception e) {
            System.err.println("Fehler: " + e.getMessage());
            Notification.show("Fehler beim Abrufen der Antragsdetails: " + e.getMessage());
        }
    }

    //separation of concerns, ablehnen methode
    private void ablehnenAntrag(String matrikelnummer) {
        try {
            // neues antrags-objekt erstellen und status auf zugelassen setzen
            Praktikumsantrag antrag = new Praktikumsantrag("", matrikelnummer, "ABGELEHNT");

            // JSON-Objekt für den Antrag
            JSONObject jsonAntrag = new JSONObject();
            jsonAntrag.put("matrikelnummer", antrag.getMatrikelnummer());
            jsonAntrag.put("statusAntrag", antrag.getStatus());

            // JSON an Backend senden
            String backendUrl = "http://localhost:3000/pb/antrag/ablehnen";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonAntrag.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, HttpMethod.POST, request, String.class);


            if (response.getStatusCode() == HttpStatus.OK) {
                Notification.show("Antrag wurde abgelehnt.", 3000, Notification.Position.TOP_CENTER);


                // Nach erfolgreicher ablehnung: liste neu laden
                List<Praktikumsantrag> aktualisierteListe = eingegangeneAntraegePreviewListe();
                aktualisiereAntraegeListeImFrontend(aktualisierteListe);
                grid.getDataProvider().refreshAll();

            } else {
                Notification.show("Fehler beim Ablehnen des Antrags.", 3000, Notification.Position.TOP_CENTER);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Notification.show("Fehler beim Ablehnen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }


    //separation of concerns: auslagerung der genehmigen methode, weil sonst block zu groß und unübersichtlich
    private void genehmigenAntrag(String matrikelnummer) {
        try {
            // neues antrags-objekt erstellen und status auf zugelassen setzen
            Praktikumsantrag antrag = new Praktikumsantrag("", matrikelnummer, "ZUGELASSEN");

            // JSON-Objekt für den Antrag
            JSONObject jsonAntrag = new JSONObject();
            jsonAntrag.put("matrikelnummer", antrag.getMatrikelnummer());
            jsonAntrag.put("statusAntrag", antrag.getStatus());

            // JSON an Backend senden
            String backendUrl = "http://localhost:3000/pb/antrag/genehmigen";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonAntrag.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, HttpMethod.POST, request, String.class);

            if (response.getStatusCode() == HttpStatus.OK) {
                Notification.show("Antrag wurde genehmigt.", 3000, Notification.Position.TOP_CENTER);

                // Nach erfolgreicher Genehmigung: liste neu laden
                List<Praktikumsantrag> aktualisierteListe = eingegangeneAntraegePreviewListe();
                aktualisiereAntraegeListeImFrontend(aktualisierteListe);
                grid.getDataProvider().refreshAll();

            } else {
                Notification.show("Fehler beim Genehmigen des Antrags.", 3000, Notification.Position.TOP_CENTER);
            }

        } catch (Exception e) {
            e.printStackTrace();
            Notification.show("Fehler beim Genehmigen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }

    private void aktualisiereListeUndGrid() {
        try {
            // Abrufen der neuen Liste der Anträge
            List<Praktikumsantrag> neueListe = eingegangeneAntraegePreviewListe();

            // Aktualisieren des Grids
            aktualisiereAntraegeListeImFrontend(neueListe);

        } catch (Exception e) {
            Notification.show("Fehler beim Aktualisieren der Liste: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }

    private void aktualisiereAntraegeListeImFrontend(List<Praktikumsantrag> neueListe) {
        grid.setItems(neueListe);

    }

    //separation of concerns: auslagerung der ablehnen methode, weil sonst block zu groß und unübersichtlich


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
        HorizontalLayout buttons = new HorizontalLayout();
        buttons.setWidthFull(); // Volle Breite für die Ausrichtung
        buttons.add(yesButton, cancelButton);

        // Ausrichtung der Buttons
        buttons.setJustifyContentMode(JustifyContentMode.BETWEEN);


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

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }

}
