package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.dialog.Dialog;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.theme.lumo.Lumo;

@Route("")
@CssImport("./styles/styles.css")
public class HomeView extends VerticalLayout {

    public HomeView() {
        addClassName("view-container"); // Verwende den zentralen Container-Stil

        Div formContainer = new Div();
        formContainer.addClassName("form-container");

        H1 title = new H1("Willkommen zurück!");
        title.addClassName("form-title");

        Button loginButton = new Button("Login", event -> openLogin());
        loginButton.addClassName("button");

        Button registerButton = new Button("Registrieren", event -> openRegister());
        registerButton.addClassName("button");

        formContainer.add(title, loginButton, registerButton);
        add(formContainer);
    }

    private void openLogin() {
        getUI().ifPresent(ui -> ui.navigate("login"));
    }

    private void openRegister() {
        getUI().ifPresent(ui -> ui.navigate("register"));
    }
}