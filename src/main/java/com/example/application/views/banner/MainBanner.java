package com.example.application.views.banner;

import com.vaadin.flow.component.html.Div;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Header;
import com.vaadin.flow.component.html.Image;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.RouterLayout;


    public class MainBanner extends VerticalLayout implements RouterLayout {

        public MainBanner() {
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

            Div logoAndTitleRow = new Div();
            logoAndTitleRow.addClassName("logo-title-row"); // Neue CSS-Klasse für Zeilenlayout
            logoAndTitleRow.add(logoBeforeTitle, bannerTitle);

            // Slogan direkt unter der Überschrift
            Span slogan = new Span("Dein Weg zum schnellen Praktikum");
            slogan.addClassName("banner-slogan");

            // Container für Logo und Überschrift
            Div logoAndTitleContainer = new Div();
            logoAndTitleContainer.addClassName("logo-title-container");
            logoAndTitleContainer.add(logoAndTitleRow, slogan);



            // Füge den Container (Logo + Überschrift) und das rechte Logo in den Banner ein
            banner.add(logoAndTitleContainer);
            add(banner);

        }
    }

