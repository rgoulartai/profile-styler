from fastapi import FastAPI, APIRouter, HTTPException, UploadFile, File, Form
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone
import bcrypt
import base64
from emergentintegrations.llm.chat import LlmChat, UserMessage, ImageContent
import io
from PIL import Image

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'test_database')]

app = FastAPI()
api_router = APIRouter(prefix="/api")

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: str
    name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class UserRegister(BaseModel):
    email: str
    password: str
    name: str

class UserLogin(BaseModel):
    email: str
    password: str

class Photo(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    image_data: str
    filter_applied: Optional[str] = None
    position: Optional[int] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class Layout(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    photo_ids: List[str]
    layout_type: str
    ai_suggestion: Optional[str] = None
    approved: bool = False
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class FilterPreset(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    description: str
    css_filter: str

class Inspiration(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    image_data: str
    description: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

@api_router.post("/auth/register", response_model=User)
async def register(user_data: UserRegister):
    existing_user = await db.users.find_one({"email": user_data.email}, {"_id": 0})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = bcrypt.hashpw(user_data.password.encode('utf-8'), bcrypt.gensalt())
    user = User(email=user_data.email, name=user_data.name)
    user_dict = user.model_dump()
    user_dict['password'] = hashed_password.decode('utf-8')
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    return user

@api_router.post("/auth/login", response_model=User)
async def login(login_data: UserLogin):
    user = await db.users.find_one({"email": login_data.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    if not bcrypt.checkpw(login_data.password.encode('utf-8'), user['password'].encode('utf-8')):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    user.pop('password')
    if isinstance(user['created_at'], str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    
    return User(**user)

@api_router.post("/photos", response_model=Photo)
async def upload_photo(user_id: str = Form(...), image: UploadFile = File(...)):
    contents = await image.read()
    image_base64 = base64.b64encode(contents).decode('utf-8')
    
    photo = Photo(user_id=user_id, image_data=image_base64)
    photo_dict = photo.model_dump()
    photo_dict['created_at'] = photo_dict['created_at'].isoformat()
    
    await db.photos.insert_one(photo_dict)
    return photo

@api_router.get("/photos/{user_id}", response_model=List[Photo])
async def get_photos(user_id: str):
    photos = await db.photos.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for photo in photos:
        if isinstance(photo['created_at'], str):
            photo['created_at'] = datetime.fromisoformat(photo['created_at'])
    return photos

@api_router.delete("/photos/{photo_id}")
async def delete_photo(photo_id: str):
    result = await db.photos.delete_one({"id": photo_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Photo not found")
    return {"message": "Photo deleted successfully"}

@api_router.post("/layouts", response_model=Layout)
async def create_layout(layout: Layout):
    layout_dict = layout.model_dump()
    layout_dict['created_at'] = layout_dict['created_at'].isoformat()
    await db.layouts.insert_one(layout_dict)
    return layout

@api_router.get("/layouts/{user_id}", response_model=List[Layout])
async def get_layouts(user_id: str):
    layouts = await db.layouts.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for layout in layouts:
        if isinstance(layout['created_at'], str):
            layout['created_at'] = datetime.fromisoformat(layout['created_at'])
    return layouts

@api_router.post("/layouts/analyze")
async def analyze_layout(photo_ids: List[str] = Form(...), user_id: str = Form(...)):
    try:
        photos = await db.photos.find({"id": {"$in": photo_ids}}, {"_id": 0}).to_list(1000)
        
        if not photos:
            raise HTTPException(status_code=404, detail="Photos not found")
        
        api_key = os.environ.get('EMERGENT_LLM_KEY', '')
        if not api_key:
            raise HTTPException(status_code=500, detail="AI service not configured")
        
        chat = LlmChat(
            api_key=api_key,
            session_id=f"layout_analysis_{user_id}_{uuid.uuid4()}",
            system_message="You are an expert Instagram profile stylist. Analyze the provided photos and suggest the best layout pattern and filter combinations for a cohesive, professional Instagram grid."
        )
        chat.with_model("openai", "gpt-5.2")
        
        image_contents = []
        for photo in photos[:3]:
            image_contents.append(ImageContent(image_base64=photo['image_data']))
        
        prompt = f"""Analyze these {len(photos)} Instagram photos and provide:
1. Best layout pattern (e.g., checkerboard, row-based, color blocks)
2. Recommended filter style (Vintage, Modern, Moody, Bright)
3. Color palette analysis
4. Posting order recommendation

Provide a concise, actionable response."""
        
        user_message = UserMessage(text=prompt, file_contents=image_contents)
        response = await chat.send_message(user_message)
        
        return {"suggestion": response, "photo_count": len(photos)}
    
    except Exception as e:
        logging.error(f"AI analysis error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@api_router.get("/filters", response_model=List[FilterPreset])
async def get_filters():
    filters = [
        FilterPreset(name="Vintage", description="Warm, nostalgic tones", css_filter="sepia(30%) saturate(120%) brightness(105%)"),
        FilterPreset(name="Modern", description="Clean, crisp look", css_filter="contrast(110%) brightness(105%) saturate(105%)"),
        FilterPreset(name="Moody", description="Dark, dramatic feel", css_filter="brightness(85%) contrast(120%) saturate(90%)"),
        FilterPreset(name="Bright", description="Light and airy", css_filter="brightness(115%) saturate(110%) contrast(95%)"),
    ]
    return filters

@api_router.post("/inspirations", response_model=Inspiration)
async def upload_inspiration(user_id: str = Form(...), image: UploadFile = File(...), description: Optional[str] = Form(None)):
    contents = await image.read()
    image_base64 = base64.b64encode(contents).decode('utf-8')
    
    inspiration = Inspiration(user_id=user_id, image_data=image_base64, description=description)
    inspiration_dict = inspiration.model_dump()
    inspiration_dict['created_at'] = inspiration_dict['created_at'].isoformat()
    
    await db.inspirations.insert_one(inspiration_dict)
    return inspiration

@api_router.get("/inspirations/{user_id}", response_model=List[Inspiration])
async def get_inspirations(user_id: str):
    inspirations = await db.inspirations.find({"user_id": user_id}, {"_id": 0}).to_list(1000)
    for inspiration in inspirations:
        if isinstance(inspiration['created_at'], str):
            inspiration['created_at'] = datetime.fromisoformat(inspiration['created_at'])
    return inspirations

app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()