package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

@Route("praktikumsbeauftragter")
public class Praktikumsbeauftragter extends VerticalLayout {

    private final List<Praktikumsantrag> antraege = getPraktikumsantraege(); // Datenmodell

    public Praktikumsbeauftragter() {
        // Überschrift
        H1 title = new H1("Übersicht der Praktikumsanträge");
        add(title);

        // Grid zur Anzeige der Anträge
        Grid<Praktikumsantrag> grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für "Antrag einsehen"
        grid.addComponentColumn(antrag -> {
            Button einsehenButton = new Button("Antrag einsehen", VaadinIcon.EYE.create());
            einsehenButton.addClickListener(event -> {
                // Dialog mit dem bestehenden Praktikumsformular öffnen
                Dialog dialog = createPraktikumsformularDialog(antrag, grid);
                dialog.open();
            });
            return einsehenButton;
        }).setHeader("Aktionen");

        add(grid);
    }

    private List<Praktikumsantrag> getPraktikumsantraege() {
        List<Praktikumsantrag> antraege = new ArrayList<>();
        antraege.add(new Praktikumsantrag("Max Mustermann", "123456", "Offen"));
        antraege.add(new Praktikumsantrag("Lisa Müller", "654321", "Offen"));
        return antraege;
    }

    private Dialog createPraktikumsformularDialog(Praktikumsantrag antrag, Grid<Praktikumsantrag> grid) {
        Dialog dialog = new Dialog();

        // Titel des Dialogs
        VerticalLayout dialogLayout = new VerticalLayout();
        dialogLayout.add(new H1("Praktikumsformular einsehen"));

        // Praktikumsformular
        Praktikumsformular praktikumFormular = new Praktikumsformular();


        // Buttons unten im Dialog
        Button genehmigenButton = new Button("Genehmigen", event -> {
            antrag.setStatus("Genehmigt");
            grid.getDataProvider().refreshAll(); // Aktualisiert das Grid
            dialog.close();
            Notification.show("Antrag genehmigt.", 3000, Notification.Position.TOP_CENTER);
        });

        Button ablehnenButton = new Button("Ablehnen", event -> {
            // Dialog für Ablehnung mit Notizfeld
            Dialog ablehnenDialog = createAblehnenDialog(antrag, grid);
            ablehnenDialog.open();
        });

        HorizontalLayout actionButtons = new HorizontalLayout(genehmigenButton, ablehnenButton);
        dialogLayout.add(praktikumFormular, actionButtons);

        dialog.add(dialogLayout);
        return dialog;
    }

    private Dialog createAblehnenDialog(Praktikumsantrag antrag, Grid<Praktikumsantrag> grid) {
        Dialog ablehnenDialog = new Dialog();

        // Notizfeld hinzufügen
        TextArea notizField = new TextArea("Kommentar");
        notizField.setPlaceholder("Geben Sie den Grund für die Ablehnung ein...");

        // Buttons für Ablehnung bestätigen oder Abbrechen
        Button confirmButton = new Button("Ablehnen", event -> {
            String notiz = notizField.getValue();
            if (notiz.trim().isEmpty()) {
                Notification.show("Bitte einen Kommentar eingeben.", 3000, Notification.Position.MIDDLE);
            } else {
                antrag.setStatus("Abgelehnt");
                grid.getDataProvider().refreshAll(); // Aktualisiert das Grid
                ablehnenDialog.close();
                Notification.show("Antrag abgelehnt. Kommentar: " + notiz, 3000, Notification.Position.TOP_CENTER);
            }
        });

        Button cancelButton = new Button("Abbrechen", event -> ablehnenDialog.close());

        // Layout für den Dialog
        VerticalLayout dialogLayout = new VerticalLayout(notizField, new HorizontalLayout(confirmButton, cancelButton));
        ablehnenDialog.add(dialogLayout);

        return ablehnenDialog;
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
}
