# GoIntern



## 📃 Projektbeschreibung
Dieses Projekt ist eine Webanwendung, die mit Vaadin, Version 21, Spring Boot 3, Version 3.3.5 und Maven entwickelt wurde. Es enthält sowohl Frontend- als auch Backend-Komponenten sowie eine Anbindung zur Datenbank postgreSQL zur Verwaltung von Praktikumsanträgen.


# 📋 Inhaltsverzeichnis
1. [Installation](#🛠️-installation)
2. [Verwendung und Hauptfunktionen](#🚀-verwendung-und-hauptfunktionen)
3. [Projektstruktur](#🔬-projektstruktur)
4. [Konfiguration](#📚-konfigurationn)
5. [Lizenz](#📝-lizenz)
6. [Kontakt](#📞-kontakt)


# 🛠️ Installation
## Voraussetzungen:

* Java JDK 23 im Frontend
* Java JDK 21 im Backend

# 🚀 Verwendung und Hauptfunktionen
## Schritte zur Installation

## Repository klonen

1. git clone https://gitlab.rz.htw-berlin.de/Mira.Khreis/team1.frontend1
2. git clone https://gitlab.rz.htw-berlin.de/Mira.Khreis/backend_team1

2. In das Projektverzeichnis wechseln:

* cd team1.frontend1
* cd backend_team1

## Abhängigkeiten installieren

1. mvn clean install
2. npm install (nur Frontend)

## Anwendung starten

Frontend und Backend gleichzeitig ausführen (run):
mvn spring-boot:run

Die Anwendung ist unter http://localhost:8080 erreichbar.

Das Projekt kann auch in eine IDE deiner Wahl importiert werden, wie es bei jedem Maven-Projekt üblich ist. 
Weitere Informationen dazu findest du in der [Vaadin-Dokumentation] (https://vaadin.com/docs/latest/guide/step-by-step/importing) (Eclipse, IntelliJ IDEA, NetBeans, and VS Code)., die Anleitungen für Eclipse, IntelliJ IDEA, NetBeans und VS Code enthält.


## ✨ Hauptfunktionen

Zu den Hauptfunktionen gehören die Registrierung und Authentifizierung (Login), die Verwaltung von Praktikumsanträgen und das Hochladen von Praktikumspostern.
Nach der Registrierung, kann sich die Studentin mit ihren erstellten Zugangsdaten anmelden.
Das System ermöglicht das Verwalten und das Anzeigen von Praktikumsinformationen.
Es gibt eine getrennte Ansicht für Studentinnen und Praktikumsbeauftragte.
Die Studentin kann ihr Praktikumsformular mit ihren persönlichen Daten und den Praktikumsdaten ausfüllen, zwischenspeichern, löschen und abschicken.
Sie kann sich zudem die Arbeitstage für ihren angegeben Praktikumszeitraum berechnen lassen und überprüfen, ob diese ausreichen. 
Der Praktikumsbeauftragte sieht die Anträge in einer Tabelle, und kann die Anträge genehmigen oder mit einer Begründung ablehnen. 
Diese Begründung wird der jeweiligen Studentin angezeigt. 
Er kann einzelne Anträge nach Namen und Matrikelnummern suchen oder konkret nach Status filtern. 
Die Anträge können jeweils verschiedene Status haben: Antrag offen, Zugelassen, Abgelehnt, Derzeit im Praktikum, Absolviert
Wenn ein Antrag durch die Studentin nachträglich zurückgezogen oder ein laufendes Praktikum abgebrochen wird, erhält der Praktikumsbeauftragte eine Nachricht in seiner Ansicht darüber. 
Bei Abbruch werden die bereits absolvierten Praktikumstage angezeigt.
Zusätzlich kann die Studentin, nachdem sie das Praktikum absolviert haben, ein Poster hochladen, welches sich der Praktikumsbeauftragte anschauen kann. 




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
|   |   |   |   |-- service/     # ServiceLayer und BusinessLogik
|   |   |   |   |   |--ArbeitstageBerechnungsService
|   |   |   |   |-- utils/       # Dienstprogramme
|   |   |   |   |   |--CustomDatePicker
|   |   |   |   |   |--DialosUtils
|   |   |   |   |-- views/       # UI-Komponenten
|   |   |   |   |   |--banner/
|   |   |   |   |   |--login/
|   |   |   |   |   |--poster/
|   |   |   |   |   |--register/
|   |   |   |   |   |--ResetPassword/
|   |   |   |   |   |--subordinatebanner
|-- resources/
|-- pom.xml                     # Maven Build Datei
|-- package.json                # npm Abhängigkeiten


backend_team1/
|-- .idea/                     # IntelliJ IDEA Konfigurationsdateien
|-- .mvn/                      # Maven Wrapper
|-- src/
|   |-- main/
|   |   |-- frontend/           # Frontend Bundle Dateien
|   |   |   |-- generated/      # Automatisch generierter Code
|   |   |   |-- themes/         
|   |   |   |--|-- praktikumsapp/    
|   |   |   |--|--|-- main-layout     
|   |   |   |--|--|-- styles          # CSS-Dateien           
|   |   |-- frontend/
|   |   |   |-- generated/       # Automatisch generierter Code
|   |   |   |-- styles/          # CSS-Dateien
|   |   |   |-- themes/          # UI-Themen
|   |   |-- java/
|   |   |   |-- com.example.application/
|   |   |   |   |-- config       #Konfiguration #Sicherheit #API
|   |   |   |   |   |--CorsConfig 
|   |   |   |   |   |--OpenApiConfig
|   |   |   |   |   |--PosterUploadConfig
|   |   |   |   |-- controller   #RESTController #APIEndpunkte
|   |   |   |   |   |--BenachrichtigungController
|   |   |   |   |   |--LoginController    
|   |   |   |   |   |--PasswortVergessenController 
|   |   |   |   |   |--PBController   
|   |   |   |   |   |--PosterController   
|   |   |   |   |   |--PraktikumsantragController  
|   |   |   |   |   |--RegistrierungController
|   |   |   |   |-- models    #Datenmodelle #JPAEntities
|   |   |   |   |   |--AppUserRole
|   |   |   |   |   |--Benachrichtigung
|   |   |   |   |   |--BenachrichtigungWichtigkeit
|   |   |   |   |   |--LoginAnfrage
|   |   |   |   |   |--PasswortVergessenAnfrage
|   |   |   |   |   |--Poster
|   |   |   |   |   |--Praktikumsantrag
|   |   |   |   |   |--Praktikumsbeautragter
|   |   |   |   |   |--RegistrierungsAnfrage
|   |   |   |   |   |--Sicherheitsantwort
|   |   |   |   |   |--Sicherheitsfrage
|   |   |   |   |   |--StatusAntrag
|   |   |   |   |   |--Studentin
|   |   |   |   |-- repositories  #Datenbankzugriff #JPARepositories
|   |   |   |   |   |--BenachrichtigungRepository
|   |   |   |   |   |--PBRepository
|   |   |   |   |   |--PosterRepository
|   |   |   |   |   |--PraktikumsantragRepository
|   |   |   |   |   |--SicherheitsantwortRepository
|   |   |   |   |   |--SicherheitsfrageRepository
|   |   |   |   |   |--StudentinRepository
|   |   |   |   |-- services    
|   |   |   |   |   |--BenachrichtigungService
|   |   |   |   |   |--LoginService
|   |   |   |   |   |--MockDataService
|   |   |   |   |   |--PasswortVergessenService
|   |   |   |   |   |--PBService
|   |   |   |   |   |--RegistrierungService
|   |   |   |   |   |--SicherheitsfragenService
|   |   |--resources/    #Konfigurationsdateien #Ressourcen
|   |   |   |--META-INF.resources.icons
|   |   |   |-- application.properties
|   |   |   |--banner.txt
|   |--test      #UnitTests #ServiceTests
|   |   |--java
|   |   |   |--con.example.application.services
|   |   |   |   |--BenachrichtigungServiceTest
|   |   |   |   |--LoginServiceTest
|   |   |   |   |--MockDataServiceTest
|   |   |   |   |--PasswortVergessenServiceTest
|   |   |   |   |--PBServiceTest
|   |   |   |   |--PosterServiceTest
|   |   |   |   |--PraktikumsantragServiceTest
|   |   |   |   |--RegistrierungServceTest
|   |   |   |   |--SicherheitsfragenServiceTest
|   |   |   |   |
|-- pom.xml                     # Maven Build Datei

```


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