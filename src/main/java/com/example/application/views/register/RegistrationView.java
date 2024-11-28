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

@Route("register")
@CssImport("./styles/styles.css")
public class RegistrationView extends VerticalLayout {

    public RegistrationView() {
        // Hauptcontainer mit einer zentrierten Ansicht
        addClassName("scrollable-view");

        // Formularcontainer
        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        // Überschrift
        H1 title = new H1("Registrieren");
        title.addClassName("form-title");

        // Nutzername Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzername");
        usernameField.addClassName("text-field");

        // Fehlernachricht für Nutzername
        Div usernameError = new Div();
        usernameError.setText("Nutzername muss im Format s0XXXXXX sein.");
        usernameError.addClassName("error-message");
        usernameError.setVisible(false); // Standardmäßig unsichtbar

        // Passwort Feld
        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        // Fehlercontainer für Passwort
        Div passwordErrors = new Div();
        passwordErrors.addClassName("error-container");
        passwordErrors.setVisible(false); // Standardmäßig unsichtbar

        // Passwort bestätigen Feld
        PasswordField confirmPasswordField = new PasswordField();
        confirmPasswordField.setPlaceholder("Passwort bestätigen");
        confirmPasswordField.addClassName("text-field");

        // Sicherheitsfragen Titel
        H3 securityQuestionsTitle = new H3("Sicherheitsfragen:");
        securityQuestionsTitle.addClassName("form-title");


        // Sicherheitsfragen Felder
        TextField question1Field = new TextField("1. Was ist dein Lieblingsbuch?");
        question1Field.addClassName("text-field");

        TextField question2Field = new TextField("2. Wie lautet der Name deines ersten Haustiers?");
        question2Field.addClassName("text-field");

        TextField question3Field = new TextField("3. In welcher Stadt wurdest du geboren?");
        question3Field.addClassName("text-field");

        // Registrieren-Button
        Button registerButton = new Button("Registrieren");
        registerButton.addClassName("button");

        // Logik für den Registrieren-Button
        registerButton.addClickListener(event -> {
            boolean isValid = true;

            // Nutzername Validierung
            if (!usernameField.getValue().matches("s0\\d{6}")) {
                usernameError.setVisible(true);
                usernameField.addClassName("invalid-field");
                isValid = false;
            } else {
                usernameError.setVisible(false);
                usernameField.removeClassName("invalid-field");
            }

            // Passwort Validierung
            // Passwort Validierung
            passwordErrors.removeAll(); // Alle vorherigen Fehler entfernen
            if (!passwordField.getValue().matches("(?=.*[A-Z])(?=.*\\d)(?=.*[!?§/'@#$%^&*()]).{8,}")) {
                Div error1 = new Div();
                error1.setText("Mindestens ein Großbuchstabe erforderlich. (A-Z)");
                error1.addClassName("error-message"); // Gleicher Stil wie beim Nutzernamen

                Div error2 = new Div();
                error2.setText("Mindestens eine Zahl erforderlich. (0-9)");
                error2.addClassName("error-message");

                Div error3 = new Div();
                error3.setText("Mindestens ein Sonderzeichen erforderlich. (!?§/'@#$%^&*())");
                error3.addClassName("error-message");

                Div error4 = new Div();
                error4.setText("Mindestens 8 Zeichen erforderlich.");
                error4.addClassName("error-message");

                passwordErrors.add(error1, error2, error3, error4);
                passwordErrors.setVisible(true);
                passwordField.addClassName("invalid-field");
                isValid = false;
            } else {
                passwordErrors.setVisible(false);
                passwordField.removeClassName("invalid-field");
            }


            // Registrierungserfolg
            if (isValid) {
                Notification.show("Registrierung erfolgreich!", 3000, Notification.Position.MIDDLE);
            }
        });

        // Formular-Layout
        formContainer.add(title, usernameField, usernameError, passwordField, passwordErrors,
                confirmPasswordField, securityQuestionsTitle, question1Field, question2Field, question3Field, registerButton);

        add(formContainer);
    }
}
