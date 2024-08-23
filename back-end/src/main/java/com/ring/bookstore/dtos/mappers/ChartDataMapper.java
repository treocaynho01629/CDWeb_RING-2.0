package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.ChartDTO;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class ChartDataMapper implements Function<Map<String, Object>, ChartDTO> {
    @Override
    public ChartDTO apply(Map<String, Object> rawData) {
        String name = rawData.get("name").toString();
        Map<String, Long> dataMap = new HashMap<String, Long>();

        //Map back to Long number
        for (Map.Entry<String, Object> e : rawData.entrySet()) {
            if (!e.getKey().equals("name")) {
                if (dataMap.put(e.getKey(), Double.valueOf(e.getValue().toString()).longValue()) != null) {
                    throw new IllegalStateException("Duplicate key");
                }
            }
        }

        return new ChartDTO(name, dataMap);
    }
}
