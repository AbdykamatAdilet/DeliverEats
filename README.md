#  DeliverEats — Food Delivery Platform

**DeliverEats** is a full-stack web application designed for seamless food ordering and delivery management. This project is developed as a laboratory work, integrating a robust **Django REST Framework** backend with a dynamic **Angular 17** frontend.

---

## Group Information

1. **Abdykamat Adilet** 
2. **Nurzhankyzy Assem** 
3. **Otarbayev Akzhan** 

**Practice Teacher:** [Teacher's Name]  
**Project Name:** DeliverEats  

--- 

## Project Description (About the Project)

**DeliverEats** aims to bridge the gap between local restaurants and hungry customers. The platform provides a centralized hub where users can explore diverse cuisines, manage their food baskets, and track their orders from kitchen to doorstep.

### Core Functionality:
* **User Experience:** Authenticated users can browse a categorized menu of dishes. Using a modern Angular interface, they can filter meals, view detailed descriptions, and add items to their personal order.
* **Order Lifecycle:** The system supports full CRUD operations. Users can create new orders, view their order history, update delivery details (before processing), or cancel an order if necessary.
* **Secure Environment:** Security is handled via **JWT (JSON Web Tokens)**. Access to ordering features is restricted to logged-in users, ensuring that every order is tied directly to a specific account (`request.user`).
* **Real-time Interaction:** The frontend communicates with the Django API using specialized services and interceptors, handling errors gracefully (e.g., notifying the user if a dish is out of stock or if the server is unreachable).

---

## Getting Started

### 1. Backend Setup (Django)
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

##important
Frontend (Angular)
http://localhost:4200/login — страница входа.

http://localhost:4200/profile — страница профиля.

http://localhost:4200/cart — корзина.

Backend (Django)
http://127.0.0.1:8000/admin/ — панель администратора.

http://127.0.0.1:8000/api/token/ — эндпоинт получения токена.

http://127.0.0.1:8000/api/profile/ — эндпоинт данных пользователя.

http://127.0.0.1:8000/api/cart/ — эндпоинт корзины.
