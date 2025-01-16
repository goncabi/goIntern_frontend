package com.example.application.utils;

import com.vaadin.flow.component.Component;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.orderedlayout.FlexComponent;

public class DialogUtils {

    public static Dialog createStandardDialog(
            String headerText,
            String hintText,          // Optionaler Hinweis (kann null sein)
            String messageText,
            String confirmButtonText,
            String cancelButtonText,
            Runnable confirmAction
    ) {
        Dialog dialog = new Dialog();

        // Header und Nachricht
        Span header = new Span(headerText);
        header.getStyle().set("font-size", "20px").set("font-weight", "bold");
        Span message = new Span(messageText);
        message.getStyle().set("font-size", "16px").set("text-align", "center");

        // Hinweis (optional)
        Span hint = null;
        if (hintText != null && !hintText.isEmpty()) {
            hint = new Span(hintText);
            hint.getStyle().set("color", "gray").set("font-size", "14px").set("margin-top", "10px");
        }

        // Buttons und Anordnung der Button (Abbrechne immer links)
        Button cancelButton = new Button(cancelButtonText, e -> dialog.close());
        cancelButton.getStyle()
                .set("background-color", "#FFFFFF")
                .set("color", "#E74C3C")
                .set("box-shadow",  "0px 2px 4px rgba(0, 0, 0, 0.1)")
                .set("border", "none")
                .set("border-radius", "15px")
                .set("cursor", "pointer")
                .set("transition", "all 0.3s ease");

        cancelButton.getElement().getStyle().set("hover", "background-color: #F9F9F9; color: #C0392B");


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

        confirmButton.getElement().getStyle().set("hover", "background-color: #F9F9F9; color: #8DC63F");


        HorizontalLayout buttonLayout = new HorizontalLayout(cancelButton, confirmButton);
        buttonLayout.setWidthFull();
        buttonLayout.setJustifyContentMode(FlexComponent.JustifyContentMode.CENTER);

        // Dialog-Layout
        VerticalLayout popupLayout = new VerticalLayout(header, message);
        if (hint != null) { // Nur hinzufügen, wenn ein Hinweis vorhanden ist
            popupLayout.add(hint);
        }
        popupLayout.add(buttonLayout);
        popupLayout.setPadding(true);
        popupLayout.setSpacing(true);
        popupLayout.setAlignItems(FlexComponent.Alignment.CENTER);

        dialog.add(popupLayout);
        dialog.setResizable(true);
        dialog.setModal(true);

        return dialog;
    }

}
