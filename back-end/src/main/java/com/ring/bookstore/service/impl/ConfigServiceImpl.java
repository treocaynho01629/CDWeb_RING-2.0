package com.ring.bookstore.service.impl;

import com.ring.bookstore.dtos.enums.EnumsDTO;
import com.ring.bookstore.enums.*;
import com.ring.bookstore.service.ConfigService;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ConfigServiceImpl implements ConfigService {
    @Override
    public List<EnumsDTO> getEnums() {
        List<EnumsDTO> enums = new ArrayList<>();

        //Book types
        Map<String, Map<String, Object>> bookTypes = Arrays.stream(BookType.values())
                .collect(Collectors.toMap(type -> type.name(),
                        type -> {
                            Map<String, Object> typeData = new HashMap<>();
                            typeData.put("value", type.getValue());
                            typeData.put("label", type.getLabel());
                            return typeData;
                        }));
        enums.add(new EnumsDTO("BookType", bookTypes));

        //Book language
        Map<String, Map<String, Object>> bookLanguage = Arrays.stream(BookLanguage.values())
                .collect(Collectors.toMap(lang -> lang.name(),
                        lang -> {
                            Map<String, Object> langData = new HashMap<>();
                            langData.put("value", lang.getValue());
                            langData.put("label", lang.getLabel());
                            return langData;
                        }));
        enums.add(new EnumsDTO("BookLanguage", bookLanguage));

        //User roles
        Map<String, Map<String, Object>> userRoles = Arrays.stream(UserRole.values())
                .collect(Collectors.toMap(role -> role.name(),
                        role -> {
                            Map<String, Object> roleData = new HashMap<>();
                            roleData.put("value", role.getValue());
                            roleData.put("label", role.getLabel());
                            roleData.put("color", role.getColor());
                            return roleData;
                        }));
        enums.add(new EnumsDTO("UserRole", userRoles));

        //Shipping types
        Map<String, Map<String, Object>> shippingTypes = Arrays.stream(ShippingType.values())
                .collect(Collectors.toMap(type -> type.name(),
                        type -> {
                            Map<String, Object> typeData = new HashMap<>();
                            typeData.put("value", type.getValue());
                            typeData.put("label", type.getLabel());
                            typeData.put("description", type.getLabel());
                            typeData.put("color", type.getColor());
                            typeData.put("multiplier", type.getMultiplier());
                            typeData.put("icon", type.getIcon());
                            return typeData;
                        }));
        enums.add(new EnumsDTO("ShippingType", shippingTypes));

        //Image sizes
        Map<String, Map<String, Object>> imageSizes = Arrays.stream(ImageSize.values())
                .collect(Collectors.toMap(size -> size.name(),
                        size -> {
                            Map<String, Object> sizeData = new HashMap<>();
                            sizeData.put("value", size.getValue());
                            sizeData.put("width", size.getWidth());
                            return sizeData;
                        }));
        enums.add(new EnumsDTO("ImageSize", imageSizes));

        return enums;
    }
}
