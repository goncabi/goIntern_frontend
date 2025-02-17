# GoIntern

## 📃 Project Description

This project is a web application developed using Vaadin 21, Spring Boot 3 (version 3.3.5), and Maven. It includes both frontend and backend components, as well as an integration with a PostgreSQL database to manage internship applications.

## 📋 Table of Contents

Installation
Usage and Main Features
Project Structure
Configuration
License
Contact

## 🛠️ Installation

### Requirements:

Java JDK 23 (Frontend)
Java JDK 21 (Backend)
Installation Steps

### Clone the repositories:

git clone https://github.com/goncabi/goIntern_frontend
git clone https://github.com/goncabi/goIntern_backend

### Navigate to the project directories:

cd goIntern_frontend
cd goIntern_backend

### Install Dependencies

#### Backend:

mvn clean install

#### Frontend:

npm install

### Run the Application

#### To run both frontend and backend simultaneously:

mvn spring-boot:run

The application will be available at http://localhost:8080.

The project can also be imported into your preferred IDE (Eclipse, IntelliJ IDEA, NetBeans, or VS Code). For more details, check the Vaadin Documentation.

## 🚀 Usage and Main Features

### Key Features
Registration and Authentication (Login): Students can register and log in to the system.
Internship Management: Allows students to fill in internship details, save drafts, delete, and submit applications.
Workdays Calculation: Students can calculate their required internship days and verify if they meet the requirements.
Approval Process: Internship coordinators can view applications in a table, approve or reject them, and provide reasons for rejections.
Status Management: Applications have different statuses (Open, Approved, Rejected, In Progress, Completed).
Poster Upload: After completing the internship, students can upload a poster for verification by the internship coordinator.

## 🔬 Project Structure

´´´

goIntern_frontend/
|-- .idea/                     # IntelliJ IDEA config files
|-- .mvn/                      # Maven Wrapper
|-- src/
|   |-- main/
|   |   |-- bundles/           # Frontend bundle files
|   |   |-- README.md          # Project documentation
|   |   |-- frontend/
|   |   |   |-- generated/     # Automatically generated code
|   |   |   |-- styles/        # CSS files
|   |   |   |-- themes/        # UI themes
|   |   |-- java/
|   |   |   |-- com.example.application/
|   |   |   |   |-- service/   # Service layer and business logic
|   |   |   |   |-- views/     # UI components
|-- pom.xml                    # Maven build file
|-- package.json               # npm dependencies

goIntern_backend/
|-- .idea/                     # IntelliJ IDEA config files
|-- .mvn/                      # Maven Wrapper
|-- src/
|   |-- main/
|   |   |-- java/
|   |   |   |-- com.example.application/
|   |   |   |   |-- controller   # REST Controllers
|   |   |   |   |-- models       # Data models
|   |   |   |   |-- repositories # Database access
|   |   |   |   |-- services     # Service layer
|-- pom.xml                    # Maven build file

´´´

## 📝 License
This project is licensed under the MIT License. For more details, please refer to the LICENSE file.

## 📞 Contact
If you have any questions, feel free to contact us at:

Mira.Khreis@Student.HTW-Berlin.de
Angela.Barzaeva@Student.HTW-Berlin.de
Beyza.Acikgoez@Student.HTW-Berlin.de
Merlind.Pohl@Student.HTW-Berlin.de
Noa.Sauter@Student.HTW-Berlin.de
Gabriela.GoncalvezMontero@Student.HTW-Berlin.de
Maryam.Mirza@Student.HTW-Berlin.de
