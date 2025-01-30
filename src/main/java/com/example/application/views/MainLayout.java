package com.example.application.views;

import com.vaadin.flow.component.applayout.AppLayout;
import com.vaadin.flow.component.applayout.DrawerToggle;
import com.vaadin.flow.component.html.Footer;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.html.Header;
import com.vaadin.flow.component.html.Span;
import com.vaadin.flow.component.icon.SvgIcon;
import com.vaadin.flow.component.orderedlayout.Scroller;
import com.vaadin.flow.component.sidenav.SideNav;
import com.vaadin.flow.component.sidenav.SideNavItem;
import com.vaadin.flow.router.Layout;
import com.vaadin.flow.server.auth.AnonymousAllowed;
import com.vaadin.flow.server.menu.MenuConfiguration;
import com.vaadin.flow.server.menu.MenuEntry;
import com.vaadin.flow.theme.lumo.LumoUtility;
import java.util.List;

/**
 * MainLayout ist das Haupt-Layout der Anwendung und dient als Rahmen für alle Unterseiten.
 * <p>
 * Es enthält eine Navigationsleiste (Drawer), eine Kopfzeile und eine Fußzeile.
 * Die Navigation basiert auf {@link SideNav} und wird automatisch aus den Menu-Entries
 * von {@link MenuConfiguration} generiert.
 * </p>
 *
 * <h3>Funktionen:</h3>
 * <ul>
 *   <li>Hinzufügen einer Header-Leiste mit dem Titel der aktuellen Seite.</li>
 *   <li>Automatisches Laden der Navigationseinträge aus der {@link MenuConfiguration}.</li>
 *   <li>Drawer-Menü mit dynamischen Einträgen basierend auf der Konfiguration.</li>
 *   <li>Responsives Design mit {@link DrawerToggle} zur Anzeige des Menüs.</li>
 * </ul>
 *
 * @author Beyza Nur Acikgöz
 * @version 1.0
 *
 * The main view is a top-level placeholder for other views.
 */
@Layout
@AnonymousAllowed
public class MainLayout extends AppLayout {

    private H1 viewTitle;


    /**
     * Konstruktor, der die Header- und Drawer-Inhalte hinzufügt.
     */
    public MainLayout() {

        addHeaderContent();
    }

    /**
     * Erstellt den Header-Bereich der Anwendung.
     * <p>
     * Dieser Bereich enthält das Navigations-Menü (DrawerToggle) und den Seitentitel.
     * </p>
     */

    private void addHeaderContent() {
        DrawerToggle toggle = new DrawerToggle();
        toggle.setAriaLabel("Menu toggle");

        viewTitle = new H1();
        viewTitle.addClassNames(LumoUtility.FontSize.LARGE, LumoUtility.Margin.NONE);

        addToNavbar(true, viewTitle);
    }

    /**
     * Erstellt den Drawer-Bereich mit Navigations-Elementen.
     * <p>
     * Hier werden die Menüpunkte aus der {@link MenuConfiguration} geladen und dargestellt.
     * </p>
     */

    private void addDrawerContent() {
        Span appName = new Span("My App");
        appName.addClassNames(LumoUtility.FontWeight.SEMIBOLD, LumoUtility.FontSize.LARGE);
        Header header = new Header(appName);

        Scroller scroller = new Scroller(createNavigation());

        addToDrawer(header, scroller, createFooter());
    }

    /**
     * Erstellt die Navigationsleiste (SideNav) basierend auf der Menu-Konfiguration.
     * <p>
     * Alle verfügbaren Seiten werden als {@link SideNavItem} hinzugefügt.
     * </p>
     *
     * @return Ein {@link SideNav}-Objekt mit den Navigationspunkten.
     */

    private SideNav createNavigation() {
        SideNav nav = new SideNav();

        List<MenuEntry> menuEntries = MenuConfiguration.getMenuEntries();
        menuEntries.forEach(entry -> {
            if (entry.icon() != null) {
                nav.addItem(new SideNavItem(entry.title(), entry.path(), new SvgIcon(entry.icon())));
            } else {
                nav.addItem(new SideNavItem(entry.title(), entry.path()));
            }
        });

        return nav;
    }

    /**
     * Erstellt die Fußzeile der Anwendung.
     *
     * @return Ein {@link Footer}-Objekt für den unteren Bereich der Anwendung.
     */

    private Footer createFooter() {
        Footer layout = new Footer();

        return layout;
    }

    /**
     * Wird nach jeder Navigation ausgeführt und aktualisiert den Seitentitel.
     */

    @Override
    protected void afterNavigation() {
        super.afterNavigation();
        viewTitle.setText("");
    }

    /**
     * Ermittelt den Titel der aktuellen Seite basierend auf der Menu-Konfiguration.
     *
     * @return Der Titel der aktuellen Seite oder ein leerer String, falls nicht gefunden.
     */

    private String getCurrentPageTitle() {
        return MenuConfiguration.getPageHeader(getContent()).orElse("");
    }
}
