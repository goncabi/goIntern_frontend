package com.example.application.views;
import com.example.application.service.ArbeitstageBerechnungsService;
import com.example.application.views.subordinatebanner.SubordinateBanner;
import com.vaadin.flow.component.UI;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.button.ButtonVariant;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.formlayout.FormLayout;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.icon.Icon;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.data.renderer.ComponentRenderer;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.example.application.utils.DialogUtils;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;

/**
 * Die Klasse Praktikumsbeauftragter repräsentiert die Admin-Startseite der Anwendung, auf der Praktikumsanträge angezeigt, gefiltert und verwaltet werden.
 * Zusätzlich können Anträge genehmigt oder abgelehnt werden.
 */

@Route(value= "admin/startseite", layout = SubordinateBanner.class)
@CssImport("./styles/styles.css")
public class Praktikumsbeauftragter extends VerticalLayout {

    /**
     * Grid zur Anzeige der Praktikumsanträge.
     */
    private Grid<Praktikumsantrag> grid;
    /**
     * Liste der Praktikumsanträge, die im Grid angezeigt werden.
     */
    private List<Praktikumsantrag> antraege;
    /**
     * Gibt an, ob ein Antrag bereits genehmigt oder abgelehnt wurde.
     */
    private boolean bereitsGenehmigtOderAbgelehnt = false;
    /**
     * HorizontalLayout zur Anzeige von Filter-Badges.
     */
    private HorizontalLayout badges;
    /**
     * Service zur Berechnung der Arbeitstage.
     */
    private ArbeitstageBerechnungsService arbeitstageRechner = new ArbeitstageBerechnungsService();

