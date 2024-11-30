package com.example.application.views.ResetPassword;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
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

        H1 title = new H1("Passwort zurücksetzen");
        title.addClassName("form-title");

        // Sicherheitsfragen
        TextField question1Field = new TextField("1. Wie lautet dein Geburtsort?");
        question1Field.addClassName("text-field");

        TextField question2Field = new TextField("2. Was war dein erstes Haustier?");
        question2Field.addClassName("text-field");

        TextField question3Field = new TextField("3. Wie lautet der Name deiner Grundschule?");
        question3Field.addClassName("text-field");

        // Neues Passwortfeld
        PasswordField newPasswordField = new PasswordField("Neues Passwort");
        newPasswordField.addClassName("text-field");

        PasswordField confirmNewPasswordField = new PasswordField("Neues Passwort bestätigen");
        confirmNewPasswordField.addClassName("text-field");

        Button resetButton = new Button("Passwort zurücksetzen");
        resetButton.addClassName("button");

        // Hinzufügen der Komponenten zur Ansicht
        formContainer.add(title, question1Field, question2Field, question3Field, newPasswordField, confirmNewPasswordField, resetButton);
        add(formContainer);
    }
}

