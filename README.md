<p align="center">
<img width="60" alt="RING Logo" src="https://raw.githubusercontent.com/treocaynho01629/CDWeb_RING-2.0/main/front-end/apps/web/public/logo.svg"/>
</p>
<div align="center">
  <h1 align="center">RING</h1>
</div>

<div align="center">
  
[![treocaynho01629 - CDWeb_RING-2.0](https://img.shields.io/static/v1?label=treocaynho01629&message=CDWeb_RING-2.0&color=blue&logo=github)](https://github.com/treocaynho01629/CDWeb_RING-2.0 "Go to GitHub repo")
[![License](https://img.shields.io/badge/License-GNU_GPLv3-blue)](#license)

</div>

<div align="center">

![screenshot](https://github.com/user-attachments/assets/7095dcec-1f3d-4bdc-b37a-42d44c1ccb6e)

</div>

## Introduction

RING is an E-Commerce Web App built using Spring Boot, ViteJS, Turborepo, and PostgreSQL.

#### Live Demo:
<a href="https://ringdoraz.io.vn/" target="_blank">
  <img src="https://github.com/user-attachments/assets/c56ea83a-4d6b-4b14-8c7e-dddea6bde1e5" width="100" />
</a>
&nbsp;
<a href="https://admin.ringdoraz.io.vn/" target="_blank">
  <img src="https://github.com/user-attachments/assets/c37f89ba-c4b8-4c1e-99d3-5a66ccf89ca0" width="100" />
</a>

#### Guest account:

- Username: `Guest`
- Password: `Guest123`

## Installation Guide

### Setup Environment Variables:

#### Back-end

Create a `.env` file in the back-end directory or edit environment variables configuration of your IDE.

```.env
# =======================
# Spring
# =======================
CLIENT_URL= Web URL (http://localhost:5173/)
DASHBOARD_URL= Dashboard URL (http://localhost:3000/)
PROD_URL=<Optional>

# Database
DB_HOST= PostgreSQL host
DB_PORT= PostgreSQL port
DB_USERNAME= PostgreSQL user name
DB_PASSWORD= PostgreSQL password
DB_NAME= PostgreSQL database name

# Email SMTP service
EMAIL_HOST=
EMAIL_PORT=
EMAIL_PASSWORD=
EMAIL_USERNAME=

# Dev mode email SMTP service <Optional>
TEST_EMAIL_HOST=
TEST_EMAIL_PORT=
TEST_EMAIL_USERNAME=
TEST_EMAIL_PASSWORD=

# Jwt secret key (Base 64)
JWT_SECRET_KEY=
JWT_SECRET_REFRESH_KEY=

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=
RECAPTCHA_V3_SECRET_KEY=

# Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

# Profile
SPRING_PROFILES_ACTIVE= dev || prod
```

#### Front-end

Create a `.env` file in each of the front-end `/apps` directory.

```.env
VITE_API_URL= Api path (http://localhost:8080)
VITE_NODE_ENV= dev || prod
VITE_RECAPTCHA_SITE_KEY=
VITE_RECAPTCHA_V3_SITE_KEY=
```

- [Mailtrap SMTP](https://mailtrap.io/blog/spring-send-email/t) or other SMTP services.
- [Cloudinary SDK](https://cloudinary.com/documentation/java_quickstart)
- [reCAPTCHA](https://developers.google.com/recaptcha)

### Installation:

#### Back-end

- Navigate to back-end directory and run the following commands:
  
```
mvn clean install
mvn spring-boot:run
```

This will install dependencies and start the Spring Boot server.

#### Front-end

- Navigate to the front-end directory and run the following commands:

```
npm install
npm run dev
```

This will install dependencies and start the front-end apps.

### Installation using Docker:

Alternatively, you can use the `docker-compose` file in the root directory to start the back-end and PostgreSQL without manually configuring the environment variables.

- Create a `.env` file in the root directory.

```.env
# =======================
# Posgres
# =======================
POSTGRES_USERNAME=
POSTGRES_PASSWORD=
POSTGRES_DB=

# =======================
# Spring
# =======================
CLIENT_URL= Web URL (http://localhost:5173/)
DASHBOARD_URL= Dashboard URL (http://localhost:3000/)
PROD_URL=<Optional>

# Database
DB_HOST= PostgreSQL host
DB_PORT= PostgreSQL port
DB_USERNAME= PostgreSQL user name
DB_PASSWORD= PostgreSQL password
DB_NAME= PostgreSQL database name

# Email SMTP service
EMAIL_HOST=
EMAIL_PORT=
EMAIL_PASSWORD=
EMAIL_USERNAME=

# Dev mode email SMTP service <Optional>
TEST_EMAIL_HOST=
TEST_EMAIL_PORT=
TEST_EMAIL_USERNAME=
TEST_EMAIL_PASSWORD=

# Jwt secret key (Base 64)
JWT_SECRET_KEY=
JWT_SECRET_REFRESH_KEY=

# Google reCAPTCHA
RECAPTCHA_SECRET_KEY=
RECAPTCHA_V3_SECRET_KEY=

# Cloudinary
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
CLOUDINARY_CLOUD_NAME=

# Profile
SPRING_PROFILES_ACTIVE= dev || prod
```

- Run the following command to build and run the Docker container:

```
docker-compose --env-file .env up --build
```

## License

Released under [GNU GPLv3](/LICENSE) by [@treocaynho01629](https://github.com/treocaynho01629).