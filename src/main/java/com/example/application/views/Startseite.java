package com.example.application.views;

import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Header;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;
import com.vaadin.flow.component.html.Image;

@Route("")
@CssImport("./styles/styles.css")
public class Startseite extends VerticalLayout {

    public Startseite() {
        addClassName("view-container"); // zentraler Container-Stil

        // Header-Banner
        Header banner = new Header();
        banner.addClassName("banner");

        // Neues Logo vor der Überschrift
        Image logoBeforeTitle = new Image("images/GoIntern-Logo.jpg", "GoIntern Logo");
        logoBeforeTitle.addClassName("logo-before");

        // Überschrift
        H1 bannerTitle = new H1("GoIntern");
        bannerTitle.addClassName("banner-title");

        // Container für Logo und Überschrift
        Div logoAndTitleContainer = new Div();
        logoAndTitleContainer.addClassName("logo-title-container");
        logoAndTitleContainer.add(logoBeforeTitle, bannerTitle);

        // Bereits vorhandenes grünes Logo rechts
        Image greenLogo = new Image("images/FB4_FIW.jpg", "Grünes Logo");
        greenLogo.addClassName("banner-logo");

        // Füge den Container (Logo + Überschrift) und das rechte Logo in den Banner ein
        banner.add(logoAndTitleContainer, greenLogo);
        add(banner);

        // Animierte Linie
        Span animatedLine = createAnimatedLine();
        add(animatedLine);

        // Formular-Container
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

    private Span createAnimatedLine() {
        String svgAnimation = """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" style="width: 100%; height: auto; position: absolute;">
                <path d="M0,300 L125,200 L250,300 L375,150 L425,200 L500,0"
                    style="fill:none;stroke:#8DC63F;stroke-width:14;opacity:0;">
                    <animate attributeName="opacity"
                        from="0" to="1"
                        dur="2s"
                        fill="freeze" />
                </path>
            </svg>
        """;

        Span svgContainer = new Span();
        svgContainer.getElement().setProperty("innerHTML", svgAnimation);
        svgContainer.getStyle().set("position", "absolute")
                .set("top", "0")
                .set("left", "0")
                .set("width", "100%")
                .set("height", "100%");

        return svgContainer;
    }
}