    /**
     * Konstrukor der Klasse Praktikumsbeauftragter.
     */
    public Praktikumsbeauftragter() {

        setSizeFull();
        // Scrollen wieder aktivieren
        UI.getCurrent().getElement().getStyle().set("overflow", "auto");

        String username = (String) VaadinSession.getCurrent().getAttribute("username");
        if (username == null) {
            Notification.show("Kein Username in der Sitzung gefunden. Bitte loggen Sie sich erneut ein.", 5000, Notification.Position.MIDDLE);
            getUI().ifPresent(ui -> ui.navigate("login"));
            return;
        }
        addClassName("admin-startseite-view");


        H1 title = new H1("Übersicht über Praktikumsanträge");
        title.getStyle().set("margin-top", "0").set("margin-bottom", "10px");


        Button notificationBell = new Button(VaadinIcon.BELL.create());
        notificationBell.addClassName("notification-button7");
        notificationBell.getElement().getStyle().set("cursor", "pointer");
        ContextMenu notificationMenu = new ContextMenu(notificationBell);
        notificationMenu.setOpenOnClick(true);


        List<NotificationMessage> nachrichten = getNachrichten(username);
        if (nachrichten.isEmpty()) {
            notificationMenu.addItem("Keine neuen Benachrichtigungen.");
        } else {
            notificationBell.getElement().getStyle().set("color", "red");
            notificationMenu.addItem("Alle Nachrichten gelesen?").addClickListener(event -> {
                nachrichtenLoeschen(username);
            });
            for (NotificationMessage nachricht : nachrichten) {
                notificationMenu.addItem(nachricht.date() + " : " + nachricht.message());
            }
        }


        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.addClassName("logout-button8");
        logoutButton.getElement().getStyle().set("cursor", "pointer");
        logoutButton.addClickListener(event -> {

            Dialog confirmDialog = createLogoutConfirmationDialog();
            confirmDialog.open();

        });

        Div spacer = new Div();
        spacer.getStyle().set("flex-grow", "1");


        HorizontalLayout header = new HorizontalLayout(title, spacer, notificationBell, logoutButton);
        header.setWidthFull();
        header.setAlignItems(Alignment.CENTER);


        add(header);

        //Filterleiste
        ComboBox<String> comboBox = new ComboBox<>();
        comboBox.setPlaceholder("Nach Status filtern");
        comboBox.setItems("alle Anträge anzeigen", "Antrag offen", "Abgelehnt", "Zugelassen", "Derzeit im Praktikum", "Absolviert");
        comboBox.setWidth("250px");
        comboBox.addClassName("filterleiste");
        comboBox.getStyle().set("height", "40px").set("padding", "0").set("margin", "0");



        comboBox.setRenderer(new ComponentRenderer<>(item -> {
            Span span = new Span(item);
            if ("alle Anträge anzeigen".equals(item)) {
                span.getStyle()
                        .set("color", "steelblue")
                        .set("font-weight", "bold");
            }
            return span;
        }));


        comboBox.addValueChangeListener(e -> {
            if (e.getValue() != null) {
                String selectedValue = e.getValue();
                if ("alle Anträge anzeigen".equals(selectedValue)) {
                    badges.removeAll();
                    grid.setItems(antraege);
                } else {
                    badges.removeAll();
                    Span filterBadge = createFilterBadge(e.getValue());

                    filterGridByStatus(e.getValue());

                }
            }
        });

        //Suchleiste
        TextField searchField = new TextField();
        searchField.setPlaceholder("Suchleiste");
        searchField.setClearButtonVisible(true);
        searchField.setWidth("250px");
        searchField.getStyle().set("height", "40px").set("padding", "0").set("margin", "10px");
        searchField.setClearButtonVisible(true);

        //Lupe hinzugefügt
        Icon searchIcon = VaadinIcon.SEARCH.create();
        searchIcon.getStyle()
                .set("color", "var(--lumo-secondary-text-color)")
                .set("margin-right", "5px");

        searchField.setPrefixComponent(searchIcon);



        searchField.addValueChangeListener(event -> {
            String searchTerm = event.getValue().toLowerCase();
            if (searchTerm.isEmpty()) {
                grid.setItems(antraege);
            } else {
                List<Praktikumsantrag> filteredItems = antraege.stream()
                        .filter(antrag -> antrag.getName().toLowerCase().contains(searchTerm) ||
                                antrag.getMatrikelnummer().toLowerCase().contains(searchTerm))
                        .toList();
                grid.setItems(filteredItems);

                if (filteredItems.isEmpty()) {
                    Notification.show("Keine Ergebnisse für: " + searchTerm, 3000, Notification.Position.MIDDLE);
                }
            }
        });

        add(searchField);

        //Filterleiste und suchleiste nebeneinander
        HorizontalLayout filterLayout = new HorizontalLayout(comboBox, searchField);
        filterLayout.setAlignItems(Alignment.CENTER);
        filterLayout.setDefaultVerticalComponentAlignment(Alignment.CENTER);
        filterLayout.setSpacing(true);
        filterLayout.setPadding(false);
        filterLayout.setWidthFull();
        filterLayout.getStyle()
                .set("display", "flex")
                .set("flex-direction", "row")
                .set("align-items", "center")
                .set("gap", "15px");

        // Füge die Suchleisten unter die Überschrift hinzu
        add(filterLayout);

        badges = new HorizontalLayout();
        badges.getStyle().set("flex-wrap", "wrap");

        //Lädt die Daten der Praktikumsanträge und zeigt sie im Grid an.
        antraege = eingegangeneAntraegePreviewListe();
        if (antraege.isEmpty()) {
            Notification.show("Keine Anträge verfügbar.", 3000, Notification.Position.MIDDLE);
        }

        //Grid zur Anzeige der Anträge.
        grid = new Grid<>(Praktikumsantrag.class);
        grid.setWidthFull();
        grid.setMinWidth("800px"); // Mindestbreite setzen, damit es nicht zu schmal wird
        grid.setHeight("600px");

        // Verhindert das Abschneiden von Spalten
        grid.setColumnReorderingAllowed(true);
        grid.getColumns().forEach(column -> {
            column.setAutoWidth(true); // Automatische Spaltenbreite
            column.setFlexGrow(1); // Spalten können sich flexibel anpassen
        });


        grid.getStyle().set("overflow-x", "auto");


        grid.setColumns("name", "matrikelnummer");


        grid.addComponentColumn(antrag -> createStatusBadge(antrag.getStatus()))
                .setHeader("Status");


        grid.addComponentColumn(antrag -> {

            Button anzeigenButton = new Button("Antrag anzeigen", VaadinIcon.EYE.create());
            anzeigenButton.addClassName("antragAnzeigen-button3");


            anzeigenButton.addClickListener(event -> {
                vollstaendigenAntragAnzeigenImPopUp(antrag.getMatrikelnummer());
            });
            return anzeigenButton;
        }).setHeader("")
                .setAutoWidth(true)
                .setFlexGrow(0)
                .setWidth("180px");




        //Spalte für "Poster anzeigen"
        grid.addComponentColumn(praktikumsantrag -> {
            if ("absolviert".equalsIgnoreCase(praktikumsantrag.getStatus())) {

                Button anzeigenButton = new Button("Poster anzeigen", VaadinIcon.EYE.create());
                anzeigenButton.addClassName("posterAnzeigen-button3");

                anzeigenButton.addClickListener(event -> {
                    posterAnzeigenImPopUp(praktikumsantrag.getMatrikelnummer());
                });
                return anzeigenButton;
            }
            return new Span(); // Platzhalter für leere Zellen, falls noch kein poster vorhanden
        }).setHeader("")
                .setAutoWidth(true)
                .setFlexGrow(0)
                .setWidth("180px");


        grid.setItems(antraege);

        // Badges und das Grid
        add(badges, grid);
    }


