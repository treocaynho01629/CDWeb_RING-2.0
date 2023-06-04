# CDWeb_RING-2.0
An E-Commerce Web App using Spring Boot, ViteJS.

#### Feature:
- CRUD Books, Users, Reviews.
- JWT Authentication: Sign in, Sign up, Recover pass
- Search, Filters books, Sell books
- Cart function, Orders, Reviews books

## Local setup
#### Database setup (MSSQL)
- Right click on `Database` folder
- Choose `Restore Database`
- Click on `Device` tick
- Find the Initialize database files `RINGSpringBoot_1.bak` and `RINGSpringBoot_2.bak` then click `Restore`

#### Setup environment variable
- Front-End .env
```.env
VITE_PORT_SOCKET_SPRING=<Your spring application url path>
```
- Back-End .env
```.env
spring_profiles_active=prod
PORT_SOCKET_SPRING=<Your front-end url path>
PROD_DB_HOST=<Your SQL server database path>
PROD_DB_PORT=<Your SQL server database port>
PROD_DB_NAME=RINGSpringBoot
PROD_DB_USERNAME=<Your SQL server username>
PROD_DB_PASSWORD=<Your SQL server password>
USERNAME_EMAIL=<Your email address>
PASSWORD_EMAIL=<Your email app password>
JWT_SECRET_KEY=<Your secret key>
```
[About email app password](https://support.google.com/mail/answer/185833?hl=en)

#### Commands
- Use `npm install` to install and then `npm run dev` to start the front-end | `npm run build` and `npm run preview` to build prod
- Use `mvn clean install` to install and then `mvn spring-boot:run` to start the back-end

#### Screenshot
![TRANGCHU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/7f8a0e16-5cd5-4a5a-905f-333491769796)
![DANGNHAP](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/c3ef35b5-3e6c-4ec6-b977-d0b53d3e45dc)
![CUAHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/a104be9c-1456-4815-90d6-0d1e43880a04)
![SANPHAM](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/c9ed9b39-7593-4fa4-a5de-dbd77f9515cf)
![DANHGIA](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/43062e4c-8885-47cd-8655-51bd79a55cd9)
![GIOHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/613ff035-de26-41a2-8ba1-582b387649b4)
![THANHTOAN](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/dfa79649-5378-4e00-b8ae-978e9329015b)
![HOSO](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/b2f8f6f7-a2b5-4d70-b2d3-bf9325dd0168)
![HOSO2](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/569eec0f-8ada-45ee-990e-c10d08b355a8)
![HOSO3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/31c9cf4a-ea26-45b7-be4e-1260a14280c4)
![DASHBOARD](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/188a14d2-0a0b-445c-b5b9-b8062b981b38)

