package com.example.application.views.subordinatebanner;

import com.vaadin.flow.component.html.*;
import com.vaadin.flow.component.orderedlayout.HorizontalLayout;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.RouterLayout;

public class SubordinateBanner extends VerticalLayout implements RouterLayout {

    public SubordinateBanner() {
        addClassName("view-container-2");

        // Banner-Container
        Header banner = new Header();
        banner.getStyle()
                .set("display", "flex")
                .set("flex-direction", "row")  // Inhalt vertikal zentrieren
                .set("align-items", "center")
                .set("align-self", "center")
                .set("justify-content", "center")
                .set("text-align", "center")
                .set("margin", " 0 auto")
                .set("position", "relative")
                .set("gap", "0px")  // Abstand zwischen den Elementen erhöhen
                .set("padding", "20px 0")
                .set("width", "100%")
                .set("box-sizing", "border-box")
                .set("background", "transparent")
                .set("box-shadow", "none");

        // Logo hinzufügen mit fester Größe
        Image logoBeforeTitle = new Image("images/GoIntern-Logo.jpg", "GoIntern Logo");
        logoBeforeTitle.getStyle()
                .set("max-width", "80px")
                .set("height", "auto")
                .set("margin", "0")
                .set("display", "block");


        // Titel hinzufügen
        H1 bannerTitle = new H1("GoIntern");
        bannerTitle.getStyle()
                .set("font-size", "50px")
                .set("font-weight", "bold")
                .set("color", "#333")
                .set("position", "relative")
                .set("margin", "0");

        // Slogan hinzufügen
        Span slogan = new Span("Dein Weg zum schnellen Praktikum");
        slogan.getStyle()
                .set("font-size", "18px")
                .set("font-style", "italic")
                .set("color", "#555")
                .set("margin", "26px 0 0 0px");


        // Container für Titel und Slogan
        Div logoAndTitleContainer = new Div();
        logoAndTitleContainer.getStyle()
                .set("display", "flex")
                .set("flex-direction", "row")
                .set("align-items", "center")
                .set("gap", "0px")
                .set("margin", "0")
                .set("justify-content", "center");

        // Layout für Titel und Slogan in einer Reihe
        HorizontalLayout titleAndSlogan = new HorizontalLayout();
        titleAndSlogan.addClassName("title-slogan-container");
        titleAndSlogan.setAlignItems(Alignment.CENTER);
        titleAndSlogan.add(bannerTitle, slogan);

        // Gesamtes Layout zentriert in einer Zeile
        HorizontalLayout secondLogoAndTitleContainer = new HorizontalLayout();
        secondLogoAndTitleContainer.add(logoBeforeTitle, titleAndSlogan);


        // Titel und Slogan in den Container einfügen
        secondLogoAndTitleContainer.add(bannerTitle, slogan);

        // Alle Elemente ins Banner einfügen
        banner.add(logoBeforeTitle, secondLogoAndTitleContainer);
        add(banner);
    }
}

