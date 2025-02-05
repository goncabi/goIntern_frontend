package com.example.application.views.login;

import com.example.application.views.banner.MainBanner;
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
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * LoginView ist die Benutzeroberfläche für den Login-Prozess.
 * <p>
 * Diese Klasse stellt ein Login-Formular bereit, in dem Benutzer ihre Anmeldedaten eingeben können.
 * Abhängig von der gewählten Rolle ("Student*in" oder "Praktikumsbeauftragte*r")
 * werden die Anmeldedaten überprüft und der Benutzer weitergeleitet.
 * </p>
 *
 * <ul>
 *   <li>Verwendet Vaadin-Komponenten, um eine interaktive Benutzeroberfläche zu erstellen.</li>
 *   <li>Führt eine Backend-Kommunikation durch, um die Anmeldedaten zu überprüfen.</li>
 *   <li>Stellt Benutzerrollen-Logik und Weiterleitung nach erfolgreichem Login bereit.</li>
 * </ul>
 *
 * <h3>Funktionen:</h3>
 * <ul>
 *   <li>Auswahl der Benutzerrolle ("Praktikumsbeauftragte*r", "Student*in").</li>
 *   <li>Eingabe des Benutzernamens und Passworts.</li>
 *   <li>Anzeigen von Erfolgsmeldungen oder Fehlern.</li>
 *   <li>Weiterleitung basierend auf der Benutzerrolle.</li>
 * </ul>
 *
 * @author Beyza Nur Acikgöz
 * @version 1.0
 */

@Route(value = "login", layout = MainBanner.class)
@CssImport("./styles/styles.css")
public class LoginView extends VerticalLayout {

    /**
     * Konstruktor der LoginView.
     * <p>
     * Initialisiert die Benutzeroberfläche mit einem Titel, Formularfeldern, Fehlermeldungen,
     * einem Login-Button und einem Link "Passwort vergessen?".
     * </p>
     */

    public LoginView() {
        addClassName("view-container");
        setSizeFull(); // Nutzt die gesamte Seitenhöhe
        setJustifyContentMode(JustifyContentMode.CENTER); // Zentriert vertikal
        setAlignItems(Alignment.CENTER); // Zentriert horizontal


        // Container für das Formular
        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        // Titel
        H1 title = new H1("Login");
        title.addClassName("form-title");

        // Rolle auswählen (ComboBox)
        ComboBox<String> roleSelection = new ComboBox<>();
        roleSelection.setItems("Praktikumsbeauftragte*r", "Student*in");
        roleSelection.setPlaceholder("Wähle aus, wer du bist:");
        roleSelection.setAllowCustomValue(false);
        roleSelection.addClassName("dropdown");
        roleSelection.setClearButtonVisible(false);

        roleSelection.getElement().addEventListener("click", event -> {
            roleSelection.setOpened(true); // Dropdown bleibt nach dem Klick offen
        });

        Div roleError = new Div();
        roleError.setText("Bitte wähle eine Rolle aus.");
        roleError.addClassName("error-message");
        roleError.setVisible(false);


        // Nutzername-Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzer*innenname");
        usernameField.addClassName("text-field");

        Div usernameError = new Div();
        usernameError.setText("Bitte gib einen gültigen Nutzernamen ein.");
        usernameError.addClassName("error-message");
        usernameError.setVisible(false);

        // Passwort-Feld
        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        Div passwordError = new Div();
        passwordError.setText("Bitte gib ein gültiges Passwort ein.");
        passwordError.addClassName("error-message");
        passwordError.setVisible(false);


        // Login-Button
        Button loginButton = getButton(usernameField, passwordField, roleSelection, usernameError, passwordError, roleError);

        // Link "Passwort vergessen?"
        Anchor forgotPasswordLink = new Anchor("passwort-vergessen", "Passwort vergessen?");
        forgotPasswordLink.addClassName("link");

        // Elemente hinzufügen in richtiger Reihenfolge
        formContainer.add(title, roleSelection, roleError,usernameField, usernameError, passwordField, passwordError, loginButton, forgotPasswordLink);
        add(formContainer);
    }

    /**
     * Erstellt und konfiguriert den Login-Button.
     *
     * @param usernameField Das Feld für den Benutzernamen.
     * @param passwordField Das Feld für das Passwort.
     * @param roleSelection Die ComboBox zur Auswahl der Rolle.
     * @param usernameError Fehlermeldung für einen falschen Nutzernamen.
     * @param passwordError Fehlermeldung für ein falsches Passwort.
     * @param roleError Fehlermeldung, wenn der Nutzer keine Rolle auswählt.
     *
     * @return Der konfigurierte Login-Button.
     */

