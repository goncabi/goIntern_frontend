package com.example.application.views;

import com.example.application.views.banner.MainBanner;
import com.example.application.views.subordinatebanner.SubordinateBanner;
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;


@Route(value = "", layout = MainBanner.class)
@CssImport("./styles/styles.css")
public class Startseite extends VerticalLayout {

    public Startseite() {
        addClassName("view-container"); // zentraler Container-Stil

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
        registerButton.addClassName("button-behind");

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
