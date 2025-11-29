from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from detector import ObjectDetector
from products import get_product_by_class_id
import uvicorn

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Detector
detector = ObjectDetector(model_path="best.pt")

@app.get("/")
def read_root():
    return {"status": "online", "model_loaded": detector.model is not None}

@app.post("/detect")
async def detect_objects(file: UploadFile = File(...)):
    contents = await file.read()
    detected_class_ids = detector.detect(contents)
    
    detected_products = []
    for cls_id in detected_class_ids:
        product = get_product_by_class_id(cls_id)
        if product:
            detected_products.append(product)
            
    return {"products": detected_products}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
