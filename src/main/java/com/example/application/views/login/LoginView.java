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
import com.vaadin.flow.server.VaadinSession;
import org.json.JSONObject;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Route("login")
@CssImport("./styles/styles.css")
public class LoginView extends VerticalLayout {

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
        roleSelection.setItems("Praktikumsbeauftragte/r", "Student/in");
        roleSelection.setPlaceholder("Wähle eine Rolle");
        roleSelection.addClassName("dropdown");

        // Nutzername-Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Nutzername");
        usernameField.addClassName("text-field");

        // Passwort-Feld
        PasswordField passwordField = new PasswordField();
        passwordField.setPlaceholder("Passwort");
        passwordField.addClassName("text-field");

        // Login-Button
        Button loginButton = getButton(usernameField, passwordField, roleSelection);

        // Link "Passwort vergessen?"
        Anchor forgotPasswordLink = new Anchor("passwort-vergessen", "Passwort vergessen?");
        forgotPasswordLink.addClassName("link");

        // Elemente hinzufügen in richtiger Reihenfolge
        formContainer.add(title, roleSelection, usernameField, passwordField, loginButton, forgotPasswordLink);
        add(formContainer);
    }

    private Button getButton(TextField usernameField, PasswordField passwordField, ComboBox<String> roleSelection) {
        Button loginButton = new Button("Login");
        loginButton.addClassName("button");

        // Login-Logik
        loginButton.addClickListener(event -> {
            boolean isValid;
            if (roleSelection.isEmpty()) {
                Notification.show("Bitte Rolle auswählen!", 3000, Notification.Position.MIDDLE);
                isValid = false;
            }
            else{
                try{
                    String json = createLoginJson(roleSelection.getValue(), usernameField.getValue(), passwordField.getValue());
                    HttpResponse<String> response = sendJsonToBackend(json, "http://localhost:3000/api/auth/login");
                    if (response.statusCode() == 200 || response.statusCode() == 201) {
                        String responseBody = response.body();
                        JSONObject jsonResponse = new JSONObject(responseBody);

                        String matrikelnummer = jsonResponse.optString("matrikelnummer", null);
                        // Rolle prüfen
                        if ("Praktikumsbeauftragte/r".equals(roleSelection.getValue())) {
                            Notification.show("Login erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                            if (usernameField.getValue() != null) {

                                VaadinSession.getCurrent().setAttribute("username", usernameField.getValue());
                                Notification.show("Login erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                            } else {
                                Notification.show("Username konnte nicht abgerufen werden.", 3000, Notification.Position.TOP_CENTER);
                            }
                        } else if ("Student/in".equals(roleSelection.getValue())) {
                            if (matrikelnummer != null) {

                                VaadinSession.getCurrent().setAttribute("matrikelnummer", matrikelnummer);
                                Notification.show("Login erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                            } else {
                                Notification.show("Matrikelnummer konnte nicht abgerufen werden.", 3000, Notification.Position.TOP_CENTER);
                            }
                        }
                        isValid = true;
                    } else if (response.statusCode() == 400 || response.statusCode() == 401) {
                        Notification.show("Nutzername oder Passwort falsch.", 3000, Notification.Position.TOP_CENTER);
                        isValid = false;
                    }
                    else{
                        Notification.show("Fehler: " + response.body(), 3000, Notification.Position.TOP_CENTER);
                        isValid = false;
                    }
                }
                catch(Exception e){
                    Notification.show("Ein Fehler ist aufgetreten: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                    isValid = false;
                }
            }

            // Weiterleitung nach erfolgreicher Validierung
            if (isValid) {
                if ("Praktikumsbeauftragte/r".equals(roleSelection.getValue())) {
                    getUI().ifPresent(ui -> ui.navigate("admin/startseite"));
                } else if ("Student/in".equals(roleSelection.getValue())) {
                    getUI().ifPresent(ui -> ui.navigate("/studentin/startseite"));
                }
            }
        });
        return loginButton;
    }

    private HttpResponse<String> sendJsonToBackend(String json, String url) throws IOException, InterruptedException {
        HttpClient client = HttpClient.newHttpClient();

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(url))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(json))
                .build();

        return client.send(request, HttpResponse.BodyHandlers.ofString());
    }

    private String createLoginJson(String role, String username, String password) {
        return String.format("{\"role\": \"%s\", \"username\": \"%s\", \"password\": \"%s\"}", role, username, password);
    }
}
