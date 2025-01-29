package com.example.application.utils;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.orderedlayout.FlexComponent;

/**
 * Die Klasse DialogUtils beinhaltet eine Methode zum Erstellen eines standardisierten Dialogs.
 * Der Dialog enthält einen Titel, eine Nachricht, optional einen Hinweistext sowie zwei Buttons
 * zum Abbrechen und Bestätigen. Die Buttons sind in einer horizontalen Layout-Anordnung angeordnet,
 * wobei der Abbrechen-Button immer links und der Bestätigen-Button rechts positioniert ist.
 */
public class DialogUtils {

    /**
     * Erstellt einen standardisierten Dialog mit einem Titel, einer Nachricht, einem optionalen Hinweistext
     * sowie zwei Buttons für die Aktionen "Bestätigen" und "Abbrechen".
     *
     * @param headerText Der Titeltext des Dialogs.
     * @param hintText Der optionale Hinweistext, der unterhalb der Nachricht angezeigt wird.
     * @param messageText Der Nachrichtentext, der im Dialog angezeigt wird.
     * @param confirmButtonText Der Text des Bestätigungsbuttons "Ja".
     * @param cancelButtonText Der Text des Abbrechen-Buttons.
     * @param confirmAction Die Aktion, die beim Klicken auf den Bestätigungsbutton ausgeführt wird.
     * @return Ein Dialog, der die angezeigten Texte und die definierten Aktionen enthält.
     */
    public static Dialog createStandardDialog(
            String headerText,
            String hintText,
            String messageText,
            String confirmButtonText,
            String cancelButtonText,
            Runnable confirmAction
    ) {
        Dialog dialog = new Dialog();

        // Header und Nachricht
        Span header = new Span(headerText);
        header.getStyle().set("font-size", "20px").set("font-weight", "bold").set("margin-bottom", "15px");
        Span message = new Span(messageText);
        message.getStyle().set("font-size", "16px").set("text-align", "center").set("margin-bottom", "15px");

        // Hinweis (optional)
        Span hint = null;
        if (hintText != null && !hintText.isEmpty()) {
            hint = new Span(hintText);
            hint.getStyle().set("color", "gray").set("font-size", "14px").set("margin-top", "10px").set("margin-bottom", "15px");
        }

        // Buttons und Anordnung der Button (Abbrechne immer links)
        Button cancelButton = new Button(cancelButtonText, e -> dialog.close());
        cancelButton.getStyle()
                .set("background-color", "#E74C3C")
                .set("color", "#FFFFFF")
                .set("box-shadow",  "0px 2px 4px rgba(0, 0, 0, 0.1)")
                .set("border", "none")
                .set("border-radius", "15px")
                .set("cursor", "pointer")
                .set("transition", "all 0.3s ease");

        cancelButton.getElement().executeJs(
                "this.addEventListener('mouseover', function() {" +
                        "  this.style.backgroundColor = '#C0392B';" +
                        "  this.style.boxShadow = '0px 4px 6px rgba(0, 0, 0, 0.2)';" +
                        "});" +
                        "this.addEventListener('mouseout', function() {" +
                        "  this.style.backgroundColor = '#E74C3C';" +
                        "  this.style.boxShadow = '0px 2px 4px rgba(0, 0, 0, 0.1)';" +
                        "});"
        );

        Button confirmButton = new Button(confirmButtonText, e -> {
            confirmAction.run();
            dialog.close();
        });
        confirmButton.getStyle()
                .set("background-color", "#FFFFFF")
                .set("color", "#2F5A83")
                .set("box-shadow",  "0px 2px 4px rgba(0, 0, 0, 0.1)")
                .set("border", "none")
                .set("border-radius", "15px")
                .set("cursor", "pointer")
                .set("transition", "all 0.3s ease");


        HorizontalLayout buttonLayout = new HorizontalLayout(cancelButton, confirmButton);
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);
        buttonLayout.getStyle().set("gap", "30px");

        // Dialog-Layout
        VerticalLayout popupLayout = new VerticalLayout(header, message);
        if (hint != null) { // Nur hinzufügen, wenn ein Hinweis vorhanden ist
            popupLayout.add(hint);
        }
        popupLayout.add(buttonLayout);
        popupLayout.setPadding(true);
        popupLayout.setSpacing(false);
        popupLayout.setAlignItems(FlexComponent.Alignment.CENTER);

        dialog.add(popupLayout);
        dialog.setResizable(true);
        dialog.setModal(true);

        return dialog;
    }

}
