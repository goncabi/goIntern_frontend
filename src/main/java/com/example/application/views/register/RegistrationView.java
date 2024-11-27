package com.example.application.views.register;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.dependency.CssImport;

import java.util.ArrayList;
import java.util.List;

@Route("register")
@CssImport("./styles/styles.css")
public class RegistrationView extends VerticalLayout {

    public RegistrationView() {
        addClassName("view-container");

        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        H1 title = new H1("Registrieren");
        title.addClassName("form-title");

        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzername");
        usernameField.addClassName("text-field");

        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        PasswordField confirmPasswordField = new PasswordField();
        confirmPasswordField.setPlaceholder("Passwort bestätigen");
        confirmPasswordField.addClassName("text-field");

        // Div für die Fehlermeldungen
        Div errorContainer = new Div();
        errorContainer.addClassName("error-container");

        // Sicherheitsfragen Überschrift
        H3 securityQuestionsTitle = new H3("Sicherheitsfragen:");
        securityQuestionsTitle.addClassName("form-title");

        // Sicherheitsfragen mit nur den Nummern 1, 2 und 3
        TextField question1Field = new TextField("1. Was ist dein Lieblingsbuch?");
        question1Field.addClassName("text-field");

        TextField question2Field = new TextField("2. Wie lautet der Name deines ersten Haustiers?");
        question2Field.addClassName("text-field");

        TextField question3Field = new TextField("3. In welcher Stadt wurdest du geboren?");
        question3Field.addClassName("text-field");

        Button registerButton = new Button("Registrieren");
        registerButton.addClassName("button");

        // Logik für den Registrieren-Button
        registerButton.addClickListener(event -> {
            String password = passwordField.getValue();
            List<String> errors = validatePassword(password);

            if (!errors.isEmpty()) {
                // Lösche vorherige Fehler und zeige neue an
                errorContainer.removeAll();
                passwordField.addClassName("invalid-field");
                for (String error : errors) {
                    Div errorMessage = new Div();
                    errorMessage.setText(error);
                    errorMessage.addClassName("error-message");
                    errorContainer.add(errorMessage);
                }
            } else {
                // Passwort ist gültig, Registrierung fortsetzen
                passwordField.removeClassName("invalid-field");
                errorContainer.removeAll(); // Löscht alte Fehlermeldungen
                Notification.show("Registrierung erfolgreich!", 3000, Notification.Position.MIDDLE);
            }
        });

        // Hinzufügen aller Komponenten zum Formular
        formContainer.add(
                title,
                usernameField,
                passwordField,
                errorContainer, // Fehlercontainer unter dem Passwortfeld
                confirmPasswordField,
                securityQuestionsTitle,
                question1Field,
                question2Field,
                question3Field,
                registerButton
        );

        add(formContainer);
    }

    // Methode zur Validierung des Passworts
    private List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();

        if (!password.matches(".*[A-Z].*")) {
            errors.add("Mindestens ein Großbuchstabe erforderlich. (A-Z)");
        }
        if (!password.matches(".*\\d.*")) {
            errors.add("Mindestens eine Zahl erforderlich. (0-9)");
        }
        if (!password.matches(".*[!?§/'@#$%^&*()].*")) {
            errors.add("Mindestens ein Sonderzeichen erforderlich.(!?§/'@#$%^&*())");
        }
        if (password.length() < 8) {
            errors.add("Mindestens 8 Zeichen erforderlich.");
        }

        return errors;
    }
}
