package com.example.application.views;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Paragraph;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.router.BeforeEvent;
import com.vaadin.flow.router.HasUrlParameter;
import com.vaadin.flow.router.Route;

import java.io.InputStream;
import java.util.List;

@Route("praktikumsformular")
public class Praktikumsformular extends Div implements HasUrlParameter<String> {

    @Override
    public void setParameter(BeforeEvent event, String matrikelnummer) {
        // Lade die Details des Antrags basierend auf der Matrikelnummer
        Praktikumsbeauftragter.Praktikumsantrag antrag = getAntragByMatrikelnummer(matrikelnummer);
        if (antrag != null) {
            // Fülle die Formularfelder mit den Daten
            populateForm(antrag);
        } else {
            add(new H1("Antrag nicht gefunden"));
        }
    }

    public Praktikumsformular() {
        add(new H1("Praktikumsformular"));
    }

    private Praktikumsbeauftragter.Praktikumsantrag getAntragByMatrikelnummer(String matrikelnummer) {
        ObjectMapper mapper = new ObjectMapper();
        try (InputStream is = getClass().getResourceAsStream("/mockup-data.json")) {
            List<Praktikumsbeauftragter.Praktikumsantrag> antraege = mapper.readValue(is, new TypeReference<List<Praktikumsbeauftragter.Praktikumsantrag>>() {});
            return antraege.stream()
                    .filter(a -> a.getMatrikelnummer().equals(matrikelnummer))
                    .findFirst()
                    .orElse(null);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private void populateForm(Praktikumsbeauftragter.Praktikumsantrag antrag) {
        add(new Paragraph("Name: " + antrag.getName()));
        add(new Paragraph("Matrikelnummer: " + antrag.getMatrikelnummer()));
        add(new Paragraph("Status: " + antrag.getStatus()));
        add(new Paragraph("Firma: " + antrag.getFirma()));
        add(new Paragraph("Betreuer: " + antrag.getBetreuer()));
        add(new Paragraph("Praktikum von: " + antrag.getPraktikumVon()));
        add(new Paragraph("Praktikum bis: " + antrag.getPraktikumBis()));

        // Buttons für Genehmigen/Ablehnen
        Button genehmigenButton = new Button("Genehmigen", e -> {
            antrag.setStatus("Genehmigt");
            Notification.show("Antrag genehmigt");
            getUI().ifPresent(ui -> ui.navigate("praktikumsbeauftragter"));
        });

        Button ablehnenButton = new Button("Ablehnen", e -> {
            antrag.setStatus("Abgelehnt");
            Notification.show("Antrag abgelehnt");
            getUI().ifPresent(ui -> ui.navigate("praktikumsbeauftragter"));
        });

        add(new HorizontalLayout(genehmigenButton, ablehnenButton));
    }
}
