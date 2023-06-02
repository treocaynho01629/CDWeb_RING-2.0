# CDWeb_RING-2.0
An E-Commerce Web App using Spring Boot, ViteJS.

## Local setup
#### Database setup (MSSQL)
- Right click on `Database` folder
- Choose `Restore Database`
- Click on `Device` tick
- Find the Initialize database files `RINGSpringBoot_1.bak` and `RINGSpringBoot_2.bak` then click `Restore`

#### Change application properties
- Change your Database path in the `application.properties` file
```properties
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS:1433;databaseName=RINGSpringBoot;encrypt=true;trustServerCertificate=true;
spring.datasource.username=<your database username>
spring.datasource.password=<your database password>
```
- Change your Email also
```properties
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=<your email address>
spring.mail.password=<your email application password>
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
```

#### Commands
- Use `npm install` to install and then `npm run dev` to start the front-end
- Use `mvn clean install` to install and then `mvn spring-boot:run` to start the back-end

#### Screenshot
![TRANGCHU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/09f6c3ef-3f51-4b56-b0f9-0933833c5948)
![DANGNHAP](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/0af2586b-4f34-41d8-a798-09c3a0e11635)
![CUAHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/d6805d26-9c0f-4ea4-b092-b07b2b30a03d)
![SANPHAM](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/3d257436-d77a-45bb-855e-f88d8e219ea0)
![DANHGIA](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/d3842ec6-c54d-41e8-8544-61d4979ab17e)
![GIOHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/37f04b04-c4cb-45dc-a7d6-c6032b2e548f)
![THANHTOAN](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/4764df17-e10a-4637-9685-0e433ab96636)
![HOSO](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/097aa531-c5db-445e-9456-76a89e7424f0)
![HOSO2](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/c1a47781-3932-438e-857d-9e651c9aad8e)
![HOSO3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/45755c8b-1f67-42ba-a535-971839b97879)
![DASHBOARD](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/59e99510-5eb5-49db-8244-929681d80fee)
![QUANLYSACH3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/46efa2d6-b441-4488-a1c7-c21d59736e0b)
![QUANLYNGUOIDUNG3](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/1ff758d7-5f19-434c-b90a-b63bf18cc3eb)
![KHOIPHUCMATKHAU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/41077bc8-066d-4e2f-b693-26f87318e224)

