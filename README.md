# CDWeb_RING-2.0
An E-Commerce Web App using Spring Boot, ViteJS.

#### Feature:
- CRUD Books, Users, Reviews.
- JWT Authentication: Sign in, Sign up, Recover pass
- Search, Filters books, Sell books
- Cart function, Orders, Reviews books

## Local setup
#### Database
- You can get the MSSQL database files from the old `master` branch and migrate from there

#### Setup environment variable
- Front-End .env
```.env
VITE_PORT_SOCKET_SPRING=<Your spring application url path>
```
- Back-End .env
```.env
SPRING_PROFILES_ACTIVE=<Active profiles>
CLIENT_URL=<Your client path>
DB_HOST=<Your SQL database path>
DB_PORT=<Your SQL database port>
DB_NAME=<Your SQL database name>
DB_USERNAME=<Your SQL username>
DB_PASSWORD=<Your SQL password>
EMAIL_USERNAME=<Your email address>
EMAIL_PASSWORD=<Your email app password>
JWT_SECRET_KEY=<Your secret key>
JWT_SECRET_REFRESH_KEY=<Your refresh secret key>
```
[About email app password](https://support.google.com/mail/answer/185833?hl=en)

#### Commands
- Use `npm install` to install and then `npm run dev` to start the front-end | `npm run build` and `npm run preview` to build prod
- Use `mvn clean install` to install and then `mvn spring-boot:run` to start the back-end

#### Screenshot
![TRANGCHU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/800848dd-97e1-4585-8141-7bf4ee3a3f1b)
![DANGNHAP](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/1c8cd8c5-3eba-4651-9f54-be834782d14e)
![CUAHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/608411ea-8d83-4876-86aa-2517a499dbc7)
![SANPHAM](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/7fcbda25-a641-4443-b5e5-094df7205150)
![DANHGIA](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/879acf5a-3664-4ebd-80ae-1e58ddb756e6)
![GIOHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/b2174ebc-9cfc-4c7a-a2da-3658b0d7b2f9)
![THANHTOAN](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/e3872419-5799-4ed5-ba6d-0f637b017af2)
![HOSO](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/1d391e42-05f2-4225-80f9-a12444e5cb80)
![HOSO2](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/5833f481-8cef-4849-b6a8-ceb22a5f40af)
![HOSO3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/b2eb00ca-90dc-4003-9163-d0416e43344b)
![DASHBOARD](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/056b47e7-7ac0-4aee-952c-204df802c0ee)
![QUANLYSACH3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/d50db8dc-713e-493d-bf54-dbc21f6f7cfc)
![QUANLYNGUOIDUNG3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/58d06db9-15d3-4a03-b981-5ec8cda099ae)
![KHOIPHUCMATKHAU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/26a663d5-963d-4a7e-8008-04695f507749)
