package com.example.application.views.login;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
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

        // Container für das Formular
        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        // Titel
        H1 title = new H1("Login");
        title.addClassName("form-title");

        // Nutzername-Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzername");
        usernameField.addClassName("text-field");

        // Passwort-Feld
        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        // Rolle auswählen
        ComboBox<String> roleSelection = new ComboBox<>("Rolle auswählen");
        roleSelection.setItems("Admin", "Student");
        roleSelection.setPlaceholder("Wähle eine Rolle");
        roleSelection.addClassName("role-selection");


        Button loginButton = getButton(usernameField, passwordField, roleSelection);

        // Link "Passwort vergessen?"
        Anchor forgotPasswordLink = new Anchor("passwort-vergessen", "Passwort vergessen?");
        forgotPasswordLink.addClassName("link");

        // Elemente hinzufügen
        formContainer.add(title, usernameField, passwordField, roleSelection, loginButton, forgotPasswordLink);
        add(formContainer);
    }

    private Button getButton(TextField usernameField, PasswordField passwordField, ComboBox<String> roleSelection) {
        Button loginButton = new Button("Login");
        loginButton.addClassName("button");

        // Login-Logik
        loginButton.addClickListener(event -> {
            boolean isValid = true;

            // Validierung des Nutzernamens
            if (!usernameField.getValue().matches("s0\\d{6}")) {
                Notification.show("Ungültiger Nutzername. Format: s0XXXXXX.", 3000, Notification.Position.MIDDLE);
                isValid = false;
            }

            // Validierung des Passworts
            if (!passwordField.getValue().equals("richtigePasswort123")) { // Beispielpasswort
                Notification.show("Falsches Passwort. Bitte erneut versuchen.", 3000, Notification.Position.MIDDLE);
                isValid = false;
            }

            // Validierung der Rolle
            if (roleSelection.isEmpty()) {
                Notification.show("Bitte Rolle auswählen!", 3000, Notification.Position.MIDDLE);
                isValid = false;
            }

            // Weiterleitung nach erfolgreicher Validierung
            if (isValid) {
                if ("Admin".equals(roleSelection.getValue())) {
                    getUI().ifPresent(ui -> ui.navigate("admin/startseite"));
                } else if ("Student".equals(roleSelection.getValue())) {
                    getUI().ifPresent(ui -> ui.navigate("student/startseite"));
                }
            }
        });
        return loginButton;
    }
}
