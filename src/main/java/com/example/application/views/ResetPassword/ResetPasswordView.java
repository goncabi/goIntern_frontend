package com.example.application.views.ResetPassword;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
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

        //Eingabe Matrikelnummer
        TextField matrikelnummerField = new TextField("Matrikelnummer");
        matrikelnummerField.addClassName("text-field");

        // Feld für die Sicherheitsfrage
        TextField securityQuestionField = new TextField("Frage");
        securityQuestionField.addClassName("text-field");
        securityQuestionField.setVisible(false);

        // Antwortfeld für die Sicherheitsfrage
        TextField securityAnswerField = new TextField("Antwort");
        securityAnswerField.setVisible(false);
        securityAnswerField.addClassName("text-field");
        //Fehlercontainer für Antwort
        Div questionError = new Div();
        questionError.setText("Bitte beantworten Sie die obige Frage.");
        questionError.addClassName("error-message");
        questionError.setVisible(false); // Standardmäßig unsichtbar

        // Passwortfeld
        PasswordField newPasswordField = new PasswordField("Neues Passwort");
        newPasswordField.setVisible(false);
        newPasswordField.addClassName("text-field");
        // Fehlercontainer für Passwort
        Div passwordErrors = new Div();
        passwordErrors.addClassName("error-container");
        passwordErrors.setVisible(false);
        //Passwort-Bestätigen-Feld
        PasswordField confirmNewPasswordField = new PasswordField("Neues Passwort bestätigen");
        confirmNewPasswordField.setVisible(false);
        confirmNewPasswordField.addClassName("text-field");

        //Button zum Prüfen der Antwort
        Button resetPassword = antwortPruefen(matrikelnummerField, securityAnswerField, newPasswordField, confirmNewPasswordField, passwordErrors, questionError);
        resetPassword.setVisible(false);

        //Button zum Prüfen der Matrikelnummer
        Button matrikelnrPruefen = matrikelnrPruefen(matrikelnummerField, securityQuestionField, securityAnswerField, newPasswordField, confirmNewPasswordField, resetPassword);

        // Hinzufügen der Komponenten zur Ansicht
        formContainer.add(
                title,
                matrikelnummerField,
                matrikelnrPruefen,
                securityQuestionField,
                securityAnswerField,
                questionError,
                newPasswordField,
                passwordErrors,
                confirmNewPasswordField,
                resetPassword
        );
        add(formContainer);
    }

    private Button antwortPruefen(TextField matrikelnummerField, TextField answerField, PasswordField passwordField, PasswordField confirmNewPasswordField, Div passwordErrors, Div questionError) {
        Button button = new Button("Passwort neu setzen");
        button.addClassName("button");

        button.addClickListener(event -> {
            boolean isValid = true;
            // Passwort Validierung
            passwordErrors.removeAll(); // Alle vorherigen Fehler entfernen
            if (!passwordField.getValue().matches("^(?=.*[A-Z])(?=.*\\d)(?=.*[!?§/'@#$%^&*()])[A-Za-z\\d!?§/'@#$%^&*()]{8,}$")) {
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

            //Überprüfen der Antwort und Neusetzung des Passwortes
            if(isValid){
                isValid = false;
                String matrikelnummer = matrikelnummerField.getValue();
                String answer = answerField.getValue();
                String password = passwordField.getValue();
                String confirmPassword = confirmNewPasswordField.getValue();

                if (password.isEmpty() || confirmPassword.isEmpty() || answer.isEmpty()) {
                    Notification.show("Bitte alle Felder ausfüllen!");
                }
                else if (!password.equals(confirmPassword)) {
                    Notification.show("Passwörter stimmen nicht überein!");
                }
                else {
                    try {
                        String json = createAntwortJson(matrikelnummer, answer, password);
                        HttpResponse<String> response = sendJsonToBackend(json, "http://localhost:3000/api/auth/passwort-vergessen/frage");
                        if (response.statusCode() == 200 || response.statusCode() == 201) {
                            isValid = true;
                            Notification.show("Passwort wurde neu gesetzt.", 3000, Notification.Position.TOP_CENTER);
                        }
                        else if (response.statusCode() == 400 || response.statusCode() == 401) {
                            Notification.show("Antwort falsch.", 3000, Notification.Position.TOP_CENTER);
                        }
                        else{
                            Notification.show("Fehler: " + response.body(), 3000, Notification.Position.TOP_CENTER);
                        }
                    }
                    catch (Exception e) {
                        Notification.show("Ein Fehler ist aufgetreten: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
                    }
                }

                if (isValid) {
                    VaadinSession.getCurrent().setAttribute("matrikelnummer", matrikelnummer);
                    getUI().ifPresent(ui -> ui.navigate("/studentin/startseite"));
                }
            }
        });
        return button;
    }

    private String createAntwortJson(String matrikelnummer, String antwort, String passwort) {
        return String.format("{\"matrikelnummer\": \"%s\", \"antwort\": \"%s\", \"passwort\": \"%s\"}", matrikelnummer, antwort, passwort);
    }

    private Button matrikelnrPruefen(TextField matrikelnummerField, TextField securityQuestionField, TextField securityAnswerField, PasswordField newPasswordField, PasswordField confirmNewPasswordField, Button resetPassword) {
        Button weiterButton = new Button("Weiter");
        weiterButton.addClassName("button");
        weiterButton.addClickListener(event -> {
            boolean isValid = false;
            try{
                String matrikelnummer = matrikelnummerField.getValue();
                HttpResponse<String> response = sendJsonToBackend(matrikelnummer, "http://localhost:3000/api/auth/passwort-vergessen");
                if (response.statusCode() == 200 || response.statusCode() == 201) {
                    isValid = true;
                    securityQuestionField.setValue(response.body());
                }
                else if (response.statusCode() == 400 || response.statusCode() == 401) {
                    Notification.show("Matrikelnummer falsch.", 3000, Notification.Position.TOP_CENTER);
                }
                else{
                    Notification.show("Fehler: " + response.body(), 3000, Notification.Position.TOP_CENTER);
                }
            } catch (Exception e) {
                Notification.show("Ein Fehler ist aufgetreten: " + e.getMessage(), 3000, Notification.Position.TOP_CENTER);
            }

            if (isValid) {
                securityQuestionField.setVisible(true);
                securityAnswerField.setVisible(true);
                newPasswordField.setVisible(true);
                confirmNewPasswordField.setVisible(true);
                resetPassword.setVisible(true);
                matrikelnummerField.setVisible(false);
                weiterButton.setVisible(false);
            }
        });
        return weiterButton;
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

}
