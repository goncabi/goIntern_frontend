package com.example.application.views.poster;
import com.example.application.views.banner.MainBanner;
import com.vaadin.flow.component.dependency.CssImport;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.dom.Style;
import com.vaadin.flow.router.PageTitle;
import com.vaadin.flow.router.Route;

@Route(value = "poster", layout = MainBanner.class) // URL-Pfad: http://localhost:8080/poster
@PageTitle("Poster Übersicht")
@CssImport("./styles/posterview.css")
public class PosterView extends VerticalLayout {

    public PosterView() {

        // Hintergrund und Layout-Stil
        getStyle().set("background-color", "white");
        getStyle().set("width", "100%");
        getStyle().set("height", "100vh");
        getStyle().set("text-align", "center");

        // Inhalt vertikal und horizontal zentrieren
        setAlignItems(Alignment.CENTER);
        setJustifyContentMode(JustifyContentMode.CENTER);

        // Überschrift und Beschreibung
        H1 title = new H1("Poster Übersicht");
        add(title);

        H1 description = new H1("Hier könnten Poster angezeigt werden.");
        add(description);
    }
}
