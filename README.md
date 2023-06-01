# CDWeb_RING-2.0
An E-Commerce Web App using Spring Boot, ViteJS.

## Local setup
#### Database setup (MSSQL)
- Right click on `Database` folder
- Choose `Restore Database`
- Click on `Device` tick
- Find the Initialize database file `RINGSpringBoot.bak` and click `Restore`

#### Change application properties
- Change your Database path in the `application.properties` file
```
spring.datasource.driver-class-name=com.microsoft.sqlserver.jdbc.SQLServerDriver
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS:1433;databaseName=RINGSpringBoot;encrypt=true;trustServerCertificate=true;
spring.datasource.username=<your database username>
spring.datasource.password=<your database password>
```
- Change your Email also
```
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
![TRANGCHU](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/7f8a0e16-5cd5-4a5a-905f-333491769796)
![DANGNHAP](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/c3ef35b5-3e6c-4ec6-b977-d0b53d3e45dc)
![CUAHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/a104be9c-1456-4815-90d6-0d1e43880a04)
![SANPHAM](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/c9ed9b39-7593-4fa4-a5de-dbd77f9515cf)
![GIOHANG](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/613ff035-de26-41a2-8ba1-582b387649b4)
![HOSO](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/b2f8f6f7-a2b5-4d70-b2d3-bf9325dd0168)
![DASHBOARD](https://github.com/treocaynho01629/CDWeb_RING-2.0/assets/91520278/188a14d2-0a0b-445c-b5b9-b8062b981b38)

