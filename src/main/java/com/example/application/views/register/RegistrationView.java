package com.example.application.views.register;

import com.example.application.views.subordinatebanner.SubordinateBanner;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.combobox.ComboBox;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.notification.Notification;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.server.VaadinSession;


import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

/**
 * RegistrationView stellt die Benutzeroberfläche für die Registrierung bereit.
 * <p>
 * Diese Klasse bietet ein interaktives Formular, in dem Benutzer ihre Matrikelnummer,
 * ein Passwort und eine Sicherheitsfrage angeben müssen, um sich erfolgreich zu registrieren.
 * Sie prüft die Eingaben und zeigt hilfreiche Fehlermeldungen an, wenn die Validierung fehlschlägt.
 * </p>
 *
 * <h3>Funktionen:</h3>
 * <ul>
 *   <li>Eingabe der Matrikelnummer mit Validierung.</li>
 *   <li>Passwortfeld mit mehreren Sicherheitsprüfungen.</li>
 *   <li>Sicherheitsfrage und Antwort mit Validierung.</li>
 *   <li>Backend-Kommunikation zur Registrierung von Benutzern.</li>
 * </ul>
 *
 * <h3>Verwendete Technologien:</h3>
 * <ul>
 *   <li>Vaadin Flow-Komponenten für die Benutzeroberfläche.</li>
 *   <li>HTTP-Client für die Kommunikation mit dem Backend.</li>
 *   <li>VaadinSession zur Speicherung der Benutzerdaten.</li>
 * </ul>
 *
 * @author Beyza Nur Acikgöz
 * @version 1.0
 */

@Route(value = "register", layout = SubordinateBanner.class)
@CssImport("./styles/styles.css")
public class RegistrationView extends VerticalLayout {

    /**
     * Konstruktor der RegistrationView.
     * <p>
     * Initialisiert die Benutzeroberfläche mit allen Formularfeldern und Layouts.
     * Enthält Logik zur Validierung und Registrierung von Benutzern.
     * </p>
     */

