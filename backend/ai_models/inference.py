from ultralytics import YOLO
import cv2
import numpy as np

model = YOLO('yolov8n.pt') 

def detect_trash_in_image(image_bytes):
    """
    Used by the Monitor (Heatmap) Page.
    Detects objects, draws boxes, and returns detections.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    results = model(img, conf=0.25) 
    detections = []
    
    for result in results:
        img_with_boxes = result.plot()
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            confidence = float(box.conf[0])
            
            detections.append({
                "type": class_name,
                "confidence": round(confidence, 2)
            })

    _, encoded_img = cv2.imencode('.jpg', img_with_boxes)
    return detections, encoded_img.tobytes()


def analyze_truck_load(image_bytes):
    """
    Used by the Site Control Page.
    Analyzes a truck image to estimate fill level and volume.
    """
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    height, width, _ = img.shape
    
    results = model(img, conf=0.15)
    
    truck_detected = False
    max_box_area = 0
    
    for result in results:
        img_with_boxes = result.plot()
        for box in result.boxes:
            class_id = int(box.cls[0])
            class_name = model.names[class_id]
            
            x1, y1, x2, y2 = map(int, box.xyxy[0])
            area = (x2 - x1) * (y2 - y1)
            
            if class_name == 'truck' or area > max_box_area:
                truck_detected = True
                max_box_area = area
    
    total_image_area = height * width
    
    if max_box_area == 0:
        fill_percentage = 0
    else:
        raw_ratio = (max_box_area / total_image_area) * 100
        fill_percentage = min(round(raw_ratio * 1.5), 100)
    
    max_volume_m3 = 20.0 
    max_weight_tons = 12.0
    
    estimated_volume = round((fill_percentage / 100) * max_volume_m3, 1)
    estimated_weight = round((fill_percentage / 100) * max_weight_tons, 1)
    
    overlay_text = f"ANALYSIS: {fill_percentage}% FULL | VOL: {estimated_volume}m3"
    cv2.putText(img_with_boxes, overlay_text, (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 3)

    _, encoded_img = cv2.imencode('.jpg', img_with_boxes)
    
    stats = {
        "fill_percentage": fill_percentage,
        "estimated_volume_m3": estimated_volume,
        "estimated_weight_tons": estimated_weight,
        "truck_detected": truck_detected
    }
    
    return stats, encoded_img.tobytes()