    private Button getButton(TextField usernameField, PasswordField passwordField, ComboBox<String> roleSelection, Div usernameError, Div passwordError, Div roleError) {
        Button loginButton = new Button("Login");
        loginButton.addClassName("button");

        loginButton.addClickShortcut(com.vaadin.flow.component.Key.ENTER);

        // Login-Logik
        loginButton.addClickListener(event -> {
            boolean isValid = true;

            // Benutzername validieren (Studentennummer oder "Jörn Freiheit")
            String username = usernameField.getValue().trim();
            if (!(username.matches("s0\\d{6}") || username.equalsIgnoreCase("Jörn Freiheit"))) {
                usernameError.setText("Ungültiger oder falscher Nutzername");
                usernameError.setVisible(true);
                usernameField.addClassName("invalid-field");
                isValid = false;
            } else {
                usernameError.setVisible(false);
                usernameField.removeClassName("invalid-field");
            }

            // Passwort validieren (Nicht leer)
            if (passwordField.getValue().trim().isEmpty()) {
                passwordError.setText("Das Passwort darf nicht leer sein.");
                passwordError.setVisible(true);
                passwordField.addClassName("invalid-field");
                isValid = false;
            } else {
                passwordError.setVisible(false);
                passwordField.removeClassName("invalid-field");
            }

            // Rolle validieren
            if (roleSelection.isEmpty()) {
                roleError.setText("Bitte wähle eine Rolle aus.");
                roleError.setVisible(true);
                roleSelection.addClassName("invalid-field");
                isValid = false;
            } else {
                roleError.setVisible(false);
                roleSelection.removeClassName("invalid-field");
            }

            if (isValid) {
                try {
                    String roleForBackend = roleSelection.getValue().replace("*", "");
                    String json = createLoginJson(roleForBackend, username, passwordField.getValue());
                    HttpResponse<String> response = sendJsonToBackend(json, "http://localhost:3000/api/auth/login");

                    if (response.statusCode() == 200 || response.statusCode() == 201) {
                        JSONObject jsonResponse = new JSONObject(response.body());
                        String matrikelnummer = jsonResponse.optString("matrikelnummer", null);

                        if ("Praktikumsbeauftragte*r".equals(roleSelection.getValue())) {
                            if (username != null) {
                                VaadinSession.getCurrent().setAttribute("username", username);
                                Notification.show("Login erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                            } else {
                                Notification.show("Fehler: Benutzername konnte nicht abgerufen werden.", 3000, Notification.Position.TOP_CENTER);
                            }
                        } else if ("Student*in".equals(roleSelection.getValue())) {
                            if (matrikelnummer != null) {
                                VaadinSession.getCurrent().setAttribute("matrikelnummer", matrikelnummer);
                                Notification.show("Login erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                            } else {
                                Notification.show("Fehler: Matrikelnummer konnte nicht abgerufen werden.", 3000, Notification.Position.TOP_CENTER);
                            }
                        }

                        // Weiterleitung nach erfolgreichem Login
                        getUI().ifPresent(ui -> {
                            if ("Praktikumsbeauftragte*r".equals(roleSelection.getValue())) {
                                ui.navigate("admin/startseite");
                            } else if ("Student*in".equals(roleSelection.getValue())) {
                                ui.navigate("/studentin/startseite");
                            }
                        });

                    } else {
                        passwordError.setText("Fehlerhafte Anmeldedaten! Bitte überprüfe deine Eingaben.");
                        passwordError.setVisible(true);
                        passwordField.addClassName("invalid-field");
                    }
                } catch (Exception e) {
                    Notification.show("Ein Fehler ist aufgetreten: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                }
            }
        });
        return loginButton;
    }
    /**
     * Sendet die Login-Daten im JSON-Format an das Backend.
     *
     * @param json Der JSON-String mit den Login-Daten.
     * @param url  Die URL des Backends.
     * @return Die HTTP-Antwort vom Backend.
     * @throws IOException            Falls ein Netzwerkfehler auftritt.
     * @throws InterruptedException   Falls die Anfrage unterbrochen wird.
     */

    private HttpResponse<String> sendJsonToBackend(String json, String url) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    /**
     * Erstellt einen JSON-String für den Login-Request.
     *
     * @param role     Die Rolle des Benutzers.
     * @param username Der Benutzername.
     * @param password Das Passwort.
     * @return Der JSON-String mit den Login-Daten.
     */

    private String createLoginJson(String role, String username, String password) {
        return String.format("{\"role\": \"%s\", \"username\": \"%s\", \"password\": \"%s\"}", role, username, password);
    }
}

