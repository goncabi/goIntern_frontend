package com.example.application.views.login;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.html.Anchor;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route("login")
@CssImport("./styles/styles.css")
public class LoginView extends VerticalLayout {

    public LoginView() {
        addClassName("view-container");

        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        H1 title = new H1("Login");
        title.addClassName("form-title");

        // Nutzername Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzername");
        usernameField.addClassName("text-field");

        // Fehlernachricht für Nutzername
        Div usernameError = new Div();
        usernameError.setText("Falscher Nutzername. Bitte im Format s0XXXXXX eingeben.");
        usernameError.addClassName("error-message");
        usernameError.setVisible(false);

        // Passwort Feld
        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        // Fehlernachricht für Passwort
        Div passwordError = new Div();
        passwordError.setText("Falsches Passwort. Bitte versuchen Sie es erneut.");
        passwordError.addClassName("error-message");
        passwordError.setVisible(false);

        // Login-Button
        Button loginButton = new Button("Login");
        loginButton.addClassName("button");

        // Logik für den Login-Button
        loginButton.addClickListener(event -> {
            boolean isValid = true;

            // Validierung des Nutzernamens (muss im Format s0XXXXXX sein)
            if (!usernameField.getValue().matches("s0\\d{6}")) {
                usernameError.setVisible(true);
                usernameField.addClassName("invalid-field");
                isValid = false;
            } else {
                usernameError.setVisible(false);
                usernameField.removeClassName("invalid-field");
            }

            // Simulierte Passwort-Validierung (immer falsch)
            if (!passwordField.getValue().equals("richtigePasswort123")) { // Beispiel für ein korrektes Passwort
                passwordError.setVisible(true);
                passwordField.addClassName("invalid-field");
                isValid = false;
            } else {
                passwordError.setVisible(false);
                passwordField.removeClassName("invalid-field");
            }

            // Erfolgsmeldung (nur bei validen Eingaben)
            if (isValid) {
                Notification.show("Login erfolgreich!", 3000, Notification.Position.MIDDLE);
            }
        });

        // "Passwort vergessen?" Link hinzufügen
        Anchor forgotPasswordLink = new Anchor("passwort-vergessen", "Passwort vergessen?");
        forgotPasswordLink.addClassName("link");

        // Hinzufügen der Elemente zum Formularcontainer
        formContainer.add(title, usernameField, usernameError, passwordField, passwordError, loginButton, forgotPasswordLink);
        add(formContainer);
    }
}
