def check_for_alerts(sensor_data):
    """Check sensor data and trigger alerts if thresholds are exceeded"""
    
    ALERT_THRESHOLDS = {
        "co2": 1000,
        "nh3": 25,
        "benzene": 10,
        "smoke": 50
    }

    alerts = []

    for key, threshold in ALERT_THRESHOLDS.items():
        if sensor_data.get(key, 0) > threshold:
            alerts.append(f"{key.upper()} level too high: {sensor_data[key]} ppm")

    return alerts