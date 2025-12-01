from fastapi import APIRouter, BackgroundTasks, Depends, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from io import BytesIO
from PIL import Image, ImageOps
from pathlib import Path
from random import randint
import os

from users import get_user_data

router = APIRouter(prefix='/invert')


# https://www.getorchestra.io/guides/fastapi-working-with-request-files
# https://stackoverflow.com/questions/55873174/how-do-i-return-an-image-in-fastapi
@router.post('/')
async def image(
    file: UploadFile = File(...),
    background: BackgroundTasks = None,
    user = Depends(get_user_data),
):
    try:
        print('ФАЙЛ:', file.filename)
        print('ПОЛЬЗОВАТЕЛЬ:', user.email, user.role)
        
        img_raw = await file.read()
        img = Image.open(BytesIO(img_raw)).convert('RGB')
        img_res = ImageOps.invert(img)

        img_path = Path(Path(__file__).parent / f'{randint(1000, 9999)}.png')
        img_res.save(img_path)
        background.add_task(os.remove, img_path)

        return FileResponse(
            path=img_path,
            media_type='image/png',
            filename=f'res_{file.filename}',
            status_code=200,
        )
    except:
        return JSONResponse(
            {'error': 'Картинка имеет несовместимый тип или повреждена'},
            status_code=400,
        )
