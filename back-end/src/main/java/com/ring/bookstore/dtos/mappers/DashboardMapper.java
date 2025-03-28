package com.ring.bookstore.dtos.mappers;

import com.ring.bookstore.dtos.dashboard.ChartDTO;
import com.ring.bookstore.dtos.dashboard.IStat;
import com.ring.bookstore.dtos.dashboard.StatDTO;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Service
public class DashboardMapper {

    public StatDTO statToDTO(IStat projection, String id, String label) {
        Double value = Double.valueOf(projection.getTotal());
        BigDecimal diff = BigDecimal.valueOf(projection.getCurrentMonth() == projection.getLastMonth() ? 0
                : projection.getCurrentMonth() / (projection.getLastMonth() == 0 ? 1 : projection.getLastMonth()) - 1);
        return new StatDTO(id, label, value, diff);
    }

    public ChartDTO dataToChartDTO(Map<String, Object> rawData) {
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