    /**
     * Methode, um Nachrichten aus dem Backend zu holen.
     * Diese Methode ruft Benachrichtigungen für einen bestimmten Benutzer vom Backend ab und gibt sie als Liste von NotificationMessafe-Objekt zurück.
     * @param username Der Benutzername, für den die Nachrichten abgerufen weden sollen.
     * @return eine Liste von NotificationMessage-Objekten
     */
    private List<NotificationMessage> getNachrichten(String username) {
        List<NotificationMessage> nachrichten = new ArrayList<>();
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = "http://localhost:3000/api/nachrichten/" + username;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONArray jsonArray = new JSONArray(response.getBody());
                for (int i = 0; i < jsonArray.length(); i++) {
                    JSONObject json = jsonArray.getJSONObject(i);
                    String nachricht = json.getString("nachricht");
                    String datum = json.getString("datum");
                    nachrichten.add(new NotificationMessage(nachricht, datum));
                }
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Nachrichten: " + e.getMessage());
        }
        return nachrichten;
    }

    /**
     * Innere Klasse zur Darstellung einer Benachrichtigung.
     * @param message Die Nachricht als String.
     * @param date Das Datum der Nachricht.
     */
    public record NotificationMessage(String message, String date) {
    }

    /**
     * Methode, um Nachrichten für einen Benutzer zu löschen.
     * diese Methode sendet eine DELETE-Anfrage an das Backend, um alle Nachrichten für den angegebenen Benutzer zu löschen.
     * @param username Der Benutzername, dessen Nachrichten gelöscht werden sollen.
     */
    private void nachrichtenLoeschen(String username) {
        String url = "http://localhost:3000/api//nachrichtenLoeschen/" + username;
        try {
            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, null, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Nachrichten erfolgreich gelöscht.");
                UI.getCurrent().getPage().reload();
            } else {
                Notification.show("Nachrichten nicht gefunden oder Fehler beim Löschen.");
            }
        } catch (Exception e) {
            Notification.show("Fehler: " + e.getMessage());
        }
    }

    /**
     * Erstellt einen Bestätigungsdialog für den Logout-Prozess.
     * Diese Methode erstellt einen Dialog mit einer Sicherheitsnachricht und zwei Optionen: "Ja" und "Abbrechen".
     * wenn "Ja" ausgewählt wird, wird der Benutzer zur Login-Seite navigiert.
     * @return ein Dialog-Objekt, das die Logout-Bestätigung anzeigt.
     */
    private Dialog createLogoutConfirmationDialog() {
        return DialogUtils.createStandardDialog(
                "Logout bestätigen",
                "Sicherheitshinweis: Bitte schließen Sie den Tab nach dem Logout.",
                "Möchten Sie sich wirklich ausloggen?",
                "Ja",
                "Abbrechen",
                () -> {
                    VaadinSession session = VaadinSession.getCurrent();
                    if (session != null) {
                        session.getSession().invalidate();
                        session.close(); // VaadinSession schließen
                    }
                    UI.getCurrent().getPage().setLocation("login");
                }
        );
    }
    /**
     * Holt die Liste der eingegangenen Praktikumsanträge zur Vorschau.
     * Diese Methode ruft alle Praktikumsanträge vom Backend ab, die nicht den Status "gespeichert" haben.
     * Sie erstellt eine Liste von Praktikumsantrag-Objekten und gibt diese zurück.
     * @return eine Liste von Praktikumsanträgen zur Anzeige in der Vorschau.
     */
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

    //für das antrag pop-up
    private Span createStyledSpan(String text) {
        Span span = new Span(text);
        span.getStyle()
                .set("color", "black")
                .set("font-size", "16px");
        return span;
    }

    /**
     * Formatiert ein Datum im ISO-Format (yyyy-MM-dd) in das deutsche Format (dd.MM.yyyy).
     * @param isoDate Das Datum im ISO-Format
     * @return Das Datum im deutschen Format oder das Originaldatum bei einem Parsing-Fehler.
     */
    private String formatDate(String isoDate) {
        try {
            LocalDate date = LocalDate.parse(isoDate); // ISO-Format (yyyy-MM-dd)
            return date.format(DateTimeFormatter.ofPattern("dd.MM.yyyy")); // Deutsches Format
        } catch (DateTimeParseException e) {
            return isoDate; // Fallback: ist originalwert, damit bei kommunikation mit backend alles klaüüt
        }
    }

    /**
     * Zeigt alle Details eines vollständigen Praktikumsantrags in einem Pop-Up an.
     * Diese Methode ruft die Antragsdetails basierend auf der Matrikelnummer vom Backend ab undd zeigt sie in einem Dialogfenster an.
     * @param matrikelnummer die Matrikelnummer des Studenten, dessen Antrag angezeigt werden soll.
     */

    private void vollstaendigenAntragAnzeigenImPopUp(String matrikelnummer) {
        bereitsGenehmigtOderAbgelehnt = false; //wird neu auf false gesetzt, sodass es nicht auf true bleibt.
        try {
            RestTemplate restTemplate = new RestTemplate();
            String url = String.format("http://localhost:3000/api/antrag/getantrag/%s", matrikelnummer);

            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JSONObject json = new JSONObject(response.getBody());

                Dialog dialog = new Dialog();
                dialog.setWidth("800px");
                dialog.setHeight("90%");

                H3 dialogTitle = new H3("Praktikumsantrag " + json.getString("matrikelnummer"));
                H6 versionTitle = new H6(json.getString("antragsVersion") + ". Einreichung");
                Span versionErläuterung = new Span();
                if(Integer.parseInt(json.getString("antragsVersion")) > 1){
                    versionErläuterung.add("Dieser Antrag wurde bereits eingereicht und abgelehnt. Nach Überarbeitung wird der Antrag hiermit erneut zur Prüfung vorgelegt.");
                }

                FormLayout formLayout = new FormLayout();
                formLayout.setWidthFull();

                // Styles für die Labels und die Werte
                formLayout.setResponsiveSteps(
                        new FormLayout.ResponsiveStep("0", 1)
                );

                formLayout.getElement().getStyle().set("--vaadin-form-item-label-width", "300px");

//                formLayout.addFormItem(new Span(json.getString("antragsVersion")), "Version: ");
                formLayout.addFormItem(new Span(json.getString("matrikelnummer")), "Matrikelnummer:");
                formLayout.addFormItem(new Span(json.getString("nameStudentin")), "Name:");
                formLayout.addFormItem(new Span(json.getString("vornameStudentin")), "Vorname:");
                formLayout.addFormItem(new Span(formatDate(json.getString("gebDatumStudentin"))), "Geburtsdatum:");
                formLayout.addFormItem(new Span(json.getString("strasseHausnummerStudentin")), "Straße und Hausnummer:");
                formLayout.addFormItem(new Span(json.getString("plzStudentin")), "Postleitzahl:");
                formLayout.addFormItem(new Span(json.getString("ortStudentin")), "Ort:");
                formLayout.addFormItem(new Span(json.getString("telefonnummerStudentin")), "Telefonnummer:");
                formLayout.addFormItem(new Span(json.getString("emailStudentin")), "E-Mail-Adresse:");
                formLayout.addFormItem(new Span(json.getString("vorschlagPraktikumsbetreuerIn")), "Vorschlag für Praktikumsbetreuer*in:");
                formLayout.addFormItem(new Span(json.getString("praktikumssemester")), "Praktikumssemester (SoSe / WiSe):");
                formLayout.addFormItem(new Span(json.getString("studiensemester")), "Studiensemester:");
                formLayout.addFormItem(new Span(json.getString("studiengang")), "Studiengang:");
                formLayout.addFormItem(new Span(json.getBoolean("auslandspraktikum") ? "Ja" : "Nein"), "Auslandspraktikum:");
                formLayout.addFormItem(new Span(formatDate(json.getString("datumAntrag"))), "Datum des Antrags:");
                formLayout.addFormItem(new Span(json.getString("namePraktikumsstelle")), "Name der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("strassePraktikumsstelle")), "Straße und Hausnummer der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("plzPraktikumsstelle")), "Postleitzahl der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("ortPraktikumsstelle")), "Ort der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("bundeslandPraktikumsstelle")), "Bundesland der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("landPraktikumsstelle")), "Land der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("ansprechpartnerPraktikumsstelle")), "Ansprechpartner*in der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("telefonPraktikumsstelle")), "Telefon der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("emailPraktikumsstelle")), "E-Mail-Adresse der Praktikumsstelle:");
                formLayout.addFormItem(new Span(json.getString("abteilung")), "Abteilung:");
                formLayout.addFormItem(new Span(json.getString("taetigkeit")), "Tätigkeit als Praktikant*in:");
                formLayout.addFormItem(new Span(formatDate(json.getString("startdatum"))), "Startdatum des Praktikums:");
                formLayout.addFormItem(new Span(formatDate(json.getString("enddatum"))), "Enddatum des Praktikums:");


                LocalDate startDate;
                LocalDate endDate;

                try {
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");  // Format anpassen
                    startDate = LocalDate.parse(json.getString("startdatum"), formatter);  // Parsing mit Format
                    endDate = LocalDate.parse(json.getString("enddatum"), formatter);  // Parsing mit Format
                } catch (DateTimeParseException e) {
                    throw new RuntimeException("Fehler beim Parsen des Datums: " + e.getMessage());
                }
                //Berechnet die Arbeitstage des Praktikums, basierend auf Start- und Enddatum sowie dem Bundesland
                boolean auslandspraktikum = json.getBoolean("auslandspraktikum");
                String bundesland = json.getString("bundeslandPraktikumsstelle");

                int arbeitstage;
                if (auslandspraktikum) {
                    arbeitstage = arbeitstageRechner.berechneArbeitstageOhneFeiertage(startDate, endDate);
                } else {
                    arbeitstage = arbeitstageRechner.berechneArbeitstageMitFeiertagen(startDate, endDate, bundesland);
                }
                formLayout.addFormItem(new Span(String.valueOf(arbeitstage)), "Arbeitstage:");



                Button abbrechen = new Button("Abbrechen", event -> dialog.close());
                abbrechen.addClassName("abbrechen-button3");

                Button genehmigen = new Button("Genehmigen");
                genehmigen.addClassName("genehmigen-button3");

                Button ablehnen = new Button("Ablehnen");
                ablehnen.addClassName("ablehnen-button3");



                String status = json.getString("statusAntrag");
                if(!status.equalsIgnoreCase("antrag eingereicht")) {
                        genehmigen.setVisible(false);
                        ablehnen.setVisible(false);

                        genehmigen.getStyle()
                                .set("background-color", "#d3d3d3")
                                .set("color", "#808080")
                                .set("cursor", "not-allowed");
                        ablehnen.getStyle()
                                .set("background-color", "#d3d3d3")
                                .set("color", "#808080")
                                .set("cursor", "not-allowed");
                    }   else {
                    genehmigen.addClickListener(event -> {
                        if (bereitsGenehmigtOderAbgelehnt) {
                            Notification.show("Der Antrag wurde bereits bearbeitet.", 3000, Notification.Position.TOP_CENTER);
                            return;
                        }
                        bereitsGenehmigtOderAbgelehnt = true;
                        genehmigenAntrag(matrikelnummer);
                        dialog.close();
                    });

                ablehnen.addClickListener(event -> {
                            if (bereitsGenehmigtOderAbgelehnt) {
                                Notification.show("Der Antrag wurde bereits bearbeitet.", 3000, Notification.Position.TOP_CENTER);
                                return;
                            }

                    Dialog ablehnungsDialog = new Dialog();
                    ablehnungsDialog.setWidth("600px");
                    ablehnungsDialog.setHeight("600px");

                    H1 ablehnungsTitle = new H1("Antrag ablehnen");
                    TextArea kommentarField = new TextArea("Begründung");
                    kommentarField.setPlaceholder("Geben Sie hier Ihre Begründung ein:");
                    kommentarField.setWidthFull();

                    Button ablehnungAbsendenButton = new Button("Ablehnung absenden", e -> {
                        String kommentar = kommentarField.getValue();
                        if (kommentar == null || kommentar.trim().isEmpty()) {
                            Notification.show("Bitte geben Sie eine Begründung ein.", 3000, Notification.Position.TOP_CENTER);
                            return;
                        }

                        ablehnenAntragMitKommentar(matrikelnummer, kommentar);
                        ablehnungsDialog.close();
                        dialog.close();
                    });
                    ablehnungAbsendenButton.addClassName("ablehnungAbsenden-button3");

                    Button abbrechenButton = new Button("Abbrechen", e -> ablehnungsDialog.close());
                    abbrechenButton.addClassName("ablehnungs-abbrechen-button3");

                    HorizontalLayout buttonLayout = new HorizontalLayout(abbrechenButton, ablehnungAbsendenButton);
                    buttonLayout.setWidthFull();
                    buttonLayout.setJustifyContentMode(JustifyContentMode.BETWEEN);

                    VerticalLayout ablehnungsLayout = new VerticalLayout(ablehnungsTitle, kommentarField, buttonLayout);
                    ablehnungsDialog.add(ablehnungsLayout);
                    ablehnungsDialog.open();

                });}



                // Leeres flexibles Element, sorgt dafür, dass zwischen den buttons abstände sind
                Div spacer = new Div();
                spacer.getStyle().set("flex-grow", "1");


                HorizontalLayout buttonLayout = new HorizontalLayout(abbrechen, spacer, ablehnen,  genehmigen);
                buttonLayout.setWidthFull();
                buttonLayout.setJustifyContentMode(JustifyContentMode.BETWEEN);

                VerticalLayout dialogLayout = new VerticalLayout(dialogTitle, versionTitle, versionErläuterung, formLayout, buttonLayout);
                dialog.add(dialogLayout);
                dialog.open();

            } else {
                Notification.show("Kein Antrag mit Matrikelnummer " + matrikelnummer + " gefunden.");
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Antragsdetails: " + e.getMessage());
        }
    }

    /**
     * sendet eine Anfrage zum Ablehnen eines Praktikumsantrags an das Backend, inklusive eines Ablehngrunds.
     * @param matrikelnummer Die Matrikelnummer des Antragstellers, dessen Antrag abgelehnt werden soll.
     * @param kommentar Der Ablehnungsgrund, der mit dem Antrag gespeichert wird.
     */
    private void ablehnenAntragMitKommentar(String matrikelnummer, String kommentar) {
        try {
            JSONObject jsonAntrag = new JSONObject();
            jsonAntrag.put("statusAntrag", "ABGELEHNT");
            jsonAntrag.put("kommentar", kommentar); //Hier kommt der Kommentar rein, zb. "Kaffe kochen ist kein Informatik"

            //hier wird es ans Backend gesendet
            String backendUrl = String.format("http://localhost:3000/pb/antrag/ablehnen/%s", matrikelnummer);
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonAntrag.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, HttpMethod.POST, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Antrag wurde abgelehnt.", 3000, Notification.Position.TOP_CENTER);
                // Nach erfolgreicher ablehnung: liste neu laden
                List<Praktikumsantrag> aktualisierteListe = eingegangeneAntraegePreviewListe();
                aktualisiereAntraegeListeImFrontend(aktualisierteListe);
                grid.getDataProvider().refreshAll();


            } else {
                Notification.show("Fehler beim Ablehnen des Antrags.", 3000, Notification.Position.TOP_CENTER);
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Ablehnen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }

    /**
     * Sendet eine Anfrage zum Genehmigen eines Praktikumsantrags an das Backend.
     * @param matrikelnummer Die Matrikelnummer des Antragsstellers, dessen Antrag genehmigt werden soll.
     */
    private void genehmigenAntrag(String matrikelnummer) {
        try {
            JSONObject jsonAntrag = new JSONObject();
            jsonAntrag.put("matrikelnummer", matrikelnummer);
            jsonAntrag.put("statusAntrag", "ZUGELASSEN");

            String backendUrl = "http://localhost:3000/pb/antrag/genehmigen";
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<String> request = new HttpEntity<>(jsonAntrag.toString(), headers);

            RestTemplate restTemplate = new RestTemplate();
            ResponseEntity<String> response = restTemplate.exchange(backendUrl, HttpMethod.POST, request, String.class);

            if (response.getStatusCode().is2xxSuccessful()) {
                Notification.show("Antrag wurde genehmigt.", 3000, Notification.Position.TOP_CENTER);
                // Nach erfolgreicher Genehmigung: liste neu laden
                List<Praktikumsantrag> aktualisierteListe = eingegangeneAntraegePreviewListe();
                aktualisiereAntraegeListeImFrontend(aktualisierteListe);
                grid.getDataProvider().refreshAll();


            } else {
                Notification.show("Fehler beim Genehmigen des Antrags.", 3000, Notification.Position.TOP_CENTER);
            }
        } catch (Exception e) {
            Notification.show("Fehler beim Genehmigen des Antrags: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
        }
    }

    /**
     * Aktualisiert die Liste der Praktikumsanträge im Frontend.
     * @param neueListe Die aktualisierte Liste der Praktikumsanträge, die im Grid angezeigt werden soll.
     */
    private void aktualisiereAntraegeListeImFrontend(List<Praktikumsantrag> neueListe) {
        grid.setItems(neueListe);
    }

    /**
     * Öffnet ein Pop-up-Dialogfeld zur Anzeige eines Posters basierend auf der Matrikelnummer.
     * @param matrikelnummer Die Matrikelnummer der Studentin, dessen Poster angezeigt werden soll.
     */
    private void posterAnzeigenImPopUp(String matrikelnummer) {
        try {
            String url = "http://localhost:3000/api/poster/pdf/" + matrikelnummer;

            Dialog dialog = new Dialog();
            dialog.setWidth("100%");
            dialog.setHeight("100%");

            H3 dialogTitle = new H3("Poster der Studentin " + matrikelnummer);

            // iframe ist tool zur Anzeige von pdfs
            IFrame iframe = new IFrame(url);
            iframe.setWidth("100%");
            iframe.setHeight("500px");

            // Buttons
            Button close = new Button("Schließen", event -> dialog.close());
            close.addClassName("close-button3");
            close.getStyle().set("margin-left", "auto");

            // Layout
            HorizontalLayout buttonLayout = new HorizontalLayout(close);
            buttonLayout.setWidthFull();
            buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.START); //button links ausgerichtet

            VerticalLayout contentLayout = new VerticalLayout(dialogTitle, iframe, buttonLayout);
            contentLayout.setSpacing(true);
            contentLayout.setPadding(true);
            dialog.add(contentLayout);

            dialog.open();
        }
        catch (Exception e) {
            Notification.show("Fehler beim Abrufen der Poster-Daten: " + e.getMessage(), 5000, Notification.Position.MIDDLE);
        }
    }

    private void filterGridByStatus(String status) {
        List<Praktikumsantrag> filteredItems;

        if ("alle anzeigen".equals(status)) {
            // Alle Anträge anzeigen
            filteredItems = antraege;
        } else {
            // Status filtern, inklusive "Antrag offen"
            filteredItems = antraege.stream()
                    .filter(antrag -> {
                        if ("Antrag offen".equals(status)) {
                            return "Antrag eingereicht".equalsIgnoreCase(antrag.getStatus());
                        } else {
                            return antrag.getStatus().equalsIgnoreCase(status);
                        }
                    })
                    .toList();
        }

        grid.setItems(filteredItems);

        if (filteredItems.isEmpty()) {
            Notification.show("Keine Ergebnisse für: " + status, 3000, Notification.Position.MIDDLE);
        }
    }

    /**
     * Erstellt ein Status-Badge zur Visualisierung des aktuellen Status eines Praktikumsantrags.
     * @param status Der Status des Praktikumsantrags, z. B. "Antrag offen", "Abgelehnt", "Zugelassen".
     * @return Ein {@link Span}-Element mit dem entsprechenden Status-Text.
     */
    private Span createStatusBadge(String status) {
        String theme;

        // Status für Frontend anpassen: "offen" bei PB, bei Studentin "eingereicht"
        if ("Antrag eingereicht".equals(status)) {
            status = "Antrag offen";
        }

        switch (status) {
            case "Antrag offen":
                theme = "badge primary pill";
                break;
            case "Abgelehnt":
                theme = "badge error pill";
                break;
            case "Zugelassen":
                theme = "badge success pill";
                break;
            case "Derzeit im Praktikum":
                theme = "badge pill";
                break;
            case "Absolviert":
                theme = "badge light pill";
                break;
            default:
                theme = "badge";
                break;
        }

        Span badge = new Span(status);
        badge.getElement().getThemeList().add(theme);
        return badge;
    }

    /**
     * Erstellt ein Filter-Badge zur Anzeige eines aktiven Statusfilters mit der Möglichkeit, diesen zu entfernen.
     * @param status Der Status, der im Filter-Badge angezeigt werden soll, z. B. "Zugelassen", "Abgelehnt".
     * @return Ein {@link Span}-Element mit dem Filter-Status und einem Schließen-Button zum Entfernen des Filters.
     */
    private Span createFilterBadge(String status) {
        Button clearButton = new Button(VaadinIcon.CLOSE_SMALL.create());
        clearButton.addThemeVariants(ButtonVariant.LUMO_CONTRAST, ButtonVariant.LUMO_TERTIARY_INLINE);
        clearButton.getStyle().set("margin-inline-start", "var(--lumo-space-xs)");

        Span badge = new Span(new Span(status), clearButton);
        badge.getElement().getThemeList().add("badge contrast pill");

        clearButton.addClickListener(event -> {
            badge.getElement().removeFromParent();
            grid.setItems(antraege); // Originaldaten zurücksetzen
        });

        return badge;
    }

    /**
     * Repräsentiert einen Praktikumsantrag mit den grundlegenden Informationen des Antragstellers und dem aktuellen Status des Antrags.
     */
    public static class Praktikumsantrag {
        private String name;
        private String matrikelnummer;
        private String status;

        /**
         * Konstruktor zur Initialisierung eines Praktikumsantrags.
         * @param name Der Name der Antragstellerin
         * @param matrikelnummer  Die Matrikelnummer der Antragstellerin
         * @param status Der Status des Antrags.
         */
        public Praktikumsantrag(String name, String matrikelnummer, String status) {
            this.name = name;
            this.matrikelnummer = matrikelnummer;
            this.status = status;
        }

        public String getName() {
            return name;
        }

        public String getMatrikelnummer() {
            return matrikelnummer;
        }

        public String getStatus() {
            return status;
        }
    }

    /**
     * Repräsentiert ein Praktikumsposter und das Einreichungsdatum des Posters.
     */
    public static class Praktikumsposter{
        private String name;
        private String matrikelnummer;
        private String eingegangenAm;

        /**
         * Konstruktor zur Initialisierung eines Praktikumsposters.
         * @param name Der Name der Erstellerin
         * @param matrikelnummer Die Matrikelnummer der Erstellerin
         * @param eingegangenAm Das Datum der Einreichung des Posters
         */
        public Praktikumsposter(String name, String matrikelnummer, String eingegangenAm) {
            this.name = name;
            this.matrikelnummer = matrikelnummer;
            this.eingegangenAm = eingegangenAm;
        }

        public String getName() {
            return name;
        }

        public String getMatrikelnummer() {
            return matrikelnummer;
        }

        public String getEingegangenAm() {
            return eingegangenAm;
        }
    }

}
