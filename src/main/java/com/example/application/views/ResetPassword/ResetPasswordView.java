package com.example.application.views.ResetPassword;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.dependency.CssImport;

@Route("passwort-vergessen")
@CssImport("./styles/styles.css")
public class ResetPasswordView extends VerticalLayout {

    public ResetPasswordView() {
        addClassName("view-container");

        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        // Überschrift
        H1 title = new H1("Passwort zurücksetzen");
        title.addClassName("form-title");

        // Dropdown für Sicherheitsfragen
        ComboBox<String> securityQuestionDropdown = new ComboBox<>("Wähle eine Sicherheitsfrage");
        securityQuestionDropdown.setItems(
                "Wie lautet dein Geburtsort?",
                "Was war dein erstes Haustier?",
                "Wie lautet der Name deiner Grundschule?"
        );
        securityQuestionDropdown.addClassName("text-field");

        // Antwortfeld für die Sicherheitsfrage
        TextField securityAnswerField = new TextField();
        securityAnswerField.setPlaceholder("Antwort");
        securityAnswerField.setVisible(false); // Standardmäßig unsichtbar
        securityAnswerField.addClassName("text-field");

        // Passwortfelder
        PasswordField newPasswordField = new PasswordField("Neues Passwort");
        newPasswordField.addClassName("text-field");
        newPasswordField.setVisible(false); // Wird nur bei korrekter Antwort sichtbar

        PasswordField confirmNewPasswordField = new PasswordField("Neues Passwort bestätigen");
        confirmNewPasswordField.addClassName("text-field");
        confirmNewPasswordField.setVisible(false); // Wird nur bei korrekter Antwort sichtbar

        // Dropdown-Logik: Antwortfeld anzeigen
        securityQuestionDropdown.addValueChangeListener(event -> {
            if (event.getValue() != null && !event.getValue().isEmpty()) {
                securityAnswerField.setVisible(true);
                securityAnswerField.removeClassName("correct");
                securityAnswerField.removeClassName("incorrect");
                securityAnswerField.setValue(""); // Eingabe zurücksetzen
            } else {
                securityAnswerField.setVisible(false);
                newPasswordField.setVisible(false);
                confirmNewPasswordField.setVisible(false);
            }
        });

        // Validierungsantworten
        String correctAnswer1 = "Berlin";
        String correctAnswer2 = "Hund";
        String correctAnswer3 = "Grundschule";

        // Validierungslogik für die Antwort
        securityAnswerField.addValueChangeListener(event -> {
            String selectedQuestion = securityQuestionDropdown.getValue();
            String userAnswer = securityAnswerField.getValue().trim();

            boolean isCorrect = false;
            if ("Wie lautet dein Geburtsort?".equals(selectedQuestion)) {
                isCorrect = correctAnswer1.equalsIgnoreCase(userAnswer);
            } else if ("Was war dein erstes Haustier?".equals(selectedQuestion)) {
                isCorrect = correctAnswer2.equalsIgnoreCase(userAnswer);
            } else if ("Wie lautet der Name deiner Grundschule?".equals(selectedQuestion)) {
                isCorrect = correctAnswer3.equalsIgnoreCase(userAnswer);
            }

            if (isCorrect) {
                securityAnswerField.removeClassName("incorrect");
                securityAnswerField.addClassName("correct");
                newPasswordField.setVisible(true);
                confirmNewPasswordField.setVisible(true);
            } else {
                securityAnswerField.removeClassName("correct");
                securityAnswerField.addClassName("incorrect");
                newPasswordField.setVisible(false);
                confirmNewPasswordField.setVisible(false);
            }
        });

        // Zurücksetzen-Button
        Button resetButton = getButton(newPasswordField, confirmNewPasswordField);

        // Hinzufügen der Komponenten zur Ansicht
        formContainer.add(
                title,
                securityQuestionDropdown,
                securityAnswerField,
                newPasswordField,
                confirmNewPasswordField,
                resetButton
        );
        add(formContainer);
    }

    private static Button getButton(PasswordField newPasswordField, PasswordField confirmNewPasswordField) {
        Button resetButton = new Button("Passwort zurücksetzen");
        resetButton.addClassName("button");

        resetButton.addClickListener(event -> {
            String password = newPasswordField.getValue();
            String confirmPassword = confirmNewPasswordField.getValue();
            if (password.isEmpty() || confirmPassword.isEmpty()) {
                Notification.show("Bitte alle Felder ausfüllen!");
            } else if (!password.equals(confirmPassword)) {
                Notification.show("Passwörter stimmen nicht überein!");
            } else {
                Notification.show("Passwort erfolgreich zurückgesetzt!");
            }
        });
        return resetButton;
    }
}
