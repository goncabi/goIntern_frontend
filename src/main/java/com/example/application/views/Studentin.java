package com.example.application.views;

import com.example.application.service.ArbeitstageBerechnungsService;
import com.example.application.views.banner.MainBanner;
import com.example.application.views.subordinatebanner.SubordinateBanner;
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
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.example.application.utils.DialogUtils;
import com.vaadin.flow.component.upload.Upload;
import com.vaadin.flow.component.upload.receivers.MemoryBuffer;
import com.vaadin.flow.component.progressbar.ProgressBar;

import java.io.IOException;
import java.io.OutputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Die Klasse Studentin repräsentiert die Hauptansicht für StudentInnen und verwaltet verschiedene
 * Interaktionen im Zusammenhang mit Praktikumsanträgen und Benutzerverwaltung.
 * <p>
 * Diese Vaadin-Ansicht bietet Funktionalitäten für:
 * <p>
 * - Benutzer-Abmeldung <br>
 * - Anzeige und Verwaltung des Praktikumsantragsstatus (Das Praktikum kann auch abgebrochen werden)<br>
 * - Verwaltung von Praktikumsanträgen (Erstellen, Bearbeiten, Löschen, Abbrechen und Statusanzeige)<br>
 * - Hochladen vom Praktikumsposter<br>
 * -Anzeige von Kommentaren des Praktikumsbeauftragten<br>
 * -Die Klasse kommuniziert mit Methoden wie z.b. sendJsonToBackend, uploadFile, und getPraktikumsAntrag mit dem Backend.<br>
 * </p>
 *
 * @author Maryam Mirza
 * @since 2025-01-29
 */

/*
"@Route" Navigiert zu "studentin/startseite" mit SubordinateBanner-Layout.
 @CssImport Importiert benutzerdefiniertes CSS für Styling.
 @PageTitle("Studentin") Der Titel des Browser Tabs ist hier mit Studentin festgelegt.
 */
@Route(value = "studentin/startseite", layout = MainBanner.class)
@CssImport("./styles/startseite.css")
@PageTitle("Studentin")

public class Studentin extends VerticalLayout {

    /**
     * Basis-URL der Backend-API für HTTP-Anfragen.
     * Wird für Kommunikation mit dem Server verwendet.
     */
    private final String backendUrl = "http://localhost:3000/api/";

    /**
     * RestTemplate für API-Anfragen an das Backend.
     * Ermöglicht Lese- und Schreiboperationen. Das RestTemplate sendet API Anfragen ans Backend.
     */
    private RestTemplate restTemplate = new RestTemplate();

