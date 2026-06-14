# MediCare HMS — Hospital Management System

## Overview

A full-stack Hospital Management System built with **Spring Boot** and **React**.

### User Roles

* **Admin** → manages doctors, patients, departments
* **Doctor** → views appointments and patient medical records
* **Patient** → books appointments and views records

---

# Tech Stack

## Backend

* Java 21
* Spring Boot 3
* Spring Security + JWT
* Spring Data JPA
* PostgreSQL
* Hibernate Validator
* Lombok
* Swagger/OpenAPI
* JUnit + Mockito

## Frontend

* React + Vite
* React Router DOM
* Redux Toolkit
* Axios
* TailwindCSS
* React Hook Form + Zod

## DevOps

* Docker
* Docker Compose
* GitHub + GitHub Actions
* Neon PostgreSQL
* Vercel / Render

---

# Core Features

## Authentication

* Register/Login
* JWT Authentication
* Role-based access control

---

## Patient Management

* Add patient
* Update patient
* Delete patient
* View patient details

---

## Doctor Management

* Add doctor
* Update doctor
* Delete doctor
* Assign doctor to department

---

## Department Management

Examples:

* Cardiology
* Neurology
* Orthopedics
* Pediatrics

---

## Appointment Management

* Book appointment
* Cancel appointment
* Complete appointment
* Prevent overlapping doctor bookings

---

## Medical Records

* Diagnosis
* Prescription
* Treatment notes
* Visit history

---

## Dashboard

* Total patients
* Total doctors
* Total appointments
* Department-wise stats

---

# Database Tables

## users

Stores login/authentication data.

```text
id
full_name
email
password_hash
role
phone
is_active
created_at
```

---

## departments

Stores hospital departments.

```text
id
name
description
created_at
```

---

## patients

Stores patient profile data.

```text
id
user_id
date_of_birth
gender
blood_group
address
emergency_contact
allergies
created_at
```

---

## doctors

Stores doctor details.

```text
id
user_id
department_id
specialization
qualification
experience_years
consultation_fee
license_number
is_available
created_at
```

---

## appointments

Stores appointment bookings.

```text
id
patient_id
doctor_id
appointment_date
appointment_time
status
reason
notes
created_at
```

Status:

```text
BOOKED
COMPLETED
CANCELLED
```

---

## medical_records

Stores consultation history.

```text
id
patient_id
doctor_id
appointment_id
diagnosis
prescription
treatment_notes
follow_up_date
created_at
```

---

# Entity Relationship

```text
users
 ├── patients
 └── doctors

departments
 └── doctors

patients
 ├── appointments
 └── medical_records

doctors
 ├── appointments
 └── medical_records

appointments
 └── medical_records
```

---

# Suggested Build Order

## Week 1

* Project setup
* PostgreSQL setup
* JWT auth

## Week 2

* Users + Departments module

## Week 3

* Patient CRUD

## Week 4

* Doctor CRUD

## Week 5

* Appointment booking

## Week 6

* Medical records

## Week 7

* React frontend integration

## Week 8

* Docker + deployment + testing

---

# Deployment

## Backend

* Render / Railway

## Frontend

* Vercel

## Database

* Neon PostgreSQL

---

# Resume Highlights

* Built secure REST APIs with Spring Boot
* Implemented JWT authentication
* Designed PostgreSQL relational schema
* Developed responsive React frontend
* Added role-based authorization
* Dockerized full-stack application
* Deployed to cloud
