package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.contextmenu.ContextMenu;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.grid.Grid;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.VaadinIcon;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.FlexComponent;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextArea;
import com.vaadin.flow.router.Route;

import java.util.ArrayList;
import java.util.List;

@Route("praktikumsbeauftragter")
public class Praktikumsbeauftragter extends VerticalLayout {

    public Praktikumsbeauftragter() {
        // Überschrift

        H1 title = new H1("Übersicht der Praktikumsanträge");

        // Nachrichten-Glocke
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

        // Logout-Icon
        Button logoutButton = new Button(VaadinIcon.SIGN_OUT.create());
        logoutButton.getElement().getStyle().set("cursor", "pointer");
        logoutButton.addClickListener(event -> {
            // Zeige Bestätigungsdialog an
            Dialog confirmDialog = new Dialog();

            // Nachricht
            Span message = new Span("Möchten Sie sich wirklich ausloggen?");

            // Buttons
            Button yesButton = new Button("Ja", e -> {
                confirmDialog.close();
                getUI().ifPresent(ui -> ui.navigate("login"));
            });

            Button cancelButton = new Button("Abbrechen", e -> confirmDialog.close());

            // Layout für die Buttons
            HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);

            // Dialog hinzufügen
            VerticalLayout dialogLayout = new VerticalLayout(message, buttons);
            confirmDialog.add(dialogLayout);

            confirmDialog.open();
        });

        // Header mit Logout-Icon
        HorizontalLayout header = new HorizontalLayout(title, notificationBell, logoutButton);
        header.setWidthFull();
        header.setJustifyContentMode(FlexComponent.JustifyContentMode.BETWEEN);
        header.setAlignItems(Alignment.CENTER);

        notificationBell.getElement().getStyle().set("margin-left", "auto");

        add(header);

        // Datenmodell für Praktikumsanträge
        List<Praktikumsantrag> antraege = getPraktikumsantraege();

        // Anzeige der Anträge
        Grid<Praktikumsantrag> grid = new Grid<>(Praktikumsantrag.class);
        grid.setItems(antraege);
        grid.setColumns("name", "matrikelnummer", "status");

        // Spalte für Aktionen: Genehmigen und Ablehnen
        grid.addComponentColumn(antrag -> {
            HorizontalLayout actionButtons = new HorizontalLayout();

            // Genehmigen-Button
            Button genehmigenButton = new Button("Genehmigen", event -> {
                // Zeige Bestätigungsdialog an
                Dialog dialog = createConfirmationDialog(antrag, grid, "Genehmigt");
                dialog.open();
            });

            // Ablehnen-Button
            Button ablehnenButton = new Button("Ablehnen", event -> {
                // Zeige Bestätigungsdialog an
                Dialog dialog = createRejectionDialog(antrag, grid);
                dialog.open();
            });

            actionButtons.add(genehmigenButton, ablehnenButton);
            return actionButtons;
        }).setHeader("Aktionen");

        add(grid);
    }

    private List<String> getNachrichten() {
        List<String> nachrichten = new ArrayList<>();
        return nachrichten;
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

    // Erstellung eines Genehmigungsdialogs
    private Dialog createConfirmationDialog(Praktikumsantrag antrag, Grid<Praktikumsantrag> grid, String status) {
        Dialog dialog = new Dialog();

        // Nachricht
        Span message = new Span("Möchten Sie den Antrag von " + antrag.getName() + " wirklich " + status.toLowerCase() + "?");

        // Buttons
        Button yesButton = new Button("Ja", event -> {
            antrag.setStatus(status);
            grid.getDataProvider().refreshItem(antrag);
            dialog.close();
            Notification.show("Antrag " + status.toLowerCase() + ".", 3000, Notification.Position.TOP_CENTER);
        });

        Button cancelButton = new Button("Abbrechen", event -> dialog.close());

        // Layout für die Buttons
        HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);

        // Dialog hinzufügen
        VerticalLayout dialogLayout = new VerticalLayout(message, buttons);
        dialog.add(dialogLayout);

        return dialog;
    }

    // Erstellung eines Ablehnungsdialogs
    private Dialog createRejectionDialog(Praktikumsantrag antrag, Grid<Praktikumsantrag> grid) {
        Dialog dialog = new Dialog();

        // Nachricht
        Span message = new Span("Möchten Sie den Antrag von " + antrag.getName() + " wirklich ablehnen?");

        // Notizfeld
        TextArea reasonField = new TextArea("Begründung");
        reasonField.setPlaceholder("Geben Sie hier die Begründung ein...");
        reasonField.setWidthFull();

        // Buttons
        Button yesButton = new Button("Ja", event -> {
            if (reasonField.getValue().trim().isEmpty()) {
                Notification.show("Bitte geben Sie eine Begründung ein!", 3000, Notification.Position.MIDDLE);
            } else {
                antrag.setStatus("Abgelehnt");
                grid.getDataProvider().refreshItem(antrag);
                dialog.close();
                Notification.show("Antrag abgelehnt. Begründung: " + reasonField.getValue(), 3000, Notification.Position.TOP_CENTER);
            }
        });

        Button cancelButton = new Button("Abbrechen", event -> dialog.close());

        // Layout für die Buttons
        HorizontalLayout buttons = new HorizontalLayout(yesButton, cancelButton);

        // Dialog hinzufügen
        VerticalLayout dialogLayout = new VerticalLayout(message, reasonField, buttons);
        dialog.add(dialogLayout);

        return dialog;
    }
}
