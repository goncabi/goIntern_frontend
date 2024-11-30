package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

@Route("Praktikumsbeauftragter")
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
                antrag.setStatus("Genehmigt");
                grid.getDataProvider().refreshItem(antrag);
                // Optional: Logik zum Speichern des Status
            });
            return genehmigenButton;
        }).setHeader("Aktionen");

        add(grid);
    }

    // Liste der Praktikumsanträge sind nur Beispiele
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
}
