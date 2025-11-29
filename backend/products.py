PRODUCTS = {
    0: {"id": 101, "name": "Sapolio", "price": 5.50, "image": "🧼"},
    1: {"id": 102, "name": "Piqueo", "price": 8.90, "image": "🍟"},
    2: {"id": 103, "name": "Oreo", "price": 2.50, "image": "🍪"},
    3: {"id": 104, "name": "Frugos", "price": 4.20, "image": "🧃"},
}

def get_product_by_class_id(class_id: int):
    return PRODUCTS.get(class_id)
