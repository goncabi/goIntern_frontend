package com.example.application.views.register;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.H3;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.PasswordField;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.dependency.CssImport;

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

        // Hinzufügen aller Komponenten zum Formular
        formContainer.add(title, usernameField, passwordField, confirmPasswordField, securityQuestionsTitle, question1Field, question2Field, question3Field, registerButton);
        add(formContainer);
    }
}

