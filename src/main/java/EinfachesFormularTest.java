
import com.vaadin.flow.component.button.Button;
import com.vaadin.flow.component.orderedlayout.VerticalLayout;
import com.vaadin.flow.component.textfield.TextField;
import com.vaadin.flow.router.Route;

@Route("simple-form")
public class EinfachesFormularTest extends VerticalLayout {


    public EinfachesFormularTest() {
        TextField name = new TextField("Name");
        TextField email = new TextField("E-Mail");
        Button submit = new Button("Absenden");

        submit.addClickListener(event -> {
            System.out.println("Name: " + name.getValue());
            System.out.println("E-Mail: " + email.getValue());
        });

        add(name, email, submit);
    }


}