    /**
     * Konstruktor für die Studentin-Ansicht<br><br>
     *
     *      Initialisiert die Ansicht durch:<br>
     *       - Überprüfung ob Matrikelnummer vorhanden ist<br>
     *       - Erstellung des Logouts<br>
     *       - Anzeige eines neuen Antragsformulars<br>
     *       -Anzeige des Antrag Erstellen Buttons<br>
     *
     * @throws IOException wenn bei der Kommunikation mit dem Backend ein Fehler auftritt.
     */
    public Studentin() throws IOException {
        addClassName("startseite-view");

        setSizeFull();

        // Scrollen wieder aktivieren
        UI.getCurrent().getElement().getStyle().set("overflow", "auto");

        //hier wird aus der Session die Matrikelnummer geholt.
        String matrikelnummer = (String) VaadinSession.getCurrent().getAttribute("matrikelnummer");

        if (matrikelnummer == null) {
            Notification.show("Keine Matrikelnummer in der Sitzung gefunden. Bitte logge dich erneut ein.", 5000, Notification.Position.MIDDLE);
            getUI().ifPresent(ui -> ui.navigate("login")); //hier wird man zur loginseite navigiert, falls die matrikelnummer null ist.
            return;
        }

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
                    "Möchtest du dich wirklich ausloggen?",
                    "Ja",
                    "Abbrechen",
                    () -> {
                        VaadinSession session = VaadinSession.getCurrent();
                        if (session != null) {
                            session.getSession().invalidate();
                            session.close(); // VaadinSession schließen
                        }

                        getUI().ifPresent(ui -> ui.getPage().setLocation("login"));
                    }
            );
            confirmDialog.open();
        });

        HorizontalLayout header = new HorizontalLayout(logoutButton);
        header.setWidthFull();
        header.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.getStyle().set("position", "relative");

        Div spacer = new Div();
        spacer.setHeight("20px");

        // Antrag anzeigen oder "Neuen Antrag erstellen"
        Component content = hasAntrag(matrikelnummer) ? createMeinAntragContainer(matrikelnummer) : createStartseite();

        // Elemente hinzufügen
        add(header, spacer, content);
    }

    /**
     * Überprüft, ob ein Studierender bereits einen Antrag gestellt hat.<br>
     *
     * @return true, wenn ein Antrag existiert, sonst false
     */
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

    /**
     * Erstellt einen Container zur Anzeige des aktuellen Praktikumsantrags des Studenten.
     * <p>
     * Bietet Funktionalitäten zum:
     * - Anzeigen des Antragsstatus
     * - Bearbeiten des Antrags
     * - Zurückziehen des bereits eingereichten Antrags
     * - Abbrechen des laufenden Praktikums
     *
     * @param matrikelnummer Matrikelnummer des Studenten
     * @return VerticalLayout mit Komponenten zur Antragsverwaltung
     * @throws IOException wenn beim Erstellen des Containers ein Fehler auftritt
     */
    // Buttons für Anzeigen, löschen und Bearbeiten vom Antrag
    private VerticalLayout createMeinAntragContainer(String matrikelnummer) throws IOException {
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
        bearbeitenButton.setVisible("Gespeichert".equalsIgnoreCase(status) ||
                "Abgelehnt".equalsIgnoreCase(status));

        bearbeitenButton.addClickListener(event -> {
            VaadinSession.getCurrent().setAttribute("neuerAntrag", false); // Indikator für Bearbeiten
            getUI().ifPresent(ui -> ui.navigate("praktikumsformular"));
        });


        //Löschen Button
        Button antragZurueckziehenButton = new Button("Antrag zurückziehen");
        antragZurueckziehenButton.addClassName("loeschen-button2");
        antragZurueckziehenButton.setVisible(
                "Abgelehnt".equalsIgnoreCase(status) ||
                        "gespeichert".equalsIgnoreCase(status)
                        || "zugelassen".equalsIgnoreCase(status)
        );

        antragZurueckziehenButton.addClickListener(event -> {
            Dialog confirmDialog = DialogUtils.createStandardDialog(
                    "Antrag zurückziehen",
                    null,
                    "Bist du dir sicher, dass du den Antrag zurückziehen möchtest?",
                    "Ja",
                    "Abbrechen",
                    () -> {
                        loeschenAntrag(matrikelnummer);
                        Executors.newSingleThreadScheduledExecutor().schedule(() -> {
                            UI.getCurrent().access(() -> UI.getCurrent().getPage().reload());
                        }, 3, TimeUnit.SECONDS);
                        UI.getCurrent().getPage().reload();

                    }
            );
            confirmDialog.open();
        });


        Button praktikumAbbrechenButton = new Button("Praktikum abbrechen");
        praktikumAbbrechenButton.addClassName("abbrechen-button4");
        praktikumAbbrechenButton.setVisible("Derzeit im Praktikum".equalsIgnoreCase(status)); // nur sichtbar, falls im Praktikum
        praktikumAbbrechenButton.addClickListener(event -> {
            ArbeitstageBerechnungsService arbeitstageRechner = new ArbeitstageBerechnungsService();
            JSONObject antrag = getPraktikumsAntrag(matrikelnummer);

            if (antrag != null) {
                try {
                    //LocalDate startDatum = LocalDate.parse(antrag.getString("startdatum"));
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
                    LocalDate startDatum = LocalDate.parse(antrag.getString("startdatum"), formatter);
                    String isoDatum = startDatum.toString(); // Gibt "yyyy-MM-dd" zurück
                    startDatum = LocalDate.parse(isoDatum);

                    LocalDate heutigesDatum = LocalDate.now();
                    // Überprüfen, ob das Praktikum im Ausland stattfindet
                    boolean imAusland = "Ja".equalsIgnoreCase(antrag.optString("imAusland", "Nein"));

                    int absolvierteTage;
                    if (imAusland) {
                        // Berechnung ohne Feiertage, da Ausland
                        absolvierteTage = arbeitstageRechner.berechneArbeitstageOhneFeiertage(startDatum, heutigesDatum);
                    } else {
                        // Berechnung mit Feiertagen für das angegebene Bundesland
                        String bundesland = antrag.getString("bundeslandPraktikumsstelle");
                        if (bundesland.isEmpty() || "keine Angabe notwendig".equalsIgnoreCase(bundesland)) {
                            throw new IllegalArgumentException("Kein gültiges Bundesland angegeben für ein inländisches Praktikum.");
                        }
                        absolvierteTage = arbeitstageRechner.berechneArbeitstageMitFeiertagen(startDatum, heutigesDatum, bundesland);
                    }

                    Dialog confirmDialog = DialogUtils.createStandardDialog(
                            "Praktikum abbrechen",
                            null,
                            "Du hast bisher " + absolvierteTage + " Arbeitstage absolviert. Möchtest du das Praktikum abbrechen?",
                            "Ja",
                            "Abbrechen",
                            () -> {
                                try {

                                    String abbruchDatum = heutigesDatum.format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));
                                    String notiz = "Das Praktikum wurde am " + abbruchDatum +
                                            " abgebrochen. Bereits absolvierte Arbeitstage: " + absolvierteTage;

                                    String json = createJsonNachricht(matrikelnummer, notiz, abbruchDatum);
                                    HttpResponse<String> response = sendJsonToBackend(json, backendUrl + "arbeitstageNachricht");

                                    if (response.statusCode() == 200 || response.statusCode() == 201) {
                                        // Antrag löschen nach Data senden
                                        deletePraktikumsantrag(matrikelnummer);
                                        Notification.show("Das Praktikum wurde abgebrochen. Bereits absolvierte Arbeitstage: " + absolvierteTage, 5000, Notification.Position.MIDDLE);
                                        UI.getCurrent().getPage().reload();
                                    } else {
                                        Notification.show("Systemfehler! Bitte erneut versuchen.", 5000, Notification.Position.MIDDLE);
                                    }
                                } catch (Exception ex) {
                                    Notification.show("Fehler beim Abbruch: " + ex.getMessage(), 5000, Notification.Position.MIDDLE);
                                }
                            }
                    );
                    confirmDialog.open();

                } catch (Exception e) {
                    Notification.show("Fehler bei der Berechnung der absolvierten Tage: " + e.getMessage(), 5000, Notification.Position.MIDDLE);
                }
            } else {
                Notification.show("Praktikumsantrag konnte nicht abgerufen werden.", 5000, Notification.Position.MIDDLE);
            }
        });


        //Kommentare des PB bei Ablehnung
        Button kommentarToggle = new Button("Kommentare >", VaadinIcon.COMMENTS.create());
        kommentarToggle.addClassName("kommentar-button2");
        kommentarToggle.getStyle().set("margin-top", "10px");
        if ("Absolviert".equalsIgnoreCase(status)) {
            kommentarToggle.setVisible(false);
        }

        VerticalLayout kommentarContent = new VerticalLayout();
        kommentarContent.addClassName("scrollable-comments");
        kommentarContent.setVisible(false);

        // Layout für bearbeiten/löschen und für abbrechen falls derzeit im praktikum
        HorizontalLayout buttonLayout = new HorizontalLayout();
        if ("Derzeit im Praktikum".equalsIgnoreCase(status)) {
            buttonLayout.add(praktikumAbbrechenButton);
        } else if ("Absolviert".equalsIgnoreCase(status)) {


            VerticalLayout uploadContainer = new VerticalLayout();
            // "Poster hochladen" button
            Button posterHochladenButton = new Button("Poster hochladen");
            posterHochladenButton.addClassName("poster-hochladen-button");

            Span hinweisText = new Span("Hinweis: Das Poster kann nur im PDF-Format hochgeladen werden.");
            hinweisText.getStyle().set("color", "gray");
            hinweisText.getStyle().set("font-size", "12px");


            // upload
            MemoryBuffer buffer = new MemoryBuffer();
            Upload upload = new Upload(buffer);
            upload.setAcceptedFileTypes("application/pdf"); // nur pdf dateien
            upload.setMaxFiles(1); // nur eine Datei auf einmal hochladen

            // "Drop file here"-Text entfernen
            upload.setDropAllowed(false);
            Button uploadButton = new Button("Datei auswählen");
            uploadButton.addClassName("datei-auswählen-button");
            upload.setUploadButton(uploadButton);

            // balken mit uploadprogress
            ProgressBar progressBar = new ProgressBar();
            progressBar.setWidth("100%");
            progressBar.setVisible(false);

            // manuelle berechnung uploadfortschritt
            AtomicLong bytesRead = new AtomicLong(0);
            AtomicLong contentLength = new AtomicLong(0);

            //wenn upload gestartet wird
            upload.addStartedListener(event -> {
                progressBar.setVisible(true);
                progressBar.setValue(0.0); //uploadbalken auf 0 setzen
                bytesRead.set(0);
                contentLength.set(event.getContentLength()); //fuer gesamtgroesse der datei
            });

            //balken aktualisieren
            buffer.getInputStream().transferTo(new OutputStream() {
                @Override
                public void write(int b) throws IOException {
                    bytesRead.incrementAndGet(); // Ein Byte wurde gelesen
                    updateProgressBar(progressBar, bytesRead.get(), contentLength.get());
                }

                @Override
                public void write(byte[] b, int off, int len) throws IOException {
                    bytesRead.addAndGet(len); // Anzahl der Bytes hinzufügen
                    updateProgressBar(progressBar, bytesRead.get(), contentLength.get());
                }
            });

            // wenn upload fertig
            upload.addSucceededListener(event -> {
                try {
                    // In Byte-Array umwandeln
                    byte[] fileBytes = buffer.getInputStream().readAllBytes();
                    String fileName = event.getFileName();

                    // Datei auf dem Server speichern
                    uploadFile(fileBytes, fileName, matrikelnummer);

                    // Kurze Notification
                    Notification.show("Poster wurde erfolgreich hochgeladen", 5000, Notification.Position.MIDDLE);


                } catch (Exception e) {
                    Notification.show("Fehler beim Hochladen des Posters: " + e.getMessage(), 5000, Notification.Position.MIDDLE);
                } finally {
                    progressBar.setVisible(false); // Fortschrittsbalken ausblenden
                    posterHochladenButton.setVisible(false);
                    upload.setVisible(false);
                    hinweisText.setVisible(false);
                }
            });

            posterHochladenButton.addClickListener(e -> {
                // Upload-Layout hinzufügen
                VerticalLayout uploadLayout = new VerticalLayout(upload, hinweisText, progressBar);
                container.add(uploadLayout);
            });
            buttonLayout.add(posterHochladenButton);
        } else {
            buttonLayout.add(bearbeitenButton, antragZurueckziehenButton);
        }
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.END);
        container.add(headerLayout, spacer, buttonLayout, kommentarToggle, kommentarContent);


        List<String> notizen = getAntragNotiz(matrikelnummer);
        for (String notiz : notizen) {

            String formattedNotiz;

            if (notiz.contains(": ")) {
                formattedNotiz =

                        "<div style='font-size: 0.85em; color: gray; font-style: italic; margin-bottom: 5px;'>" +
                                notiz.split(": ", 2)[0] + "</div>" +
                                "<div>" + notiz.split(": ", 2)[1] + "</div>";
            } else {
                // Falls kein ":" gefunden wird, bleibt die gesamte Notiz im Nachrichtenteil
                formattedNotiz = "<div class='nachricht'>" + notiz + "</div>";
            }

            VerticalLayout kommentarBox = new VerticalLayout();
            kommentarBox.addClassName("note-style");

            Span kommentarText = new Span(notiz);
            kommentarText.getElement().setProperty("innerHTML", formattedNotiz);

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


    /**
     * Sendet eine JSON-Nachricht an das Backend.
     *
     * @param json der zu sendende JSON-String
     * @param url  die Ziel-URL im Backend
     * @return die HTTP-Antwort des Backends
     * @throws IOException          wenn ein Fehler bei der Übertragung auftritt
     * @throws InterruptedException wenn der Vorgang unterbrochen wird
     */
    // Methode, um Json ans Backend zu schicken
    private HttpResponse<String> sendJsonToBackend(String json, String url) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        java.net.http.HttpRequest request = java.net.http.HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(java.net.http.HttpRequest.BodyPublishers.ofString(json))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    /**
     * Erstellt eine JSON-Nachricht für den Praktikumsabbruch.
     *
     * @param empfaenger   die Matrikelnummer des Empfängers
     * @param notiz        der Nachrichtentext
     * @param abbruchDatum das Datum des Abbruchs
     * @return ein JSON-String mit der formatierten Nachricht
     */
    // Verpackt die Nachricht mit den absolvierten Tagen bei Abbruch in ein Json
    private String createJsonNachricht(String empfaenger, String notiz, String abbruchDatum) {
        return String.format("{\"nachricht\": \"%s\", \"datum\": \"%s\", \"empfaenger\": \"%s\"}", notiz, abbruchDatum, empfaenger);
    }


    /**
     * Lädt eine Datei (Praktikumsposter) zum Backend hoch.
     *
     * @param fileBytes      der Inhalt der Datei als Byte-Array
     * @param fileName       der Name der Datei
     * @param matrikelnummer die Matrikelnummer des Studierenden
     * @throws RuntimeException wenn ein Fehler beim Hochladen auftritt
     */
    // Methode zum Hochladen des posters
    private void uploadFile(byte[] fileBytes, String fileName, String matrikelnummer) {
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        ByteArrayResource byteArrayResource = new ByteArrayResource(fileBytes) {
            @Override
            public String getFilename() {
                return fileName;
            }
        };
        body.add("file", byteArrayResource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity = new HttpEntity<>(body, headers);
        String url = String.format("http://localhost:3000/api/poster/upload/%s", matrikelnummer);

        ResponseEntity<String> response = restTemplate.postForEntity(url, requestEntity, String.class);
        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("Fehler beim Hochladen: " + response.getBody());
        }
    }

    /**
     * Erstellt ein Statusabzeichen basierend auf dem Antragsstatus.
     *
     * @param status der aktuelle Status des Antrags
     * @return ein Span-Element mit dem formatierten Statusabzeichen
     */
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

    /**
     * Löscht den Praktikumsantrag eines Studierenden.
     *
     * @param matrikelnummer die Matrikelnummer des Studierenden
     */
    private void loeschenAntrag(String matrikelnummer) {
        String url = backendUrl + "antrag/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Antrag wurde zurückgezogen.", 3000, Notification.Position.MIDDLE);
            } else {
                Notification.show("Antrag nicht gefunden oder Fehler beim Zurückziehen.");
            }
        } catch (Exception e) {
            Notification.show("Fehler: " + e.getMessage());
        }
    }

    /**
     * Erstellt die Startseite für Studierende ohne aktiven Antrag.
     *
     * @return eine Komponente, die die Startseite darstellt
     */
    private Component createStartseite() {
        VerticalLayout layout = new VerticalLayout();
        layout.setAlignItems(Alignment.CENTER);

        //Neues Kärtchen mit Titel
        VerticalLayout card = new VerticalLayout();
        card.addClassName("neuer-antrag-card");
        card.setSizeFull();
        card.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

        H2 title = new H2("");
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
                + "Du kannst den Antrag auch zwischenspeichern, damit du ihn später weiterbearbeiten kannst.<br>"
                + "Achtung: Du kannst immer nur einen einzigen Antrag anlegen.");
        hintLabel.getElement().setProperty("innerHTML", hintLabel.getText()); // Damit die <br> korrekt interpretiert werden
        hintLabel.addClassName("hint-label");
        card.add(title, newRequestButton, hintLabel);

        // Kommentare holen und anzeigen falls vorhanden
        String matrikelnummer = (String) VaadinSession.getCurrent().getAttribute("matrikelnummer");
        List<String> notizen = new ArrayList<>();
        if (matrikelnummer != null) {
            notizen = getAntragNotiz(matrikelnummer);
        }

        // Nachricht Keine Kommentare vorhanden ausfiltern
        notizen = notizen.stream()
                .filter(notiz -> !notiz.equals("Keine Kommentare vorhanden."))
                .toList();

        // Kommentare anzeigen, nur, wenn sie es gibt.
        if (!notizen.isEmpty()) {
            Button kommentarToggle = new Button("Kommentare >", VaadinIcon.COMMENTS.create());
            kommentarToggle.addClassName("kommentar-button2");
            kommentarToggle.getStyle().set("margin-top", "10px");

            VerticalLayout kommentarContent = new VerticalLayout();
            kommentarContent.addClassName("scrollable-comments");
            kommentarContent.setVisible(false);

            for (String notiz : notizen) {
                String formattedNotiz = notiz.replaceFirst(":", ":<br>");
                VerticalLayout kommentarBox = new VerticalLayout();
                kommentarBox.addClassName("note-style");

                Span kommentarText = new Span();
                kommentarText.getElement().setProperty("innerHTML", formattedNotiz);

                kommentarBox.add(kommentarText);
                kommentarContent.add(kommentarBox);
            }

            kommentarToggle.addClickListener(event -> {
                boolean isVisible = kommentarContent.isVisible();
                kommentarContent.setVisible(!isVisible);
                kommentarToggle.setText(isVisible ? "Kommentare >" : "Kommentare ∨");
            });

            card.add(kommentarToggle, kommentarContent);
        }

        layout.add(card);
        return layout;
    }


    /**
     * Ruft den aktuellen Status des Praktikumsantrags ab.
     *
     * @param matrikelnummer die Matrikelnummer des Studierenden
     * @return der Status des Antrags als String
     */
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


    /**
     * Ruft die Notizen (Kommentare) zu einem Praktikumsantrag ab.
     *
     * @param matrikelnummer die Matrikelnummer des Studierenden
     * @return eine Liste von Strings mit den Notizen
     */
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
                    String datum = jsonObject.getString("datum");
                    notizen.add(datum + ": " + nachricht);

                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen des Kommentars: " + e.getMessage());
        }
        //return "Keine Kommentare vorhanden.";
        return notizen.isEmpty() ? List.of("Keine Kommentare vorhanden.") : notizen;
    }


    /**
     * Ruft die Details eines Praktikumsantrags ab.
     *
     * @param matrikelnummer die Matrikelnummer des Studierenden
     * @return ein JSONObject mit den Antragsdaten oder null bei einem Fehler
     */
    //Anbindung zum Backend AntragAnzeigen
    private JSONObject getPraktikumsAntrag(String matrikelnummer) {
        String url = backendUrl + "antrag/getantrag/" + matrikelnummer;
        // URL des Backend-Endpunkts
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

    /**
     * Aktualisiert den Fortschrittsbalken beim Datei-Upload.
     *
     * @param progressBar   der zu aktualisierende Fortschrittsbalken
     * @param bytesRead     die Anzahl der bereits gelesenen Bytes
     * @param contentLength die Gesamtgröße der Datei in Bytes
     */
    // Methode balkenaktualisierung
    private void updateProgressBar(ProgressBar progressBar, long bytesRead, long contentLength) {
        if (contentLength > 0) { // Division durch 0 vermeiden
            double progress = (double) bytesRead / contentLength; // Fortschritt berechnen
            progressBar.setValue(progress); // Fortschrittsbalken aktualisieren
        }
    }

    /**
     * Löscht den Praktikumsantrag eines Studierenden im Backend.
     *
     * @param matrikelnummer die Matrikelnummer des Studierenden
     */
    private void deletePraktikumsantrag(String matrikelnummer) {
        String url = "http://localhost:3000/api/antrag/" + matrikelnummer;
        try {
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Antrag erfolgreich gelöscht.");
            } else {
                Notification.show("Fehler beim Löschen des Antrags.");
            }
        } catch (Exception e) {
            Notification.show("Fehler: " + e.getMessage());
        }
    }


}




