package com.example.application.views.secured;
import com.vaadin.flow.component.html.H1;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.router.Route;

@Route("protected")
public class ProtectedView extends VerticalLayout {
    public ProtectedView() {
        add(new H1("Welcome to the protected page!"));
    }
}
