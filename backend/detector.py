from ultralytics import YOLO
import cv2
import numpy as np
import os

class ObjectDetector:
    def __init__(self, model_path="best.pt"):
        self.model_path = model_path
        self.model = None
        self.load_model()

    def load_model(self):
        if os.path.exists(self.model_path):
            try:
                self.model = YOLO(self.model_path)
                print(f"Model loaded from {self.model_path}")
            except Exception as e:
                print(f"Error loading model: {e}")
                self.model = None
        else:
            print(f"Model file not found at {self.model_path}. Using mock detection.")
            self.model = None

    def detect(self, image_bytes):
        if self.model is None:
            print("Warning: No model loaded. Returning empty detections.")
            return []

        # Convert bytes to numpy array
        nparr = np.frombuffer(image_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if img is None:
            return []

        # Run inference
        results = self.model(img)
        
        detected_classes = []
        for result in results:
            for box in result.boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                if conf > 0.5: # Confidence threshold
                    detected_classes.append(cls_id)
        
        return list(set(detected_classes)) # Return unique classes
