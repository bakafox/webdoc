from fastapi import APIRouter, BackgroundTasks, File, UploadFile
from fastapi.responses import FileResponse, JSONResponse
from io import BytesIO
from PIL import Image, ImageOps
from pathlib import Path
from random import randint
import os

router = APIRouter(prefix='/invert')

# https://stackoverflow.com/questions/65408109/how-do-i-receive-image-and-json-data-in-fastapi
# https://www.getorchestra.io/guides/fastapi-working-with-request-files
# https://stackoverflow.com/questions/55873174/how-do-i-return-an-image-in-fastapi
@router.post('/')
async def image(
    file: UploadFile = File(...),
    background: BackgroundTasks = None
):
    try:
        print('ФАЙЛ:', file.filename)
        
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
