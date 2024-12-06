package com.example.application.views;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.UI;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Route("praktikumsbeauftragter")
public class Praktikumsbeauftragter extends VerticalLayout {

    public Praktikumsbeauftragter() {
        // Überschrift hinzufügen
        add(new H1("Übersicht der Praktikumsanträge"));

        // Liste der Praktikumsanträge mit Mockup-Daten
        List<Praktikumsantrag> antraege = loadMockupData();

        // Grid für die Anzeige der Anträge
        Grid<Praktikumsantrag> grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für den "Antrag einsehen"-Button
        grid.addComponentColumn(antrag -> {
            Button einsehenButton = new Button("Antrag einsehen", event -> {
                // Navigiere zum Praktikumsformular und übergebe die Matrikelnummer
                UI.getCurrent().navigate(Praktikumsformular.class, antrag.getMatrikelnummer());
            });
            return einsehenButton;
        }).setHeader("Aktionen");

        add(grid);
    }

    // Mockup-Daten aus einer JSON-Datei laden
    private List<Praktikumsantrag> loadMockupData() {
        ObjectMapper mapper = new ObjectMapper();
        try (InputStream is = getClass().getResourceAsStream("/mockup-data.json")) {
            return mapper.readValue(is, new TypeReference<List<Praktikumsantrag>>() {});
        } catch (Exception e) {
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    // Datenmodell für Praktikumsanträge
    public static class Praktikumsantrag {
        private String name;
        private String matrikelnummer;
        private String status;
        private String firma;
        private String email;
        private String betreuer;
        private String praktikumVon;
        private String praktikumBis;

        public Praktikumsantrag() {}

        public Praktikumsantrag(String name, String matrikelnummer, String status, String firma, String email, String betreuer, String praktikumVon, String praktikumBis) {
            this.name = name;
            this.matrikelnummer = matrikelnummer;
            this.status = status;
            this.firma = firma;
            this.email = email;
            this.betreuer = betreuer;
            this.praktikumVon = praktikumVon;
            this.praktikumBis = praktikumBis;
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

        public String getFirma() {
            return firma;
        }

        public void setFirma(String firma) {
            this.firma = firma;
        }

        public String getEmail() {
            return email;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public String getBetreuer() {
            return betreuer;
        }

        public void setBetreuer(String betreuer) {
            this.betreuer = betreuer;
        }

        public String getPraktikumVon() {
            return praktikumVon;
        }

        public void setPraktikumVon(String praktikumVon) {
            this.praktikumVon = praktikumVon;
        }

        public String getPraktikumBis() {
            return praktikumBis;
        }

        public void setPraktikumBis(String praktikumBis) {
            this.praktikumBis = praktikumBis;
        }
    }
}
