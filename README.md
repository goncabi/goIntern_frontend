# GoIntern



## 📃 Projektbeschreibung
Dieses Projekt ist eine Webanwendung, die mit Vaadin, React, Spring Boot und Maven entwickelt wurde. Es enthält sowohl Frontend- als auch Backend-Komponenten zur Verwaltung von Praktikumsinformationen.


# 📋 Inhaltsverzeichnis
1. [Installation](#🛠️-installation)
2. [Verwendung und Hauptfunktionen](#🚀-verwendung-und-hauptfunktionen)
3. [Projektstruktur](#🔬-projektstruktur)
4. [Konfiguration](#📚-konfigurationn)
5. [Lizenz](#📝-lizenz)
6. [Kontakt](#📞-kontakt)


# 🛠️ Installation
## Voraussetzungen:

* Java JDK 23

* Node.js & npm

* Maven

# 🚀 Verwendung und Hauptfunktionen
## Schritte zur Installation

## Repository klonen

1. git clone https://gitlab.rz.htw-berlin.de/Mira.Khreis/team1.frontend1

2. In das Projektverzeichnis wechseln:

* cd team1.frontend1

## Abhängigkeiten installieren

1. mvn clean install
2. npm install

## Anwendung starten

mvn spring-boot:run

Die Anwendung ist unter http://localhost:8080 erreichbar.

Das Projekt kann auch in eine IDE deiner Wahl importiert werden, wie es bei jedem Maven-Projekt üblich ist. Weitere Informationen dazu findest du in der [Vaadin-Dokumentation] (https://vaadin.com/docs/latest/guide/step-by-step/importing) (Eclipse, IntelliJ IDEA, NetBeans, and VS Code)., die Anleitungen für Eclipse, IntelliJ IDEA, NetBeans und VS Code enthält.


## ✨ Hauptfunktionen
Nach der Registration, kannst du dich mit deinen erstellten Zugangsdaten anmelden. Hier kannst du durch verschiedene Abschnitte wie Login, Poster und weitere navigieren. Das System ermöglicht die Verwaltung und das Anzeigen von Praktikumsinformationen. Es gibt eine getrennte Ansicht für Studenten und Praktikumsbeauftragte. Der Student kann ihr Praktikumsformular mit ihren persönlichen und Praktikumsdaten ausfüllen, speichern und abschicken. Der Praktikumsbeauftragte sieht die Anträge in einer Tabelle und kann diese mit einer Begründung ablehnen oder zulassen. Zusätzlich kann die Studentin nach dem Praktikum ein Poster hochladen, welches der Praktikumsbeauftragte sich anschauen kann. Zu den Hauptfunktionen gehören die Benutzerregistrierung und Authentifizierung, die Verwaltung von Aufgaben und Praktikumsdaten, ein responsives Design für verschiedene Endgeräte sowie eine zuverlässige Datenbankanbindung über Spring Boot.



# 🔬 Projektstruktur

```
team1.frontend1/
|-- .idea/                     # IntelliJ IDEA Konfigurationsdateien
|-- .mvn/                      # Maven Wrapper
|-- src/
|   |-- main/
|   |   |-- bundles/           # Frontend Bundle Dateien
|   |   |-- README.md          # Projektdokumentation
|   |   |-- frontend/
|   |   |   |-- generated/     # Automatisch generierter Code
|   |   |   |-- styles/          # CSS-Dateien
|   |   |   |-- themes/          # UI-Themen
|   |   |-- java/
|   |   |   |-- com.example.application/
|   |   |   |   |-- service/     # Backend-Services
|   |   |   |   |-- views/       # UI-Komponenten
|-- resources/
|-- pom.xml                     # Maven Build Datei
|-- package.json                # npm Abhängigkeiten
```


# 📚 Konfiguration

* Konfigurationsdatei hier einfügen


## 📝 Lizenz
Dieses Projekt steht unter der MIT-Lizenz. Weitere Informationen findest du in der LICENSE-Datei.

## 📞 Kontakt
Falls du Fragen hast, kontaktiere uns unter:

Mira.Khreis@Student.HTW-Berlin.de<br>
Angela.Barzaeva@Student.HTW-Berlin.de<br>
Beyza.Acikgoez@Student.HTW-Berlin.de<br>
Merlind.Pohl@Student.HTW-Berlin.de<br>
Noa.Sauter@Student.HTW-Berlin.de<br>
Gabriela.GoncalvezMontero@Student.HTW-Berlin.de<br>
Maryam.Mirza@Student.HTW-Berlin.de