    public RegistrationView() {
        // Hauptcontainer mit einer zentrierten Ansicht
        //addClassName("scrollable-view");
        addClassName("register-view");


        // Hintergrund-Animation (Zacken)
        Span backgroundAnimation = createAnimatedLine();
        backgroundAnimation.addClassName("background-animation");


        // Formularcontainer
        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        // Überschrift
        H1 title = new H1("Registrieren");
        title.addClassName("form-title");

        // Nutzername Feld
        TextField usernameField = new TextField();
        usernameField.setPlaceholder("Matrikelnummer");
        usernameField.addClassName("text-field");

        // Fehlernachricht für Nutzername
        Div usernameError = new Div();
        usernameError.setText("Bitte gib deine Matrikelnummer im Format s0XXXXXX ein.");
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
        H3 securityQuestionsTitle = new H3("Sicherheitsfragen");
        securityQuestionsTitle.addClassName("form-title");

        // Sicherheitsfrage auswählen (ComboBox)
        ComboBox<String> questionSelection = new ComboBox<>();
        String question1 = "1. Wie lautet dein Geburtsort?";
        String question2 = "2. Was war dein erstes Haustier?";
        String question3 = "3. Wie lautet der Name deiner Grundschule?";
        questionSelection.setItems(question1, question2, question3);
        questionSelection.setPlaceholder("Wähle eine Sicherheitsfrage");
        questionSelection.addClassName("dropdown");
        questionSelection.setAllowCustomValue(false);

        // Sicherheitsfrage-Feld
        TextField answerField = new TextField();
        answerField.setPlaceholder("Deine Antwort");
        answerField.addClassName("text-field");

        // Fehlernachricht für die Sicherheitsfrage
        Div questionError = new Div();
        questionError.setText("Bitte füll das Feld aus!");
        questionError.addClassName("error-message");
        questionError.setVisible(false); // Standardmäßig unsichtbar

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
            passwordErrors.removeAll(); // Alle vorherigen Fehler entfernen
            if (!passwordField.getValue().matches("(?=.*[A-Z])(?=.*\\d)(?=.*[!?§/'@#$%^&*()]).{8,}")) {
                Div error1 = new Div();
                error1.setText("Mindestens ein Großbuchstabe erforderlich.");
                error1.addClassName("error-message"); // Gleicher Stil wie beim Nutzernamen

                Div error2 = new Div();
                error2.setText("Mindestens eine Zahl erforderlich.");
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
            // Sicherheitsfrage Antwort Validierung
            if (answerField.getValue().trim().isEmpty()) {
                answerField.addClassName("invalid-field");
                questionError.setVisible(true);
                isValid = false;
            } else {
                answerField.removeClassName("invalid-field");
                questionError.setVisible(false);
            }


            // Registrierung
            if (isValid) {
                VaadinSession.getCurrent().setAttribute("matrikelnummer", usernameField.getValue());
                String frageId = String.valueOf(questionSelection.getValue().charAt(0));

                try{
                    String json = createRegisterJson(usernameField.getValue(), passwordField.getValue(),
                            confirmPasswordField.getValue(), frageId, answerField.getValue());
                    HttpResponse<String> response = sendJsonToBackend(json, "http://localhost:3000/api/auth/registrieren");
                    if (response.statusCode() == 200 || response.statusCode() == 201) {
                        Notification.show("Registrierung erfolgreich!", 3000, Notification.Position.TOP_CENTER);
                    }
                    else if (response.statusCode() == 400 || response.statusCode() == 401) {
                        Notification.show("Passwörter stimmen nicht miteinander überein oder Matrikelnummer existiert bereits.", 3000, Notification.Position.TOP_CENTER);
                        isValid = false;
                    }
                    else{
                        Notification.show("Fehler: " + response.body(), 3000, Notification.Position.TOP_CENTER);
                        isValid = false;
                    }
                }
                catch (Exception e) {
                    Notification.show("Ein Fehler ist aufgetreten: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                    isValid = false;
                }
            }
            if(isValid){
                getUI().ifPresent(ui -> ui.navigate("login"));
            }
        });

        // Formular-Layout
        formContainer.add(title, usernameField, usernameError, passwordField, passwordErrors,
                confirmPasswordField, securityQuestionsTitle, questionSelection, answerField, questionError,registerButton);


        add(backgroundAnimation);
        add(formContainer);
    }

    /**
     * Erstellt eine Hintergrundanimation (SVG-Zacken).
     *
     * @return Ein {@link Span} mit der SVG-Animation.
     */

    private Span createAnimatedLine() {
        String svgAnimation = """
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" preserveAspectRatio="none"
             id="registration-zacken" style="width: 100%; height: 100%; position: absolute; opacity: 0.1;">
            <path d="M-150,300 L0,300 L125,200 L250,300 L375,150 L425,200 L500,0"
                  style="fill:none;stroke:#8DC63F;stroke-width:25;">
            </path>
        </svg>
    """;

        Span span = new Span();
        span.getElement().setProperty("innerHTML", svgAnimation);
        span.addClassName("background-animation");
        return span;
    }

    /**
     * Erstellt einen JSON-String für den Registrierungs-Request.
     *
     * @param username   Die Matrikelnummer des Benutzers.
     * @param password   Das Passwort des Benutzers.
     * @param passwordConfirm Die Passwortbestätigung.
     * @param frageId    Die ID der Sicherheitsfrage.
     * @param answer     Die Antwort auf die Sicherheitsfrage.
     * @return Der JSON-String mit den Registrierungsdaten.
     */

    private String createRegisterJson(String username, String password, String passwordConfirm, String frageId, String answer) {
        return String.format("{\"username\": \"%s\", \"password\": \"%s\", \"passwordConfirm\": \"%s\", \"frageId\": \"%s\", \"answer\": \"%s\"}",username, password, passwordConfirm, frageId,  answer);
    }

    /**
     * Sendet die Registrierungsdaten im JSON-Format an das Backend.
     *
     * @param json Der JSON-String mit den Registrierungsdaten.
     * @param url  Die URL des Backends.
     * @return Die HTTP-Antwort des Backends.
     * @throws IOException          Falls ein Netzwerkfehler auftritt.
     * @throws InterruptedException Falls die Anfrage unterbrochen wird.
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
}
