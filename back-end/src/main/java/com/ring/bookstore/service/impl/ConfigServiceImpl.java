package com.ring.bookstore.service.impl;

import com.ring.bookstore.model.dto.response.enums.EnumsDTO;
import com.ring.bookstore.model.enums.*;
import com.ring.bookstore.service.ConfigService;
import org.springframework.stereotype.Service;

import java.lang.reflect.Field;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConfigServiceImpl implements ConfigService {

    @Override
    public List<EnumsDTO> getEnums() {
        List<EnumsDTO> enums = new ArrayList<>();

        //Book types
        Map<String, Map<String, Object>> bookTypes = Arrays.stream(BookType.values())
                .collect(Collectors.toMap(Enum::name,
                        this::convertToMap,
                        (x, y) -> y, LinkedHashMap::new));
        enums.add(new EnumsDTO("BookType", bookTypes));

        //Book language
        Map<String, Map<String, Object>> bookLanguage = Arrays.stream(BookLanguage.values())
                .collect(Collectors.toMap(Enum::name,
                        this::convertToMap,
                        (x, y) -> y, LinkedHashMap::new));
        enums.add(new EnumsDTO("BookLanguage", bookLanguage));

        //User roles
        Map<String, Map<String, Object>> userRoles = Arrays.stream(UserRole.values())
                .collect(Collectors.toMap(Enum::name,
                        role -> {
                            Map<String, Object> roleData = new HashMap<>();
                            roleData.put("value", role.name());
                            roleData.put("label", role.getLabel());
                            roleData.put("color", role.getColor());
                            return roleData;
                        },
                        (x, y) -> y, LinkedHashMap::new));
        enums.add(new EnumsDTO("UserRole", userRoles));

        //Shipping types
        Map<String, Map<String, Object>> shippingTypes = Arrays.stream(ShippingType.values())
                .collect(Collectors.toMap(Enum::name,
                        this::convertToMap,
                        (x, y) -> y, LinkedHashMap::new));
        enums.add(new EnumsDTO("ShippingType", shippingTypes));

        //Image sizes
        Map<String, Map<String, Object>> imageSizes = Arrays.stream(ImageSize.values())
                .collect(Collectors.toMap(Enum::name,
                        this::convertToMap,
                        (x, y) -> y, LinkedHashMap::new));
        enums.add(new EnumsDTO("ImageSize", imageSizes));

        return enums;
    }

    private Map<String, Object> convertToMap(Enum<?> enumObj) {
        Map<String, Object> typeData = new HashMap<>();

        // Get all fields of the object's class
        Field[] fields = enumObj.getClass().getDeclaredFields();
        typeData.put("value", enumObj.name());

        for (Field field : fields) {
            field.setAccessible(true); // Ensure we can access private fields
            try {
                // Put field name as key and field value as the value in the map
                if (!field.isEnumConstant() && !field.isSynthetic()) {
                    typeData.put(field.getName(), field.get(enumObj));
                }
            } catch (IllegalAccessException e) {
                e.printStackTrace();
            }
        }
        return typeData;
    }
}
