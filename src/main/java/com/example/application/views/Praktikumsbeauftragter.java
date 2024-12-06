package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

@Route("praktikumsbeauftragter")
public class Praktikumsbeauftragter extends VerticalLayout {

    public Praktikumsbeauftragter() {
        // Überschrift
        add(new com.vaadin.flow.component.html.H1("Übersicht der Praktikumsanträge"));

        // Datenmodell für Praktikumsanträge
        List<Praktikumsantrag> antraege = getPraktikumsantraege();

        // Anzeige der Anträge
        Grid<Praktikumsantrag> grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für den "Genehmigen"-Button
        grid.addComponentColumn(antrag -> {
            Button genehmigenButton = new Button("Genehmigen", event -> {
                // Zeige Bestätigungsdialog an
                Dialog dialog = createConfirmationDialog(antrag, grid);
                dialog.open();
            });
            return genehmigenButton;
        }).setHeader("Aktionen");

        add(grid);
    }

    // Liste der Praktikumsanträge mit Beispielen
    private List<Praktikumsantrag> getPraktikumsantraege() {
        List<Praktikumsantrag> antraege = new ArrayList<>();
        antraege.add(new Praktikumsantrag("Max Mustermann", "123456", "Offen"));
        antraege.add(new Praktikumsantrag("Lisa Müller", "654321", "Offen"));
        return antraege;
    }

    // Datenmodell
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

    // Erstellung eins Bestätigungsdialogs
    private Dialog createConfirmationDialog(Praktikumsantrag antrag, Grid<Praktikumsantrag> grid) {
        Dialog dialog = new Dialog();

        // Frage
        Span message = new Span("Möchten Sie den Antrag von " + antrag.getName() + " wirklich genehmigen?");

        // Buttons
        Button yesButton = new Button("Ja", event -> {
            antrag.setStatus("Genehmigt");
            grid.getDataProvider().refreshItem(antrag);
            dialog.close();
        });

        Button cancelButton = new Button("Abbrechen", event -> dialog.close());

        // Layout für die Buttons
        HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);


        VerticalLayout dialogLayout = new VerticalLayout(message, buttons);
        dialog.add(dialogLayout);

        return dialog;
    }
}

